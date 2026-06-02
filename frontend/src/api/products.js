import { request } from "./client";

export const getProducts = () => request("/products");
export const getProduct = (id) => request(`/products/${id}`);
export const createProduct = (body) =>
  request("/products", { method: "POST", body: JSON.stringify(body) });
export const updateProduct = (id, body) =>
  request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: "DELETE" });
