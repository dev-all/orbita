import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { demoProducts } from "../src/lib/catalog-data";
import { configureDatabaseNetwork } from "../src/lib/database-network";
config({ path: ".env.local", quiet: true });
config({ quiet: true });

async function seed() {
  configureDatabaseNetwork();
  if (
    process.env.APP_ENV !== "development" ||
    process.env.NODE_ENV === "production" ||
    process.env.SEED_DEMO !== "CONFIRM_DEVELOPMENT"
  )
    throw new Error(
      "Seed bloqueado. Requiere APP_ENV=development, NODE_ENV distinto de production y SEED_DEMO=CONFIRM_DEVELOPMENT. Usar exclusivamente una base de desarrollo.",
    );
  if (!process.env.DATABASE_URL)
    throw new Error(
      "Falta DATABASE_URL. Configurá una base Neon de desarrollo antes de cargar el seed.",
    );
  const db = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: 2,
    }),
  });
  try {
    // La primera conexión a Neon puede tardar más que la espera por defecto
    // de una transacción interactiva, especialmente con el compute suspendido.
    await db.$connect();
    await db.$transaction(
      async (tx) => {
        await tx.supplier.upsert({
          where: { id: "DEMO-SUPPLIER" },
          update: {},
          create: {
            id: "DEMO-SUPPLIER",
            name: "Proveedor ficticio de desarrollo",
            isDemo: true,
          },
        });
        for (const product of demoProducts) {
          const { variants, ...data } = product;
          await tx.product.upsert({
            where: { id: product.id },
            update: {},
            create: {
              ...data,
              isDemo: true,
              variants: {
                create: variants.map((v) => ({
                  ...v,
                  supplierId:
                    v.sourcing === "ON_REQUEST" ? "DEMO-SUPPLIER" : null,
                })),
              },
            },
          });
        }
        await tx.customer.upsert({
          where: { id: "DEMO-CUSTOMER" },
          update: {},
          create: {
            id: "DEMO-CUSTOMER",
            name: "Cliente de prueba",
            email: "cliente@example.test",
            isDemo: true,
          },
        });
        for (const [index, status] of (
          ["PENDING", "PAID", "CANCELLED"] as const
        ).entries()) {
          const variant = demoProducts[index].variants[0];
          const number = `DEMO-ORDER-${index + 1}`;
          await tx.order.upsert({
            where: { number },
            update: {},
            create: {
              id: number,
              number,
              status,
              isDemo: true,
              customerId: "DEMO-CUSTOMER",
              subtotalCents: variant.priceCents,
              shippingCents: 0,
              totalCents: variant.priceCents,
              items: {
                create: {
                  productName: demoProducts[index].name,
                  sku: variant.sku,
                  color: variant.color,
                  quantity: 1,
                  unitPriceCents: variant.priceCents,
                  leadDays: variant.leadDays,
                  sourcing: variant.sourcing,
                  variantId: variant.id,
                },
              },
              payments: {
                create: {
                  externalId: `DEMO-PAYMENT-${index + 1}`,
                  status:
                    status === "PAID"
                      ? "APPROVED"
                      : status === "CANCELLED"
                        ? "REJECTED"
                        : "PENDING",
                  amountCents: variant.priceCents,
                },
              },
            },
          });
        }
      },
      { maxWait: 20000, timeout: 120000 },
    );
    console.log(
      "Seed completado: 20 productos, 40 variantes, proveedor ficticio y 3 pedidos de prueba. Los registros existentes no se sobrescriben.",
    );
  } finally {
    await db.$disconnect();
  }
}
seed().catch((error) => {
  console.error(error instanceof Error ? error.message : "Falló el seed");
  process.exitCode = 1;
});
