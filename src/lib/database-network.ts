import { setDefaultResultOrder } from "node:dns";
import { setDefaultAutoSelectFamily } from "node:net";

// Ajuste optativo del proceso Node, no del sistema ni del hostname de Neon.
// Útil en redes donde la autoselección IPv4/IPv6 falla. TLS no se modifica.
export function configureDatabaseNetwork() {
  if (process.env.DATABASE_IPV4_ONLY === "true") {
    setDefaultResultOrder("ipv4first");
    setDefaultAutoSelectFamily(false);
  }
}
