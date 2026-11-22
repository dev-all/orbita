import { NextResponse } from "next/server";
import { getProducts, isDemo } from "@/lib/catalog";
import { cartInput, CommerceError, quoteCart } from "@/lib/commerce";
export async function POST(request: Request) {
  if (!isDemo())
    return NextResponse.json(
      { error: "La cotización simulada solo está disponible en modo demo." },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length")) > 16000)
    return NextResponse.json(
      { error: "Solicitud demasiado grande." },
      { status: 413 },
    );
  const body = await request.text();
  if (body.length > 16000)
    return NextResponse.json(
      { error: "Solicitud demasiado grande." },
      { status: 413 },
    );
  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "Enviá una solicitud JSON válida." },
      { status: 400 },
    );
  }
  const parsed = cartInput.safeParse(json);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Revisá los datos." },
      { status: 400 },
    );
  try {
    return NextResponse.json(quoteCart(parsed.data, await getProducts()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof CommerceError)
      return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Error cotizando carrito", error);
    return NextResponse.json(
      { error: "No pudimos cotizar el carrito." },
      { status: 500 },
    );
  }
}
