export type Category = "vajilla" | "mesa" | "cocina" | "organizacion";
export type Artwork =
  | "plates"
  | "bowl"
  | "tray"
  | "board"
  | "glass"
  | "jug"
  | "bottle"
  | "cutlery"
  | "textile"
  | "jar";
export interface Variant {
  id: string;
  sku: string;
  label: string;
  color: string;
  priceCents: number;
  stock: number;
  sourcing: "STOCK" | "ON_REQUEST";
  supplierConfirmed: boolean;
  supplierAvailable: number;
  leadDays: number;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  artwork: Artwork;
  tone: string;
  featured: boolean;
  badge: string | null;
  weightGrams: number;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  variants: Variant[];
}
export const categories: {
  id: Category;
  label: string;
  description: string;
  artwork: Artwork;
}[] = [
  {
    id: "vajilla",
    label: "Vajilla y vasos",
    description: "Para compartir algo rico",
    artwork: "plates",
  },
  {
    id: "mesa",
    label: "Una mesa especial",
    description: "Detalles que reúnen",
    artwork: "textile",
  },
  {
    id: "cocina",
    label: "Cocina y servir",
    description: "Todo a mano, todo lindo",
    artwork: "jug",
  },
  {
    id: "organizacion",
    label: "Orden cotidiano",
    description: "Un lugar para cada cosa",
    artwork: "jar",
  },
];
