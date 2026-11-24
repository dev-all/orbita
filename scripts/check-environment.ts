import { config } from "dotenv";
import pg from "pg";
import { configureDatabaseNetwork } from "../src/lib/database-network";
config({ path: ".env.local", quiet: true });
config({ quiet: true });
async function main() {
  configureDatabaseNetwork();
  const required = [
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "ADMIN_USER_IDS",
  ];
  let missing = false;
  for (const key of required) {
    const present = !!process.env[key]?.trim();
    console.log(`${key}: ${present ? "configurada" : "pendiente"}`);
    if (!present) missing = true;
  }
  if (process.argv.includes("--database")) {
    if (!process.env.DATABASE_URL) {
      console.log("No se probó PostgreSQL: falta DATABASE_URL.");
      process.exitCode = 1;
    } else {
      const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 10000,
      });
      try {
        await client.connect();
        await client.query("SELECT 1");
        const result = await client.query(
          "SELECT to_regclass('public.\"Product\"') IS NOT NULL AS catalog, to_regclass('public.\"AdminAudit\"') IS NOT NULL AS audit",
        );
        console.log("Conexión PostgreSQL: correcta.");
        console.log(
          `Esquema catálogo: ${result.rows[0].catalog ? "presente" : "pendiente"}; auditoría: ${result.rows[0].audit ? "presente" : "pendiente"}`,
        );
        if (!result.rows[0].catalog || !result.rows[0].audit)
          process.exitCode = 1;
      } catch {
        console.log(
          "No fue posible verificar PostgreSQL. Revisá conexión, red y TLS localmente; no se imprimen secretos.",
        );
        process.exitCode = 1;
      } finally {
        await client.end().catch(() => {});
      }
    }
  } else if (missing) process.exitCode = 1;
}
main().catch(() => {
  console.error(
    "No se pudo verificar la configuración. Revisá los valores localmente.",
  );
  process.exitCode = 1;
});
