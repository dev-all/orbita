"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus, SlidersHorizontal, X, Search } from "lucide-react";
import { categories, type Product } from "@/lib/types";
import { availableQuantity, formatMoney } from "@/lib/commerce";
import { useCart } from "@/lib/cart-store";
import { ProductArt } from "./product-art";

export function ProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  const add = useCart((s) => s.add);
  const available = availableQuantity(variant);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link
          href={`/productos/${product.slug}`}
          aria-label={`Ver ${product.name}`}
        >
          <ProductArt
            kind={product.artwork}
            tone={product.tone}
            label={`Ilustración de ${product.name}`}
          />
        </Link>
        {product.badge && (
          <span className={`product-badge ${product.featured ? "accent" : ""}`}>
            {product.badge}
          </span>
        )}
        <button
          className="quick-add"
          aria-label={`Agregar ${product.name} al carrito`}
          disabled={available === 0}
          onClick={() => add(variant.id, available)}
        >
          <Plus size={19} />
        </button>
      </div>
      <div className="product-meta">
        <span>{categories.find((c) => c.id === product.category)?.label}</span>
        <span className={available ? "stock-indicator" : "muted"}>
          {available
            ? variant.sourcing === "ON_REQUEST"
              ? "Bajo pedido"
              : "Disponible"
            : "Sin stock"}
        </span>
      </div>
      <h3>
        <Link href={`/productos/${product.slug}`}>{product.name}</Link>
      </h3>
      <p>{variant.label}</p>
      <div className="product-price">
        {formatMoney(variant.priceCents)}
        <small>ARS</small>
      </div>
      <div className="color-options" aria-label="Opciones de color">
        <span style={{ background: product.tone }} />
        <span style={{ background: "#a5a59c" }} />
        <small>2 variantes</small>
      </div>
    </article>
  );
}

export function Catalog({
  products,
  initialQuery = "",
  initialCategory = "all",
}: {
  products: Product[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    categories.some((c) => c.id === initialCategory) ? initialCategory : "all",
  );
  const [sort, setSort] = useState("featured");
  const [onlyStock, setOnlyStock] = useState(false);
  const [filters, setFilters] = useState(false);
  const normalized = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const visible = products
    .filter(
      (p) =>
        (category === "all" || p.category === category) &&
        p.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(normalized) &&
        (!onlyStock || p.variants.some((v) => availableQuantity(v) > 0)),
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.variants[0].priceCents - b.variants[0].priceCents
        : sort === "desc"
          ? b.variants[0].priceCents - a.variants[0].priceCents
          : sort === "name"
            ? a.name.localeCompare(b.name, "es")
            : Number(b.featured) - Number(a.featured),
    );
  return (
    <section className="container catalog-section" id="catalogo">
      <div className="section-title">
        <div>
          <span className="eyebrow">ELEGIDOS PARA TU CASA</span>
          <h2>Pequeñas cosas. Grandes momentos.</h2>
          <p>Lo cotidiano también merece algo especial.</p>
        </div>
        <span className="catalog-count">
          {products.length} productos para descubrir
        </span>
      </div>
      <div className="catalog-toolbar">
        <div className="category-tabs" role="group" aria-label="Categorías">
          <button
            className={category === "all" ? "active" : ""}
            onClick={() => setCategory("all")}
          >
            Todo el bazar
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={category === c.id ? "active" : ""}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          className={`filter-toggle ${filters ? "selected" : ""}`}
          onClick={() => setFilters(!filters)}
          aria-expanded={filters}
        >
          <SlidersHorizontal size={17} />
          Filtros
        </button>
      </div>
      {filters && (
        <div className="filter-panel">
          <label className="inline-search">
            <Search size={18} />
            <input
              placeholder="Buscar en el catálogo"
              aria-label="Buscar en el catálogo"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={onlyStock}
              onChange={(e) => setOnlyStock(e.target.checked)}
            />
            Solo disponibles para comprar
          </label>
          <button
            className="text-button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setOnlyStock(false);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
      <div className="results-row">
        <span>
          {visible.length} resultados{" "}
          {query && (
            <button className="query-chip" onClick={() => setQuery("")}>
              {query}
              <X size={12} />
            </button>
          )}
        </span>
        <label>
          Ordenar por{" "}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Ordenar productos"
          >
            <option value="featured">Nuestros favoritos</option>
            <option value="asc">Menor precio</option>
            <option value="desc">Mayor precio</option>
            <option value="name">Nombre</option>
          </select>
        </label>
      </div>
      {visible.length ? (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={36} />
          <h3>No encontramos esos productos</h3>
          <p>Probá otra búsqueda o elegí una categoría diferente.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setOnlyStock(false);
            }}
          >
            Ver todo el catálogo
          </button>
        </div>
      )}
      <div className="catalog-end">
        <span>Elegí con calma. Encontrá tu próximo favorito.</span>
        <a href="#catalogo">Volver al inicio del catálogo</a>
      </div>
    </section>
  );
}
