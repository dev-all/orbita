import type { Metadata } from "next";
import { getProducts, isDemo } from "@/lib/catalog";
import { StoreHeader, StoreFooter, CartDrawer } from "@/components/store-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Órbita · Cosas para compartir", template: "%s · Órbita" },
  description:
    "Una selección de bazar, mesa y pequeños detalles para tu casa. Proyecto de tienda desde San Miguel, Buenos Aires.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getProducts();
  return (
    <html lang="es-AR">
      <body>
        <a href="#contenido" className="skip-link">
          Ir al contenido
        </a>
        <StoreHeader />
        {isDemo() && (
          <div className="demo-notice">
            Vista de demostración · Productos, precios e ilustraciones de
            muestra · Sin cobros reales
          </div>
        )}
        {children}
        <StoreFooter />
        <CartDrawer products={products} />
      </body>
    </html>
  );
}
