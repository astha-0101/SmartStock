// Talks to the Spring Boot backend (http://localhost:8080). Data lives in MySQL.
const BASE_URL = "http://localhost:8080/api";

async function request(path, options) {
  const response = await fetch(BASE_URL + path, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Request failed (HTTP " + response.status + ")");
  }
  return response.status === 204 ? null : response.json();
}

function send(method, path, body) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Products
export const fetchProducts = () => request("/products");
export const addProduct = (product) => send("POST", "/products", product);

// Suppliers
export const fetchSuppliers = () => request("/suppliers");
export const createSupplier = (s) => send("POST", "/suppliers", s);
export const updateSupplier = (id, s) => send("PUT", "/suppliers/" + id, s);
export const deleteSupplier = (id) => request("/suppliers/" + id, { method: "DELETE" });

// Purchase orders
export const fetchPurchaseOrders = () => request("/purchase-orders");
export const createPurchaseOrder = (o) => send("POST", "/purchase-orders", o);
export const updateOrderStatus = (id, status) => send("PUT", "/purchase-orders/" + id + "/status", { status });

// Stock movements
export const fetchStockMovements = () => request("/stock-movements");
export const recordStockMovement = (m) => send("POST", "/stock-movements", m);

// Reports and notifications
export const fetchReportSummary = () => request("/reports/summary");
export const fetchNotifications = () => request("/notifications");
