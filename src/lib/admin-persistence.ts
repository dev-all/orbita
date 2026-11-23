import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import type { ProductEdit } from "./admin-schema";
export class EditConflict extends Error {}
// Uso interno: el llamador debe validar identidad, permisos y datos antes de invocar.
export async function persistProduct(
  db: PrismaClient,
  data: ProductEdit,
  actorId: string,
) {
  if (!actorId) throw new EditConflict("Falta la identidad del administrador.");
  return db.$transaction(async (tx) => {
    const current = await tx.product.findUnique({
      where: { id: data.id },
      include: { variants: true },
    });
    if (!current || current.updatedAt.toISOString() !== data.version)
      throw new EditConflict(
        "El producto cambió. Recargá el panel antes de guardar.",
      );
    if (
      current.variants.length !== data.variants.length ||
      data.variants.some((v) => !current.variants.some((c) => c.id === v.id))
    )
      throw new EditConflict("Las variantes no coinciden con el producto.");
    for (const v of data.variants) {
      const original = current.variants.find((c) => c.id === v.id)!;
      if (v.stock < original.reserved)
        throw new EditConflict(
          "El stock no puede ser menor a las unidades reservadas.",
        );
    }
    const updatedAt = new Date(
      Math.max(Date.now(), current.updatedAt.getTime() + 1),
    );
    const result = await tx.product.updateMany({
      where: { id: data.id, updatedAt: new Date(data.version) },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        active: data.active,
        featured: data.featured,
        updatedAt,
      },
    });
    if (result.count !== 1)
      throw new EditConflict(
        "Otra edición se guardó primero. Recargá el panel.",
      );
    for (const v of data.variants) {
      const original = current.variants.find((c) => c.id === v.id)!;
      // La condición se vuelve a evaluar en la escritura, incluso ante reservas concurrentes.
      const changed = await tx.variant.updateMany({
        where: { id: v.id, stock: original.stock, reserved: original.reserved },
        data: {
          ...v,
          supplierConfirmedAt: v.supplierConfirmed ? new Date() : null,
        },
      });
      if (changed.count !== 1)
        throw new EditConflict(
          "Cambió el inventario reservado. Recargá el panel.",
        );
      if (v.stock !== original.stock)
        await tx.stockMovement.create({
          data: {
            variantId: v.id,
            quantity: v.stock - original.stock,
            reason: `ADMIN:${actorId}`,
            reference: crypto.randomUUID(),
          },
        });
    }
    await tx.adminAudit.create({
      data: {
        actorId: actorId,
        productId: data.id,
        action: "UPDATE_PRODUCT",
        before: JSON.parse(JSON.stringify(current)),
        after: JSON.parse(JSON.stringify(data)),
      },
    });
    return updatedAt.toISOString();
  });
}
