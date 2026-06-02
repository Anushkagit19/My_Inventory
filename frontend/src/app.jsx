import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import { ToastProvider } from "./context/toastcontext";
import Customers from "./pages/Customers";
import Dashboard from "./pages/dashboard";
import Orders from "./pages/orders";
import Products from "./pages/products";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
