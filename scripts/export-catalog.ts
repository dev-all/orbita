import { mkdirSync, writeFileSync } from "node:fs";
import { demoProducts } from "../src/lib/catalog-data";
const headers = [
  "sku",
  "producto",
  "slug",
  "categoria",
  "variante",
  "color",
  "precio_ars",
  "stock",
  "abastecimiento",
  "disponible_proveedor",
  "dias_preparacion",
  "peso_g",
  "ancho_cm",
  "alto_cm",
  "profundidad_cm",
  "imagen_url",
  "es_demostracion",
];
const rows = demoProducts.flatMap((p) =>
  p.variants.map((v) => [
    v.sku,
    p.name,
    p.slug,
    p.category,
    v.label,
    v.color,
    v.priceCents / 100,
    v.stock,
    v.sourcing,
    v.supplierAvailable,
    v.leadDays,
    p.weightGrams,
    p.widthCm,
    p.heightCm,
    p.depthCm,
    "",
    true,
  ]),
);
const csv = (rows: (string | number | boolean)[][]) =>
  "\uFEFF" +
  rows
    .map((row) =>
      row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(";"),
    )
    .join("\r\n") +
  "\r\n";
mkdirSync("data", { recursive: true });
writeFileSync("data/catalogo-demostracion.csv", csv([headers, ...rows]));
writeFileSync("data/plantilla-catalogo-real.csv", csv([headers]));
console.log(
  "Exportados catálogo de muestra (40 variantes) y plantilla vacía a data/. Separador: punto y coma. UTF-8 con BOM.",
);
