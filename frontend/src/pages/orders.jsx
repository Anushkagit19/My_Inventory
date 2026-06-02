import { useEffect, useState } from "react";
import { getCustomers } from "../api/customers";
import { createOrder, deleteOrder, getOrder, getOrders } from "../api/orders";
import { getProducts } from "../api/products";
import LoadingState from "../components/loadingstate";
import Modal from "../components/modal";
import PageHeader from "../components/pageheader";
import { useToast } from "../context/toastcontext";
import { hasErrors, validateOrder } from "../utils/validation";

const emptyLine = { product_id: "", quantity: "1" };

export default function Orders() {
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [detail, setDetail] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [lines, setLines] = useState([{ ...emptyLine }]);
  const [saving, setSaving] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadOrders(), []);

  const openCreate = async () => {
    try {
      const [c, p] = await Promise.all([getCustomers(), getProducts()]);
      setCustomers(c);
      setProducts(p);
      setCustomerId(c[0]?.id ? String(c[0].id) : "");
      setLines([{ ...emptyLine }]);
      setFormErrors({});
      setShowCreate(true);
    } catch (err) {
      showError(err.message);
    }
  };

  const closeCreate = () => {
    setShowCreate(false);
    setFormErrors({});
  };

  const viewDetail = async (id) => {
    try {
      const o = await getOrder(id);
      setDetail(o);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const validation = validateOrder(customerId, lines, products);
    setFormErrors(validation);
    if (hasErrors(validation)) return;

    setSaving(true);
    const body = {
      customer_id: parseInt(customerId, 10),
      items: lines.map((l) => ({
        product_id: parseInt(l.product_id, 10),
        quantity: parseInt(l.quantity, 10),
      })),
    };
    try {
      await createOrder(body);
      showSuccess("Order created — stock updated");
      closeCreate();
      loadOrders();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this order? Stock will be restored.")) return;
    try {
      await deleteOrder(id);
      showSuccess("Order cancelled — stock restored");
      loadOrders();
    } catch (err) {
      showError(err.message);
    }
  };

  const updateLine = (idx, field, value) => {
    setLines((prev) => {
      let next = prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l));
      if (field === "product_id" && value) {
        next = next.map((l, i) =>
          i !== idx && String(l.product_id) === String(value)
            ? { ...l, product_id: "", quantity: "1" }
            : l
        );
      }
      return next;
    });
  };

  const productsForLine = (lineIndex) => {
    const usedElsewhere = new Set(
      lines
        .filter((_, i) => i !== lineIndex)
        .map((l) => l.product_id)
        .filter(Boolean)
        .map(String)
    );
    const currentId = String(lines[lineIndex]?.product_id || "");
    return products.filter(
      (p) => !usedElsewhere.has(String(p.id)) || String(p.id) === currentId
    );
  };

  const canAddLine = lines.length < products.length;

  const addLine = () => {
    if (!canAddLine) return;
    setLines((prev) => [...prev, { ...emptyLine }]);
  };
  const removeLine = (idx) => setLines((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Create and manage orders"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:w-auto"
          >
            + Create Order
          </button>
        }
      />

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <LoadingState />
        ) : orders.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-5 py-3 font-medium">#{o.id}</td>
                    <td className="px-5 py-3">#{o.customer_id}</td>
                    <td className="px-5 py-3">${Number(o.total_amount).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => viewDetail(o.id)}
                        className="mr-2 text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(o.id)}
                        className="text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Create Order" wide onClose={closeCreate}>
          <form onSubmit={handleCreate} className="space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                  formErrors.customer
                    ? "border-red-400 bg-red-50"
                    : "border-slate-300"
                }`}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.email})
                  </option>
                ))}
              </select>
              {formErrors.customer && (
                <p className="mt-1 text-xs text-red-600">{formErrors.customer}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Line items</label>
                <button
                  type="button"
                  onClick={addLine}
                  disabled={!canAddLine}
                  className="text-sm text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
                  title={
                    canAddLine
                      ? "Add another product"
                      : "All products are already used in this order"
                  }
                >
                  + Add line
                </button>
              </div>
              <div className="space-y-4">
                {formErrors.items && (
                  <p className="mb-2 text-xs text-red-600">{formErrors.items}</p>
                )}
                {lines.map((line, idx) => {
                  const lineProducts = productsForLine(idx);
                  const rowErrors = formErrors.lineErrors?.[idx] || {};
                  const product = products.find(
                    (p) => String(p.id) === String(line.product_id)
                  );
                  const maxQty = product?.quantity_in_stock ?? 0;

                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Item {idx + 1}
                        </p>
                        {lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Select product
                        </label>
                        <select
                          value={line.product_id}
                          onChange={(e) => updateLine(idx, "product_id", e.target.value)}
                          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm ${
                            rowErrors.product ? "border-red-400" : "border-slate-300"
                          }`}
                        >
                          <option value="">Choose a product...</option>
                          {lineProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku})
                            </option>
                          ))}
                          {lineProducts.length === 0 && (
                            <option value="" disabled>
                              No more products available
                            </option>
                          )}
                        </select>
                        {rowErrors.product && (
                          <p className="mt-1 text-xs text-red-600">{rowErrors.product}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <InfoBox
                          label="Product name"
                          value={product?.name ?? "—"}
                        />
                        <InfoBox
                          label="Units available"
                          value={
                            product != null ? String(product.quantity_in_stock) : "—"
                          }
                          highlight={
                            product != null && product.quantity_in_stock < 10
                          }
                        />
                        <InfoBox
                          label="Price"
                          value={
                            product != null
                              ? `$${Number(product.price).toFixed(2)}`
                              : "—"
                          }
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Quantity to order
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={maxQty > 0 ? maxQty : undefined}
                          disabled={!product}
                          value={line.quantity}
                          onChange={(e) => updateLine(idx, "quantity", e.target.value)}
                          className={`w-full max-w-[140px] rounded-lg border bg-white px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-400 ${
                            rowErrors.quantity ? "border-red-400" : "border-slate-300"
                          }`}
                          placeholder="Qty"
                        />
                        {rowErrors.quantity && (
                          <p className="mt-1 text-xs text-red-600">{rowErrors.quantity}</p>
                        )}
                        {!rowErrors.quantity && product && maxQty === 0 && (
                          <p className="mt-1 text-xs text-red-600">Out of stock</p>
                        )}
                        {!rowErrors.quantity && product && maxQty > 0 && (
                          <p className="mt-1 text-xs text-slate-500">
                            Max available: {maxQty}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeCreate} className="rounded-lg border px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || customers.length === 0 || products.length === 0}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Order"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal title={`Order #${detail.id}`} onClose={() => setDetail(null)}>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-slate-500">Customer:</span> #{detail.customer_id}
            </p>
            <p>
              <span className="text-slate-500">Total:</span>{" "}
              <strong>${Number(detail.total_amount).toFixed(2)}</strong>
            </p>
            <p>
              <span className="text-slate-500">Date:</span>{" "}
              {new Date(detail.created_at).toLocaleString()}
            </p>
            <table className="mt-4 w-full border text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Line total</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-3 py-2">#{item.product_id}</td>
                    <td className="px-3 py-2">{item.quantity}</td>
                    <td className="px-3 py-2">${Number(item.unit_price).toFixed(2)}</td>
                    <td className="px-3 py-2">${Number(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}

function InfoBox({ label, value, highlight = false }) {
  return (
    <div
      className={`rounded-lg border bg-white px-3 py-2.5 ${
        highlight ? "border-amber-300 bg-amber-50" : "border-slate-200"
      }`}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={`mt-1 text-sm font-semibold ${
          highlight ? "text-amber-800" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
