"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { LockKeyhole, ShoppingBag, FlaskConical } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatMoney, type quoteCart } from "@/lib/commerce";
import type { Product } from "@/lib/types";
type Quote = ReturnType<typeof quoteCart>;

export function Checkout({ products }: { products: Product[] }) {
  const items = useCart((s) => s.items);
  const [postalCode, setPostalCode] = useState("");
  const [delivery, setDelivery] = useState("national");
  const [result, setResult] = useState<{ key: string; quote: Quote } | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const requestKey = JSON.stringify({ items, postalCode, delivery });
  const quote = result?.key === requestKey ? result.quote : null;
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/checkout/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestKey,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "No pudimos revisar tu compra.");
      setResult({ key: requestKey, quote: data });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No pudimos conectar. Intentá nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="container checkout-page" id="contenido">
      <div className="section-title">
        <div>
          <span className="eyebrow">UN PASO MÁS CERCA</span>
          <h1>Revisá tu compra</h1>
          <p>Probá el recorrido antes de habilitar los pagos.</p>
        </div>
        <LockKeyhole size={30} />
      </div>
      <div className="callout">
        <FlaskConical size={22} />
        <p>
          <strong>Entorno de demostración.</strong> Los importes de envío son
          simulados. Este paso no crea pedidos, no reserva stock y no solicita
          datos personales ni tarjetas.
        </p>
      </div>
      {!items.length ? (
        <div className="empty-state">
          <ShoppingBag size={42} />
          <h2>Tu carrito está esperando</h2>
          <Link href="/#catalogo" className="button">
            Elegir productos
          </Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <form onSubmit={submit} className="checkout-form">
            <h2>¿Dónde recibirías tu pedido?</h2>
            <label htmlFor="postal">Código postal de destino</label>
            <input
              id="postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Ej. 1663"
              required
              maxLength={8}
              autoComplete="postal-code"
            />
            <small>
              El origen informado es San Miguel, CP 1643; se verificará antes de
              integrar Correo.
            </small>
            <fieldset>
              <legend>Modalidad de entrega</legend>
              <label className="delivery-option">
                <input
                  type="radio"
                  name="delivery"
                  value="national"
                  checked={delivery === "national"}
                  onChange={(e) => setDelivery(e.target.value)}
                />
                <span>
                  <strong>Envío nacional</strong>
                  <small>Cotización simulada para probar el flujo</small>
                </span>
              </label>
              <label className="delivery-option">
                <input
                  type="radio"
                  name="delivery"
                  value="local"
                  checked={delivery === "local"}
                  onChange={(e) => setDelivery(e.target.value)}
                />
                <span>
                  <strong>Reparto local</strong>
                  <small>Zona y cobertura pendientes de definir</small>
                </span>
              </label>
            </fieldset>
            {error && (
              <p role="alert" className="error-message">
                {error}
              </p>
            )}
            <button className="button full" disabled={loading}>
              {loading
                ? "Revisando disponibilidad…"
                : "Calcular total de prueba"}
            </button>
            <Link className="text-button" href="/#catalogo">
              Seguir eligiendo
            </Link>
          </form>
          <aside className="order-summary">
            <h2>Tu selección</h2>
            {items.map((i) => {
              const p = products.find((p) =>
                p.variants.some((v) => v.id === i.variantId),
              );
              const v = p?.variants.find((v) => v.id === i.variantId);
              return (
                <div className="summary-line" key={i.variantId}>
                  <span>
                    {p?.name ?? "Artículo no disponible"}
                    <small>
                      {v?.color} · {i.quantity} unidades
                    </small>
                  </span>
                  <strong>
                    {formatMoney((v?.priceCents ?? 0) * i.quantity)}
                  </strong>
                </div>
              );
            })}
            {quote ? (
              <div className="quote-result" aria-live="polite">
                <div>
                  <span>Productos</span>
                  <strong>{formatMoney(quote.subtotalCents)}</strong>
                </div>
                <div>
                  <span>Envío simulado</span>
                  <strong>{formatMoney(quote.shippingCents)}</strong>
                </div>
                <div className="quote-total">
                  <span>Total de prueba</span>
                  <strong>{formatMoney(quote.totalCents)}</strong>
                </div>
                <p>
                  Preparación estimada: {quote.leadDays} días hábiles, más
                  tránsito. Valores ficticios.
                </p>
                <div className="payment-pending">
                  <LockKeyhole size={18} />
                  <span>
                    Pagos deshabilitados hasta configurar y validar Mercado
                    Pago.
                  </span>
                </div>
              </div>
            ) : (
              <p className="summary-hint">
                El servidor verificará precios y cantidades cuando calcules el
                total.
              </p>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
