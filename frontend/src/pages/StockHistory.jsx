import { useState } from "react";
import Notice from "../components/Notice";
import { useFetch } from "../hooks/useFetch";
import { fetchProducts, fetchStockMovements, recordStockMovement } from "../api";
import { errorMessage, formatDateTime } from "../utils";

const typeFilters = ["All", "ADDITION", "REDUCTION", "ADJUSTMENT"];
const emptyForm = { productId: "", type: "ADDITION", quantity: "", reason: "" };

function StockHistory({ search }) {
  const movements = useFetch(fetchStockMovements, []);
  const products = useFetch(fetchProducts, []);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const term = search.toLowerCase();
  const rows = movements.data.filter((m) =>
    (filter === "All" || m.type === filter) &&
    (m.productName + " " + m.type + " " + (m.reason || "")).toLowerCase().includes(term));

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    setSaving(true);
    recordStockMovement({ ...form, productId: Number(form.productId), quantity: Number(form.quantity) })
      .then((m) => {
        setNotice({ type: "success", text: m.productName + ": stock changed from " + m.previousQuantity + " to " + m.newQuantity + "." });
        setForm(emptyForm);
        movements.reload();
        products.reload();
      })
      .catch((err) => setNotice({ type: "error", text: errorMessage(err) }))
      .finally(() => setSaving(false));
  }

  const quantityLabel = form.type === "ADJUSTMENT" ? "New stock level" : "Quantity";
  const loadError = movements.error || products.error;

  return (
    <div className="content">
      <div className="page-head"><div><h1>Stock History</h1><p>{movements.loading ? "Loading…" : rows.length + " transactions"}</p></div></div>
      {loadError && <div className="notice error">{loadError}</div>}
      <Notice notice={notice} />

      <form className="card form-card" onSubmit={submit}>
        <div className="form-grid">
          <label className="field">Product
            <select name="productId" value={form.productId} onChange={change} required>
              <option value="">Select product</option>
              {products.data.map((p) => <option key={p.productId} value={p.productId}>{p.productName} (stock {p.quantity})</option>)}
            </select>
          </label>
          <label className="field">Type
            <select name="type" value={form.type} onChange={change}>
              <option value="ADDITION">Addition</option>
              <option value="REDUCTION">Reduction</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </label>
          <label className="field">{quantityLabel}
            <input name="quantity" type="number" min={form.type === "ADJUSTMENT" ? 0 : 1} value={form.quantity} onChange={change} required />
          </label>
          <label className="field">Reason
            <input name="reason" value={form.reason} onChange={change} required />
          </label>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Record Movement"}</button>
        </div>
      </form>

      <div className="filters">
        <div className="chip-group">
          {typeFilters.map((f) => (
            <span key={f} className={"chip" + (filter === f ? " active" : "")} onClick={() => setFilter(f)}>
              {f === "All" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="card table-wrap" style={{ padding: 0 }}>
        <table>
          <tbody>
            <tr><th>When</th><th>Product</th><th>Type</th><th>Quantity</th><th>Stock Change</th><th>Reason</th></tr>
            {rows.map((m) => (
              <tr key={m.transactionId}>
                <td>{formatDateTime(m.createdAt)}</td><td>{m.productName}</td><td>{m.type}</td>
                <td>{m.quantity}</td><td>{m.previousQuantity} to {m.newQuantity}</td><td>{m.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!movements.loading && rows.length === 0 && <div className="empty">No stock movements found.</div>}
      </div>
    </div>
  );
}

export default StockHistory;
