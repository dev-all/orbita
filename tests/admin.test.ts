import { test } from "node:test";
import assert from "node:assert/strict";
import { isAdminUser } from "../src/lib/admin-policy";
import { productEditSchema, priceToCents } from "../src/lib/admin-schema";
const variant = {
  id: "BAZ-001-01",
  color: "Marfil",
  label: "Juego",
  priceCents: 129050,
  stock: 4,
  sourcing: "STOCK",
  supplierConfirmed: false,
  supplierAvailable: 0,
  leadDays: 2,
};
const product = {
  id: "BAZ-001",
  version: "2026-11-23T00:00:00.000Z",
  name: "Platos Alba",
  description: "Descripción del producto",
  category: "vajilla",
  active: true,
  featured: false,
  variants: [variant],
};
test("solo IDs exactos autorizados; sin identidad ni lista se deniega", () => {
  assert.equal(isAdminUser(null, "user_owner"), false);
  assert.equal(isAdminUser("user_owner", undefined), false);
  assert.equal(isAdminUser("user_own", "user_owner"), false);
  assert.equal(isAdminUser("user_owner", " user_other, user_owner "), true);
});
test("precio decimal sin redondeos flotantes ni notación exponencial", () => {
  assert.equal(priceToCents("1290,50"), 129050);
  assert.equal(priceToCents("0.29"), 29);
  for (const text of ["1e6", "-1", "1.000,50", "12.345", ""])
    assert.ok(Number.isNaN(priceToCents(text)));
});
test("edición rechaza inventario negativo, precios inválidos e identidad inyectada", () => {
  assert.equal(productEditSchema.safeParse(product).success, true);
  for (const delta of [
    { stock: -1 },
    { stock: 0.5 },
    { priceCents: 0 },
    { leadDays: 0 },
  ])
    assert.equal(
      productEditSchema.safeParse({
        ...product,
        variants: [{ ...variant, ...delta }],
      }).success,
      false,
    );
  assert.equal(
    productEditSchema.safeParse({ ...product, actorId: "another-user" })
      .success,
    false,
  );
});
test("variantes repetidas y productos sin versión se rechazan", () => {
  assert.equal(
    productEditSchema.safeParse({ ...product, variants: [variant, variant] })
      .success,
    false,
  );
  assert.equal(
    productEditSchema.safeParse({ ...product, version: "" }).success,
    false,
  );
});
