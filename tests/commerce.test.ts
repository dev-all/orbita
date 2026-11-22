import { test } from "node:test";
import assert from "node:assert/strict";
import { demoProducts } from "../src/lib/catalog-data";
import {
  availableQuantity,
  cartInput,
  quoteCart,
  CommerceError,
} from "../src/lib/commerce";

const base = { postalCode: "1663", delivery: "national" as const };
test("catálogo: 20 productos, SKU y slugs únicos, variantes válidas", () => {
  assert.equal(demoProducts.length, 20);
  assert.equal(new Set(demoProducts.map((p) => p.slug)).size, 20);
  const variants = demoProducts.flatMap((p) => p.variants);
  assert.equal(new Set(variants.map((v) => v.sku)).size, 40);
  for (const v of variants) {
    assert.ok(Number.isSafeInteger(v.priceCents) && v.priceCents > 0);
    assert.ok(v.stock >= 0);
  }
});
test("cantidades negativas, fraccionarias, cero y entradas manipuladas se rechazan", () => {
  for (const quantity of [-1, 0, 1.5, 21])
    assert.equal(
      cartInput.safeParse({
        ...base,
        items: [{ variantId: "BAZ-001-01", quantity }],
      }).success,
      false,
    );
  assert.equal(
    cartInput.safeParse({
      ...base,
      items: [{ variantId: "BAZ-001-01", quantity: 1, priceCents: 1 }],
    }).success,
    false,
  );
});
test("el total se calcula con el precio del catálogo en centavos", () => {
  const quote = quoteCart(
    { ...base, items: [{ variantId: "BAZ-001-01", quantity: 2 }] },
    demoProducts,
  );
  assert.equal(quote.subtotalCents, 8580000);
  assert.equal(quote.totalCents, 9430000);
  assert.equal(quote.simulated, true);
});
test("duplicar una línea no permite sobrepasar stock", () => {
  assert.throws(
    () =>
      quoteCart(
        {
          ...base,
          items: [
            { variantId: "BAZ-001-01", quantity: 5 },
            { variantId: "BAZ-001-01", quantity: 5 },
          ],
        },
        demoProducts,
      ),
    CommerceError,
  );
});
test("las líneas repetidas válidas se consolidan", () => {
  const result = quoteCart(
    {
      ...base,
      items: [
        { variantId: "BAZ-001-01", quantity: 1 },
        { variantId: "BAZ-001-01", quantity: 1 },
      ],
    },
    demoProducts,
  );
  assert.equal(result.lines.length, 1);
  assert.equal(result.lines[0].quantity, 2);
});
test("no se cotizan artículos agotados ni identificadores desconocidos", () => {
  for (const variantId of ["BAZ-020-01", "NO-EXISTE"])
    assert.throws(
      () =>
        quoteCart(
          { ...base, items: [{ variantId, quantity: 1 }] },
          demoProducts,
        ),
      CommerceError,
    );
});
test("bajo pedido requiere confirmación y capacidad del proveedor", () => {
  const v = demoProducts[8].variants[0];
  assert.equal(availableQuantity(v), 5);
  assert.equal(availableQuantity({ ...v, supplierConfirmed: false }), 0);
  assert.throws(
    () =>
      quoteCart(
        { ...base, items: [{ variantId: v.id, quantity: 6 }] },
        demoProducts,
      ),
    CommerceError,
  );
});
test("carrito mixto informa el mayor plazo de preparación", () => {
  const q = quoteCart(
    {
      ...base,
      items: [
        { variantId: "BAZ-001-01", quantity: 1 },
        { variantId: "BAZ-009-01", quantity: 1 },
      ],
    },
    demoProducts,
  );
  assert.equal(q.leadDays, 7);
});
test("acepta CP de 4 dígitos o CPA completo y rechaza valores inválidos", () => {
  const items = [{ variantId: "BAZ-001-01", quantity: 1 }];
  for (const postalCode of ["1663", "B1663ABC"])
    assert.equal(
      cartInput.safeParse({ ...base, postalCode, items }).success,
      true,
    );
  for (const postalCode of ["", "123", "ABCDE", "<script>"])
    assert.equal(
      cartInput.safeParse({ ...base, postalCode, items }).success,
      false,
    );
});
