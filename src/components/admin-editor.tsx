"use client";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { saveProduct } from "@/app/admin/actions";
import { categories } from "@/lib/types";
import {
  priceToCents,
  productEditSchema,
  type EditableProduct,
  type ProductEdit,
} from "@/lib/admin-schema";

const subscribe = () => () => {};
export function AdminEditor({
  products,
  demo,
}: {
  products: EditableProduct[];
  demo: boolean;
}) {
  const [items, setItems] = useState(products);
  const [selected, setSelected] = useState(products[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const product = items.find((p) => p.id === selected);
  function update(value: EditableProduct) {
    setItems((all) => all.map((p) => (p.id === value.id ? value : p)));
    setNotice(
      demo
        ? "Borrador guardado en este navegador; no modifica la tienda pública."
        : "Cambios guardados en PostgreSQL.",
    );
  }
  function restore() {
    try {
      const raw = JSON.parse(
        localStorage.getItem("orbita-admin-demo-v1") ?? "null",
      );
      if (!Array.isArray(raw)) throw new Error();
      const values: EditableProduct[] = products.map((original) => {
        const candidate = raw.find((p: ProductEdit) => p.id === original.id);
        const checked = productEditSchema.safeParse(candidate);
        return checked.success ? { ...original, ...checked.data } : original;
      });
      setItems(values);
      setRevision((n) => n + 1);
      setNotice("Borrador local restaurado. No cambia la tienda pública.");
    } catch {
      setNotice("No hay un borrador válido en este navegador.");
    }
  }
  return (
    <section className="admin-workspace">
      {demo && (
        <div className="admin-draft-tools">
          <button className="text-button" onClick={restore}>
            Restaurar borrador local
          </button>
          <button
            className="text-button"
            onClick={() => {
              localStorage.removeItem("orbita-admin-demo-v1");
              setItems(products);
              setRevision((n) => n + 1);
              setNotice("Borrador de demostración descartado.");
            }}
          >
            Descartar borrador
          </button>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      <div className="admin-editor-grid">
        <aside className="admin-product-list">
          <label>
            Buscar producto o SKU
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre o BAZ-001"
            />
          </label>
          {items
            .filter((p) =>
              `${p.name} ${p.id} ${p.variants.map((v) => v.id).join(" ")}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((p) => (
              <button
                className={p.id === selected ? "selected" : ""}
                key={p.id}
                onClick={() => setSelected(p.id)}
              >
                <strong>{p.name}</strong>
                <small>
                  {p.id} · {p.active ? "Publicado" : "Oculto"}
                </small>
              </button>
            ))}
        </aside>
        {product ? (
          <EditorForm
            key={`${product.id}-${product.version}-${revision}`}
            product={product}
            demo={demo}
            update={update}
            all={items}
          />
        ) : (
          <p>No hay productos para editar.</p>
        )}
      </div>
    </section>
  );
}

function EditorForm({
  product,
  demo,
  update,
  all,
}: {
  product: EditableProduct;
  demo: boolean;
  update: (p: EditableProduct) => void;
  all: EditableProduct[];
}) {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const data = {
      id: product.id,
      version: product.version,
      name: form.get("name"),
      description: form.get("description"),
      category: form.get("category"),
      active: form.has("active"),
      featured: form.has("featured"),
      variants: product.variants.map((v) => ({
        ...v,
        color: form.get(`${v.id}-color`),
        label: form.get(`${v.id}-label`),
        priceCents: priceToCents(String(form.get(`${v.id}-price`))),
        stock: Number(form.get(`${v.id}-stock`)),
        sourcing: form.get(`${v.id}-sourcing`),
        supplierConfirmed: form.has(`${v.id}-confirmed`),
        supplierAvailable: Number(form.get(`${v.id}-supplier`)),
        leadDays: Number(form.get(`${v.id}-days`)),
      })),
    };
    const parsed = productEditSchema.safeParse(data);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Revisá los campos.");
      return;
    }
    setBusy(true);
    try {
      if (demo) {
        localStorage.setItem(
          "orbita-admin-demo-v1",
          JSON.stringify(
            all.map((p) =>
              p.id === product.id
                ? parsed.data
                : productEditSchema.strip().parse(p),
            ),
          ),
        );
        update({ ...product, ...parsed.data });
        setMessage(
          "Borrador guardado solo en este navegador. La tienda y PostgreSQL no se modificaron.",
        );
      } else {
        const result = await saveProduct(parsed.data);
        if (result.ok && result.version)
          update({ ...product, ...parsed.data, version: result.version });
        setMessage(result.message);
      }
    } catch {
      setMessage(
        "No se pudo guardar. Revisá conexión o almacenamiento del navegador.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form method="post" className="admin-product-form" onSubmit={submit}>
      <h2>{product.name}</h2>
      <p className="admin-form-hint">
        {product.id} · URL: /productos/{product.slug}
      </p>
      <label>
        Nombre
        <input
          name="name"
          defaultValue={product.name}
          required
          minLength={3}
          maxLength={120}
        />
      </label>
      <label>
        Descripción
        <textarea
          name="description"
          defaultValue={product.description}
          required
          minLength={10}
          maxLength={4000}
          rows={4}
        />
      </label>
      <label>
        Categoría
        <select name="category" defaultValue={product.category}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <div className="admin-checks">
        <label>
          <input
            type="checkbox"
            name="active"
            defaultChecked={product.active}
          />
          Publicado
        </label>
        <label>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product.featured}
          />
          Destacado
        </label>
      </div>
      <h3>Variantes e inventario</h3>
      {product.variants.map((v) => (
        <fieldset key={v.id}>
          <legend>
            {v.id} · {product.reserved[v.id] ?? 0} unidades reservadas
          </legend>
          <div className="admin-fields">
            <label>
              Color
              <input
                name={`${v.id}-color`}
                defaultValue={v.color}
                required
                maxLength={60}
              />
            </label>
            <label>
              Presentación
              <input
                name={`${v.id}-label`}
                defaultValue={v.label}
                required
                maxLength={120}
              />
            </label>
            <label>
              Precio ARS, sin separador de miles
              <input
                name={`${v.id}-price`}
                defaultValue={(v.priceCents / 100).toFixed(2)}
                inputMode="decimal"
                required
                pattern="[0-9]+([.,][0-9]{1,2})?"
              />
            </label>
            <label>
              Stock físico
              <input
                type="number"
                name={`${v.id}-stock`}
                defaultValue={v.stock}
                min={product.reserved[v.id] ?? 0}
                max={1000000}
                required
              />
            </label>
            <label>
              Abastecimiento
              <select name={`${v.id}-sourcing`} defaultValue={v.sourcing}>
                <option value="STOCK">Stock propio</option>
                <option value="ON_REQUEST">Compra al proveedor</option>
              </select>
            </label>
            <label>
              Disponible del proveedor
              <input
                type="number"
                name={`${v.id}-supplier`}
                defaultValue={v.supplierAvailable}
                min={0}
                max={1000000}
                required
              />
            </label>
            <label>
              Días hábiles de preparación
              <input
                type="number"
                name={`${v.id}-days`}
                defaultValue={v.leadDays}
                min={1}
                max={120}
                required
              />
            </label>
            <label className="admin-confirm">
              <input
                type="checkbox"
                name={`${v.id}-confirmed`}
                defaultChecked={v.supplierConfirmed}
              />
              Disponibilidad confirmada con proveedor
            </label>
          </div>
        </fieldset>
      ))}
      {message && (
        <p role="status" className="admin-save-message">
          {message}
        </p>
      )}
      <button className="button" disabled={!ready || busy}>
        {!ready
          ? "Cargando editor…"
          : busy
            ? "Guardando…"
            : demo
              ? "Guardar borrador de prueba"
              : "Guardar en PostgreSQL"}
      </button>
    </form>
  );
}
