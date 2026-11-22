import Link from "next/link";
export const metadata = { title: "Cómo comprar" };
export default function Help() {
  return (
    <main id="contenido" className="container information-page">
      <span className="eyebrow">ACERCA DE ESTA TIENDA</span>
      <h1>
        Estamos preparando
        <br />
        cada detalle.
      </h1>
      <p>
        Órbita es el nombre provisional de una tienda en desarrollo. En esta
        versión podés recorrer veinte productos ilustrativos, elegir variantes,
        armar un carrito y calcular un total simulado.
      </p>
      <h2>Entregas desde San Miguel</h2>
      <p>
        Está previsto ofrecer reparto a domicilio y envíos nacionales. No
        tenemos local abierto al público. Cobertura, tarifas y tiempos reales se
        confirmarán antes de habilitar las ventas.
      </p>
      <h2>Stock propio y bajo pedido</h2>
      <p>
        Cada variante indica su disponibilidad. Los productos bajo pedido
        tendrán un plazo adicional de preparación y necesitarán confirmación del
        proveedor antes del cobro.
      </p>
      <h2>Pagos y atención</h2>
      <p>
        Mercado Pago será el medio de cobro. Esta demostración no procesa pagos
        ni recopila datos de clientes. El contacto comercial y las políticas
        definitivas se incorporarán antes de publicar.
      </p>
      <Link className="button" href="/#catalogo">
        Volver a la colección
      </Link>
    </main>
  );
}
