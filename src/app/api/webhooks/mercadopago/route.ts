import { NextResponse } from "next/server";
export function POST() {
  return NextResponse.json(
    {
      error:
        "Integración pendiente de configurar y validar. No se procesan pagos.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
