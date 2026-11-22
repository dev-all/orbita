"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Search,
  ShoppingBag,
  X,
  Minus,
  Plus,
  PackageCheck,
  Truck,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { availableQuantity, formatMoney } from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { ProductArt } from "./product-art";

export function StoreHeader() {
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  return (
    <>
      <div className="announcement">
        Un encuentro, mil detalles. Encontrá algo especial para tu casa.
      </div>
      <header className="site-header">
        <div className="container header-main">
          <Link className="brand" href="/" aria-label="Órbita, inicio">
            <span className="brand-symbol">ó</span>órbita
            <span className="brand-dot">.</span>
          </Link>
          <form action="/" className="search-box" role="search">
            <Search size={19} />
            <input
              name="q"
              aria-label="Buscar productos"
              placeholder="¿Qué estás buscando para tu casa?"
            />
            <button type="submit">Buscar</button>
          </form>
          <button
            className="cart-trigger"
            onClick={() => setOpen(true)}
            aria-label={`Abrir carrito, ${items.reduce((n, i) => n + i.quantity, 0)} artículos`}
          >
            <ShoppingBag size={22} />
            <span>Mi carrito</span>
            <b>{items.reduce((n, i) => n + i.quantity, 0)}</b>
          </button>
        </div>
        <nav className="container nav-row" aria-label="Navegación principal">
          <Link href="/#catalogo">Todos los productos</Link>
          <Link href="/?category=vajilla#catalogo">Vajilla y vasos</Link>
          <Link href="/?category=cocina#catalogo">Cocina</Link>
          <Link href="/?category=mesa#catalogo">Mesa y textiles</Link>
          <Link href="/?category=organizacion#catalogo">Organización</Link>
          <Link className="season-link" href="/#navidad">
            Especial Navidad <span>2026</span>
          </Link>
        </nav>
      </header>
    </>
  );
}

export function Benefits() {
  return (
    <section className="benefits container" aria-label="Cómo comprás">
      <div>
        <Truck />
        <span>
          <strong>Desde San Miguel</strong>
          <small>Envíos a todo el país</small>
        </span>
      </div>
      <div>
        <ShieldCheck />
        <span>
          <strong>Mercado Pago</strong>
          <small>Integración en preparación</small>
        </span>
      </div>
      <div>
        <PackageCheck />
        <span>
          <strong>Cada detalle cuenta</strong>
          <small>Disponibilidad por variante</small>
        </span>
      </div>
      <div>
        <CircleHelp />
        <span>
          <strong>Estamos para ayudarte</strong>
          <small>Atención online, sin local al público</small>
        </span>
      </div>
    </section>
  );
}

export function StoreFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand" href="/">
            órbita.
          </Link>
          <p>
            Cosas que elegís.
            <br />
            Momentos que compartís.
          </p>
          <small>Nombre e identidad provisionales.</small>
        </div>
        <div>
          <h3>Explorá la tienda</h3>
          <Link href="/#catalogo">Todos los productos</Link>
          <Link href="/#navidad">Colección Navidad</Link>
          <Link href="/ayuda">Envíos y compras</Link>
        </div>
        <div>
          <h3>Hecho para lo cotidiano</h3>
          <p>
            Bazar, mesa y pequeños detalles.
            <br />
            Desde San Miguel, Buenos Aires.
          </p>
          <Link href="/admin">Vista de administración</Link>
        </div>
        <div className="footer-note">
          <strong>Estamos construyendo algo lindo.</strong>
          <p>
            Esta es una tienda de demostración. El catálogo y sus ilustraciones
            son ficticios. No se realizan cobros.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Órbita · Proyecto en desarrollo
        </span>
        <span>Argentina · Precios en pesos</span>
      </div>
    </footer>
  );
}

export function CartDrawer({ products }: { products: Product[] }) {
  const cart = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (cart.open && !dialog.open) dialog.showModal();
    if (!cart.open && dialog.open) dialog.close();
    if (cart.open) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [cart.open]);
  const lines = cart.items.map((item) => {
    const product = products.find((p) =>
      p.variants.some((v) => v.id === item.variantId),
    );
    return {
      item,
      product,
      variant: product?.variants.find((v) => v.id === item.variantId),
    };
  });
  const total = lines.reduce(
    (n, l) => n + (l.variant?.priceCents ?? 0) * l.item.quantity,
    0,
  );
  return (
    <dialog
      ref={ref}
      className="cart-dialog"
      onCancel={() => cart.setOpen(false)}
      onClose={() => cart.setOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) cart.setOpen(false);
      }}
      aria-labelledby="cart-title"
    >
      <div className="cart-panel">
        <div className="drawer-header">
          <h2 id="cart-title">
            Tu carrito <span>({cart.items.length})</span>
          </h2>
          <button
            className="icon-button"
            aria-label="Cerrar carrito"
            onClick={() => cart.setOpen(false)}
          >
            <X />
          </button>
        </div>
        <div className="drawer-body">
          {!lines.length ? (
            <div className="empty-state">
              <ShoppingBag size={42} />
              <h3>Acá empieza algo lindo</h3>
              <p>Sumá tus favoritos y armá tu próxima mesa.</p>
              <button className="button" onClick={() => cart.setOpen(false)}>
                Explorar productos
              </button>
            </div>
          ) : (
            lines.map(({ item, product, variant }) => (
              <div className="cart-line" key={item.variantId}>
                {product && (
                  <ProductArt
                    kind={product.artwork}
                    tone={product.tone}
                    label={`Ilustración de ${product.name}`}
                  />
                )}
                <div>
                  <strong>{product?.name ?? "Producto no disponible"}</strong>
                  <small>
                    {variant?.color} · {variant?.label}
                  </small>
                  <b>
                    {formatMoney((variant?.priceCents ?? 0) * item.quantity)}
                  </b>
                  <div className="quantity">
                    <button
                      aria-label={`Quitar una unidad de ${product?.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        cart.setQuantity(
                          item.variantId,
                          item.quantity - 1,
                          variant ? availableQuantity(variant) : 0,
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Sumar una unidad de ${product?.name}`}
                      disabled={
                        !variant ||
                        item.quantity >=
                          Math.min(20, availableQuantity(variant))
                      }
                      onClick={() =>
                        cart.setQuantity(
                          item.variantId,
                          item.quantity + 1,
                          variant ? availableQuantity(variant) : 0,
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  className="remove"
                  aria-label={`Eliminar ${product?.name ?? "artículo"}`}
                  onClick={() => cart.remove(item.variantId)}
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        {lines.length > 0 && (
          <div className="drawer-summary">
            <div>
              <span>Subtotal</span>
              <strong>{formatMoney(total)}</strong>
            </div>
            <p>Entrega y disponibilidad se revisan en el siguiente paso.</p>
            <Link
              className="button full"
              href="/checkout"
              onClick={() => cart.setOpen(false)}
            >
              Revisar mi compra
            </Link>
            <small>Modo demostración · No se realizan cobros</small>
          </div>
        )}
      </div>
    </dialog>
  );
}
