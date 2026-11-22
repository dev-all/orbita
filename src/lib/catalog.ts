import "server-only";
import { demoProducts } from "./catalog-data";
import type { Artwork, Category, Product } from "./types";

export function isDemo() {
  return (process.env.CATALOG_SOURCE || "demo") === "demo";
}
export async function getProducts(): Promise<Product[]> {
  if (isDemo()) return demoProducts;
  if (process.env.CATALOG_SOURCE !== "database")
    throw new Error("CATALOG_SOURCE debe ser demo o database.");
  const { getDb } = await import("./db");
  const records = await getDb().product.findMany({
    where: { active: true },
    include: { variants: { orderBy: { sku: "asc" } } },
    orderBy: { id: "asc" },
  });
  return records.map((p) => ({
    ...p,
    artwork: p.artwork as Artwork,
    category: p.category as Category,
    variants: p.variants.map((v) => ({
      ...v,
      stock: Math.max(0, v.stock - v.reserved),
    })),
  }));
}
