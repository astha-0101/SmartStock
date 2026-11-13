import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "../api";

// Stock status is derived from quantity (same rule as the backend: <= 10 is low stock).
export function stockStatus(quantity) {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= 10) return "Low Stock";
  return "In Stock";
}

export function statusClass(status) {
  if (status === "In Stock") return "in-stock";
  if (status === "Low Stock") return "low-stock";
  return "out-stock";
}

// Loads products from the backend. Fields: productId, productName, category, quantity, price.
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => { setProducts(data); setError(""); })
      .catch((err) => setError(err.message === "Failed to fetch" ? "Cannot reach backend at http://localhost:8080" : err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { products, loading, error, reload };
}
