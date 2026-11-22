import { Checkout } from "@/components/checkout";
import { getProducts, isDemo } from "@/lib/catalog";
export const metadata = { title: "Revisar compra" };
export default async function CheckoutPage() {
  if (!isDemo())
    return (
      <main id="contenido" className="container information-page">
        <h1>Checkout todavía no habilitado</h1>
        <p>
          La integración de pagos y las cotizaciones reales deben validarse
          antes de recibir compras.
        </p>
      </main>
    );
  return <Checkout products={await getProducts()} />;
}
