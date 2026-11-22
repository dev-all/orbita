"use client";
import { useState } from "react";
import { ShoppingBag, Truck, Package, ShieldCheck } from "lucide-react";
import { ProductArt } from "./product-art";
import type { Product } from "@/lib/types";
import { availableQuantity, formatMoney } from "@/lib/commerce";
import { useCart } from "@/lib/cart-store";

export function ProductDetail({ product }: { product: Product }) {
  const [selected, setSelected] = useState(product.variants[0].id);
  const variant = product.variants.find((v) => v.id === selected)!;
  const add = useCart((s) => s.add);
  const available = availableQuantity(variant);
  return (
    <div className="detail-grid">
      <div className="detail-image">
        <ProductArt
          kind={product.artwork}
          tone={product.tone}
          label={`Ilustración de ${product.name}`}
        />
        <span>Imagen ilustrativa · Producto de demostración</span>
      </div>
      <div className="detail-copy">
        <span className="eyebrow">COLECCIÓN BAZAR Y HOGAR</span>
        <h1>{product.name}</h1>
        <p className="detail-subtitle">{variant.label}</p>
        <div className="detail-price">
          {formatMoney(variant.priceCents)}
          <span>ARS</span>
        </div>
        <p>{product.description}</p>
        <fieldset className="variant-picker">
          <legend>
            Color: <strong>{variant.color}</strong>
          </legend>
          {product.variants.map((v) => (
            <button
              key={v.id}
              className={selected === v.id ? "selected" : ""}
              onClick={() => setSelected(v.id)}
              aria-pressed={selected === v.id}
            >
              {v.color}
            </button>
          ))}
        </fieldset>
        <div className={`availability ${available ? "" : "unavailable"}`}>
          <Package size={18} />
          {available
            ? variant.sourcing === "ON_REQUEST"
              ? `Bajo pedido · Preparación estimada: ${variant.leadDays} días hábiles`
              : `Stock de muestra: ${available} disponibles · Preparación: ${variant.leadDays} días hábiles`
            : "Variante sin stock"}
        </div>
        <button
          className="button full"
          disabled={!available}
          onClick={() => add(variant.id, available)}
        >
          <ShoppingBag size={19} />
          {available ? "Agregar al carrito" : "Sin disponibilidad"}
        </button>
        <div className="detail-reassurance">
          <div>
            <Truck size={18} />
            <span>Despacho desde San Miguel. Envío a domicilio.</span>
          </div>
          <div>
            <ShieldCheck size={18} />
            <span>Checkout de prueba. No se efectúan cobros.</span>
          </div>
        </div>
        <small className="sku">SKU: {variant.sku}</small>
      </div>
    </div>
  );
}
