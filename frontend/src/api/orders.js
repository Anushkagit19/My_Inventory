import { request } from "./client";

export const getOrders = () => request("/orders");
export const getOrder = (id) => request(`/orders/${id}`);
export const createOrder = (body) =>
  request("/orders", { method: "POST", body: JSON.stringify(body) });
export const deleteOrder = (id) =>
  request(`/orders/${id}`, { method: "DELETE" });
