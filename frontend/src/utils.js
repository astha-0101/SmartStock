export function formatCurrency(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { dateStyle: "medium" });
}

export function errorMessage(err) {
  return err.message === "Failed to fetch" ? "Cannot reach backend at http://localhost:8080" : err.message;
}
