import Link from "next/link";
import { Sparkles, Gift } from "lucide-react";
import { Catalog } from "@/components/catalog";
import { Benefits } from "@/components/store-shell";
import { ProductArt } from "@/components/product-art";
import { getProducts } from "@/lib/catalog";
import { categories } from "@/lib/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);
  return (
    <main id="contenido">
      <section className="hero container" id="navidad">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <Sparkles size={16} />
            UNA NAVIDAD PARA COMPARTIR
          </span>
          <h1>
            La magia está
            <br />
            en los <em>detalles.</em>
          </h1>
          <p>
            Una mesa que reúne. Un regalo que acompaña.
            <br /> Elegí esas pequeñas cosas que hacen grande cada encuentro.
          </p>
          <Link href="#catalogo" className="button button-light">
            Descubrir la colección
          </Link>
          <div className="hero-caption">
            <span className="fine-line" />
            Bazar y hogar · Colección 2026
          </div>
        </div>
        <div
          className="hero-scene"
          aria-label="Composición ilustrada de una mesa navideña"
        >
          <div className="scene-orbit" />
          <span className="scene-star star-one">✦</span>
          <span className="scene-star star-two">✧</span>
          <div className="scene-textile">
            <ProductArt kind="textile" tone="#d2dcd0" />
          </div>
          <div className="scene-plate">
            <ProductArt kind="plates" tone="#d9cdb7" />
          </div>
          <div className="scene-glass">
            <ProductArt kind="glass" tone="#d2dbcf" />
          </div>
          <div className="scene-cutlery">
            <ProductArt kind="cutlery" tone="#e6dbc5" />
          </div>
          <div className="hero-tag">
            <Gift size={20} />
            <div>
              Para brindar, regalar
              <br />
              <strong>y volver a encontrarnos.</strong>
            </div>
          </div>
          <span className="scene-label">ILUSTRACIÓN DE COLECCIÓN</span>
        </div>
      </section>
      <Benefits />
      <section className="container discovery">
        <div className="mini-heading">
          <h2>Tu casa, a tu manera</h2>
          <span>Encontrá lo que hace falta</span>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/?category=${c.id}#catalogo`}
              className="category-card"
            >
              <div>
                <h3>{c.label}</h3>
                <p>{c.description}</p>
              </div>
              <ProductArt
                kind={c.artwork}
                tone={c.id === "mesa" ? "#d2dcd0" : "#e8e4dc"}
              />
            </Link>
          ))}
        </div>
      </section>
      <Catalog
        key={`${params.q ?? ""}-${params.category ?? ""}`}
        products={products}
        initialQuery={typeof params.q === "string" ? params.q : ""}
        initialCategory={
          typeof params.category === "string" ? params.category : "all"
        }
      />
      <section className="container editorial">
        <span className="editorial-mark">ó</span>
        <div>
          <span className="eyebrow">MENOS VUELTAS. MÁS ENCUENTROS.</span>
          <h2>
            Las mejores cosas
            <br />
            se comparten.
          </h2>
        </div>
        <p>
          Estamos creando una selección de objetos para acompañar tu día a día.
          Empezamos por la mesa, donde siempre hay lugar para uno más.
          <br />
          <Link href="/ayuda">Conocé cómo será comprar en Órbita</Link>
        </p>
      </section>
    </main>
  );
}
