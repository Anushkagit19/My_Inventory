import { useEffect, useState } from "react";
import { createCustomer, deleteCustomer, getCustomers } from "../api/customers";
import FormField from "../components/formfield";
import LoadingState from "../components/loadingstate";
import Modal from "../components/modal";
import PageHeader from "../components/pageheader";
import { useToast } from "../context/toastcontext";
import { hasErrors, validateCustomer } from "../utils/validation";

const emptyForm = { full_name: "", email: "", phone: "" };

export default function Customers() {
  const { showSuccess, showError } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getCustomers()
      .then(setCustomers)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setShowAdd(true);
  };

  const closeAdd = () => {
    setShowAdd(false);
    setForm(emptyForm);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateCustomer(form);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setSaving(true);
    try {
      await createCustomer({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      showSuccess("Customer created successfully");
      closeAdd();
      load();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      showSuccess("Customer deleted successfully");
      load();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage customer records"
        action={
          <button
            type="button"
            onClick={openAdd}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:w-auto"
          >
            + Add Customer
          </button>
        }
      />

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <LoadingState />
        ) : customers.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No customers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 sm:px-5">Name</th>
                  <th className="px-4 py-3 sm:px-5">Email</th>
                  <th className="px-4 py-3 sm:px-5">Phone</th>
                  <th className="px-4 py-3 text-right sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3 font-medium sm:px-5">{c.full_name}</td>
                    <td className="px-4 py-3 sm:px-5">{c.email}</td>
                    <td className="px-4 py-3 sm:px-5">{c.phone}</td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
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

      {showAdd && (
        <Modal title="Add Customer" onClose={closeAdd}>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField
              label="Full name"
              required
              value={form.full_name}
              error={errors.full_name}
              onChange={(v) => setForm({ ...form, full_name: v })}
            />
            <FormField
              label="Email"
              type="email"
              required
              value={form.email}
              error={errors.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <FormField
              label="Phone"
              required
              value={form.phone}
              error={errors.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeAdd} className="rounded-lg border px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
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
