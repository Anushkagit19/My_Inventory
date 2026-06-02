import { request } from "./client";

export const getCustomers = () => request("/customers");
export const createCustomer = (body) =>
  request("/customers", { method: "POST", body: JSON.stringify(body) });
export const deleteCustomer = (id) =>
  request(`/customers/${id}`, { method: "DELETE" });
