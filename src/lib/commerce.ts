import { z } from "zod";
import type { Product, Variant } from "./types";

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
export function availableQuantity(variant: Variant) {
  return variant.sourcing === "STOCK"
    ? variant.stock
    : variant.supplierConfirmed
      ? variant.supplierAvailable
      : 0;
}
export const cartInput = z
  .object({
    items: z
      .array(
        z
          .object({
            variantId: z.string().min(1).max(80),
            quantity: z.number().int().min(1).max(20),
          })
          .strict(),
      )
      .min(1)
      .max(40),
    postalCode: z
      .string()
      .trim()
      .regex(
        /^(?:[A-Za-z]\d{4}[A-Za-z]{3}|\d{4})$/,
        "Ingresá un código postal argentino de 4 dígitos o CPA completo",
      ),
    delivery: z.enum(["national", "local"]),
  })
  .strict();
export type CartInput = z.infer<typeof cartInput>;
export class CommerceError extends Error {}

export function quoteCart(input: CartInput, products: Product[]) {
  const quantities = new Map<string, number>();
  for (const item of input.items)
    quantities.set(
      item.variantId,
      (quantities.get(item.variantId) ?? 0) + item.quantity,
    );
  const lines = [...quantities].map(([variantId, quantity]) => {
    const product = products.find((p) =>
      p.variants.some((v) => v.id === variantId),
    );
    const variant = product?.variants.find((v) => v.id === variantId);
    if (!product || !variant)
      throw new CommerceError("Un artículo ya no está disponible.");
    if (quantity > 20 || quantity > availableQuantity(variant))
      throw new CommerceError(
        `Revisá la cantidad disponible de ${product.name}.`,
      );
    return {
      variantId,
      productName: product.name,
      sku: variant.sku,
      color: variant.color,
      quantity,
      unitPriceCents: variant.priceCents,
      totalCents: variant.priceCents * quantity,
      leadDays: variant.leadDays,
      sourcing: variant.sourcing,
    };
  });
  const subtotalCents = lines.reduce(
    (total, line) => total + line.totalCents,
    0,
  );
  // Solo simulación. Nunca representa una tarifa de Correo Argentino.
  const shippingCents = input.delivery === "local" ? 450000 : 850000;
  return {
    lines,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    leadDays: Math.max(...lines.map((l) => l.leadDays)),
    simulated: true as const,
    currency: "ARS" as const,
  };
}
