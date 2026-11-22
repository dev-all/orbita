import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (await getProducts()).find((p) => p.slug === slug);
  return { title: product?.name ?? "Producto no encontrado" };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return (
    <main id="contenido" className="container detail-page">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <Link href="/#catalogo">Bazar</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <ProductDetail product={product} />
      <section className="related">
        <div className="section-title">
          <div>
            <span className="eyebrow">QUEDAN BIEN JUNTOS</span>
            <h2>Seguí armando tu mesa</h2>
          </div>
        </div>
        <div className="product-grid">
          {products
            .filter(
              (p) => p.id !== product.id && p.category === product.category,
            )
            .slice(0, 4)
            .map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
        </div>
      </section>
    </main>
  );
}
