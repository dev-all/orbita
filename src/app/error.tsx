"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="contenido" className="container empty-state">
      <h1>No pudimos cargar esta sección.</h1>
      <p>
        Revisá la conexión y la configuración del catálogo. No se modificó tu
        carrito.
      </p>
      <button className="button" onClick={reset}>
        Intentar de nuevo
      </button>
    </main>
  );
}
