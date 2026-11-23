import { z } from "zod";
const count = z.number().int().min(0).max(1000000);
export const productEditSchema = z
  .object({
    id: z.string().min(1).max(100),
    version: z.string().datetime(),
    name: z.string().trim().min(3).max(120),
    description: z.string().trim().min(10).max(4000),
    category: z.enum(["vajilla", "mesa", "cocina", "organizacion"]),
    active: z.boolean(),
    featured: z.boolean(),
    variants: z
      .array(
        z
          .object({
            id: z.string().min(1).max(100),
            color: z.string().trim().min(1).max(60),
            label: z.string().trim().min(1).max(120),
            priceCents: z.number().int().min(1).max(999999999),
            stock: count,
            sourcing: z.enum(["STOCK", "ON_REQUEST"]),
            supplierConfirmed: z.boolean(),
            supplierAvailable: count,
            leadDays: z.number().int().min(1).max(120),
          })
          .strict(),
      )
      .min(1)
      .max(100),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (new Set(value.variants.map((v) => v.id)).size !== value.variants.length)
      ctx.addIssue({
        code: "custom",
        message: "Hay variantes duplicadas.",
        path: ["variants"],
      });
  });
export type ProductEdit = z.infer<typeof productEditSchema>;
export interface EditableProduct extends ProductEdit {
  slug: string;
  reserved: Record<string, number>;
}
export function priceToCents(value: string): number {
  if (!/^\d{1,7}(?:[.,]\d{1,2})?$/.test(value)) return NaN;
  const [whole, decimal = ""] = value.replace(",", ".").split(".");
  return Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
}
