"use server";
import { revalidatePath } from "next/cache";
import { adminAccess } from "@/lib/admin-access";
import { productEditSchema } from "@/lib/admin-schema";
import { getDb } from "@/lib/db";
import { EditConflict, persistProduct } from "@/lib/admin-persistence";
export async function saveProduct(
  input: unknown,
): Promise<{ ok: boolean; message: string; version?: string }> {
  // Toda mutación vuelve a comprobar permisos; no confía en el layout ni el cliente.
  if (process.env.CATALOG_SOURCE !== "database")
    return { ok: false, message: "La demostración no escribe en PostgreSQL." };
  const access = await adminAccess();
  if (access.status !== "allowed")
    return {
      ok: false,
      message: "No tenés autorización para guardar cambios.",
    };
  const parsed = productEditSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisá los datos.",
    };
  const data = parsed.data;
  try {
    const version = await persistProduct(getDb(), data, access.userId);
    revalidatePath("/", "layout");
    return { ok: true, message: "Cambios guardados en PostgreSQL.", version };
  } catch (error) {
    if (error instanceof EditConflict)
      return { ok: false, message: error.message };
    console.error(
      "Falló edición administrativa",
      error instanceof Error ? error.name : "unknown",
    );
    return {
      ok: false,
      message:
        "No se guardaron los cambios. Revisá la conexión o recargá el panel.",
    };
  }
}
