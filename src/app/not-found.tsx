import Link from "next/link";
export default function NotFound() {
  return (
    <main id="contenido" className="container empty-state">
      <span className="eyebrow">404</span>
      <h1>Este rincón todavía está vacío.</h1>
      <p>El producto o la página que buscás no está disponible.</p>
      <Link href="/" className="button">
        Volver a la tienda
      </Link>
    </main>
  );
}
