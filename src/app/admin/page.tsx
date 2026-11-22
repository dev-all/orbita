import { getProducts, isDemo } from "@/lib/catalog";
import { availableQuantity, formatMoney } from "@/lib/commerce";
import { Package, Layers, ClipboardList } from "lucide-react";
export const metadata = { title: "Administración de muestra" };
export default async function Admin() {
  if (!isDemo())
    return (
      <main id="contenido" className="container information-page">
        <h1>Administración bloqueada</h1>
        <p>
          Es necesario integrar autenticación y autorización administrativa
          antes de habilitar operaciones sobre la base de datos.
        </p>
      </main>
    );
  const products = await getProducts();
  return (
    <main id="contenido" className="container admin-page">
      <div className="section-title">
        <div>
          <span className="eyebrow">VISTA PREVIA DEL PANEL</span>
          <h1>Todo empieza por un buen orden.</h1>
          <p>Catálogo de demostración · Solo lectura · Sin datos personales</p>
        </div>
      </div>
      <div className="admin-stats">
        <div>
          <Package />
          <span>Productos</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <Layers />
          <span>Variantes</span>
          <strong>{products.reduce((n, p) => n + p.variants.length, 0)}</strong>
        </div>
        <div>
          <ClipboardList />
          <span>Compras reales</span>
          <strong>Deshabilitadas</strong>
        </div>
      </div>
      <div className="callout">
        <p>
          Esta vista pública solo muestra información ficticia. La
          administración real permanecerá bloqueada hasta implementar acceso por
          rol, auditoría y operaciones de inventario.
        </p>
      </div>
      <div className="table-scroll">
        <table>
          <caption>Inventario de muestra</caption>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Variante</th>
              <th>Precio</th>
              <th>Abastecimiento</th>
              <th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            {products.flatMap((p) =>
              p.variants.map((v) => (
                <tr key={v.id}>
                  <td>{v.sku}</td>
                  <td>{p.name}</td>
                  <td>{v.color}</td>
                  <td>{formatMoney(v.priceCents)}</td>
                  <td>
                    {v.sourcing === "STOCK" ? "Stock propio" : "Bajo pedido"}
                  </td>
                  <td>{availableQuantity(v)}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
