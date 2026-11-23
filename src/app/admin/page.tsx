import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { isDemo } from "@/lib/catalog";
import { demoProducts } from "@/lib/catalog-data";
import { adminAccess } from "@/lib/admin-access";
import { AdminEditor } from "@/components/admin-editor";
import type { EditableProduct } from "@/lib/admin-schema";

export const metadata = { title: "Administración" };
export default async function Admin() {
  const demo = isDemo();
  let products: EditableProduct[];
  if (demo) {
    products = demoProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      active: true,
      featured: p.featured,
      version: "2026-11-23T00:00:00.000Z",
      reserved: {},
      variants: p.variants.map(
        ({
          id,
          color,
          label,
          priceCents,
          stock,
          sourcing,
          supplierConfirmed,
          supplierAvailable,
          leadDays,
        }) => ({
          id,
          color,
          label,
          priceCents,
          stock,
          sourcing,
          supplierConfirmed,
          supplierAvailable,
          leadDays,
        }),
      ),
    }));
  } else {
    const access = await adminAccess();
    if (access.status !== "allowed")
      return (
        <main id="contenido" className="container information-page">
          <h1>Administración protegida</h1>
          <p>
            {access.status === "unconfigured"
              ? "Falta configurar Clerk en .env.local. No ingreses claves en el chat."
              : access.status === "signed-out"
                ? "Ingresá con tu cuenta de administrador."
                : "Tu cuenta no tiene permiso administrativo. El titular debe incluir tu ID en ADMIN_USER_IDS."}
          </p>
          <Link className="button" href="/admin/ingresar">
            Acceso administrativo
          </Link>
        </main>
      );
    const { getDb } = await import("@/lib/db");
    const records = await getDb().product.findMany({
      include: { variants: { orderBy: { sku: "asc" } } },
      orderBy: { name: "asc" },
    });
    products = records.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category as EditableProduct["category"],
      active: p.active,
      featured: p.featured,
      version: p.updatedAt.toISOString(),
      reserved: Object.fromEntries(p.variants.map((v) => [v.id, v.reserved])),
      variants: p.variants.map(
        ({
          id,
          color,
          label,
          priceCents,
          stock,
          sourcing,
          supplierConfirmed,
          supplierAvailable,
          leadDays,
        }) => ({
          id,
          color,
          label,
          priceCents,
          stock,
          sourcing,
          supplierConfirmed,
          supplierAvailable,
          leadDays,
        }),
      ),
    }));
  }
  return (
    <main id="contenido" className="container admin-page">
      <div className="section-title">
        <div>
          <span className="eyebrow">PANEL DE PRODUCTOS</span>
          <h1>Tu catálogo, en orden.</h1>
          <p>
            {products.length} productos ·{" "}
            {demo
              ? "Borradores de demostración"
              : "Edición autenticada en PostgreSQL"}
          </p>
        </div>
        {!demo && <UserButton />}
      </div>
      <div className="callout">
        <p>
          {demo
            ? "Podés probar los formularios sin cuenta. Guardar conserva un borrador en este navegador; no modifica el catálogo público ni la base de datos."
            : "Los cambios requieren autorización administrativa y quedan registrados. El stock físico no puede ser inferior a las reservas."}
        </p>
      </div>
      <AdminEditor products={products} demo={demo} />
    </main>
  );
}
