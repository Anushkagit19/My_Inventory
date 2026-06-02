import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/products";
import FormField from "../components/formfield";
import LoadingState from "../components/loadingstate";
import Modal from "../components/modal";
import PageHeader from "../components/pageheader";
import { useToast } from "../context/toastcontext";
import { hasErrors, validateProduct } from "../utils/validation";

const emptyForm = { name: "", sku: "", price: "", quantity_in_stock: "" };

export default function Products() {
  const { showSuccess, showError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setModal("add");
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      sku: p.sku,
      price: String(p.price),
      quantity_in_stock: String(p.quantity_in_stock),
    });
    setErrors({});
    setModal({ type: "edit", id: p.id });
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateProduct(form);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setSaving(true);
    const body = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price),
      quantity_in_stock: parseInt(form.quantity_in_stock, 10),
    };
    try {
      if (modal === "add") {
        await createProduct(body);
        showSuccess("Product created successfully");
      } else {
        await updateProduct(modal.id, body);
        showSuccess("Product updated successfully");
      }
      closeModal();
      load();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      showSuccess("Product deleted successfully");
      load();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage inventory items"
        action={
          <button
            type="button"
            onClick={openAdd}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:w-auto"
          >
            + Add Product
          </button>
        }
      />

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <LoadingState />
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 sm:px-5">Name</th>
                  <th className="px-4 py-3 sm:px-5">SKU</th>
                  <th className="px-4 py-3 sm:px-5">Price</th>
                  <th className="px-4 py-3 sm:px-5">Stock</th>
                  <th className="px-4 py-3 text-right sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3 font-medium sm:px-5">{p.name}</td>
                    <td className="px-4 py-3 sm:px-5">{p.sku}</td>
                    <td className="px-4 py-3 sm:px-5">${Number(p.price).toFixed(2)}</td>
                    <td className="px-4 py-3 sm:px-5">{p.quantity_in_stock}</td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="mr-2 text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === "add" ? "Add Product" : "Edit Product"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField
              label="Name"
              required
              value={form.name}
              error={errors.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <FormField
              label="SKU"
              required
              value={form.sku}
              error={errors.sku}
              onChange={(v) => setForm({ ...form, sku: v })}
            />
            <FormField
              label="Price"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.price}
              error={errors.price}
              onChange={(v) => setForm({ ...form, price: v })}
            />
            <FormField
              label="Quantity in stock"
              type="number"
              min="0"
              required
              value={form.quantity_in_stock}
              error={errors.quantity_in_stock}
              onChange={(v) => setForm({ ...form, quantity_in_stock: v })}
            />
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
