import { useEffect, useState } from "react";
import { getCustomers } from "../api/customers";
import { getOrders } from "../api/orders";
import { getProducts } from "../api/products";
import LoadingState from "../components/loadingstate";
import PageHeader from "../components/pageheader";

const LOW_STOCK = 10;

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getCustomers(), getOrders()])
      .then(([p, c, o]) => {
        setProducts(p);
        setCustomers(c);
        setOrders(o);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const lowStock = products.filter((p) => p.quantity_in_stock < LOW_STOCK);

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Overview of your inventory system" />
        <div className="mt-6 rounded-xl border border-slate-200 bg-white">
          <LoadingState label="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Overview of your inventory system" />
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <strong className="font-medium">Error: </strong>
          {error}
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Products", value: products.length, color: "bg-blue-500" },
    { label: "Total Customers", value: customers.length, color: "bg-violet-500" },
    { label: "Total Orders", value: orders.length, color: "bg-emerald-500" },
    { label: "Low Stock Items", value: lowStock.length, color: "bg-amber-500" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your inventory system" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`mb-3 h-1 w-12 rounded ${s.color}`} />
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-slate-800">
            Low stock products (&lt; {LOW_STOCK})
          </h2>
        </div>
        {lowStock.length === 0 ? (
          <p className="px-5 py-8 text-center text-slate-500">All products are well stocked.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-5 py-3 font-medium">{p.name}</td>
                    <td className="px-5 py-3">{p.sku}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                        {p.quantity_in_stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">${Number(p.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
