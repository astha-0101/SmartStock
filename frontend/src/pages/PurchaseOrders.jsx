import { useState } from "react";
import { Ban, Check, PackageCheck, Plus, X } from "lucide-react";
import Notice from "../components/Notice";
import { badgeClass } from "./Dashboard";
import { useFetch } from "../hooks/useFetch";
import { createPurchaseOrder, fetchProducts, fetchPurchaseOrders, fetchSuppliers, updateOrderStatus } from "../api";
import { errorMessage, formatDate } from "../utils";

const today = () => new Date().toISOString().slice(0, 10);
const emptyItem = { productId: "", quantity: "" };

function PurchaseOrders({ search }) {
  const orders = useFetch(fetchPurchaseOrders, []);
  const suppliers = useFetch(fetchSuppliers, []);
  const products = useFetch(fetchProducts, []);
  const [showForm, setShowForm] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [orderDate, setOrderDate] = useState(today());
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const term = search.toLowerCase();
  const rows = orders.data.filter((o) =>
    ("#" + o.orderId + " " + o.supplierName + " " + o.status + " " + o.items.map((i) => i.productName).join(" "))
      .toLowerCase().includes(term));

  function setItem(index, field, value) {
    setItems(items.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }

  function submit(e) {
    e.preventDefault();
    setSaving(true);
    createPurchaseOrder({
      supplierId: Number(supplierId),
      orderDate,
      items: items.map((i) => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
    })
      .then((o) => {
        setNotice({ type: "success", text: "Purchase order #" + o.orderId + " created (Pending)." });
        setShowForm(false);
        setSupplierId("");
        setOrderDate(today());
        setItems([{ ...emptyItem }]);
        orders.reload();
      })
      .catch((err) => setNotice({ type: "error", text: errorMessage(err) }))
      .finally(() => setSaving(false));
  }

  function changeStatus(order, status, doneText) {
    updateOrderStatus(order.orderId, status)
      .then(() => { setNotice({ type: "success", text: "Order #" + order.orderId + " " + doneText }); orders.reload(); })
      .catch((err) => setNotice({ type: "error", text: errorMessage(err) }));
  }

  const loadError = orders.error || suppliers.error || products.error;

  return (
    <div className="content">
      <div className="page-head">
        <div><h1>Purchase Orders</h1><p>{orders.loading ? "Loading…" : rows.length + " orders"}</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : <><Plus size={16} /> New Order</>}
        </button>
      </div>
      {loadError && <div className="notice error">{loadError}</div>}
      <Notice notice={notice} />

      {showForm && (
        <form className="card form-card" onSubmit={submit}>
          <div className="form-grid">
            <label className="field">Supplier
              <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
                <option value="">Select supplier</option>
                {suppliers.data.map((s) => <option key={s.supplierId} value={s.supplierId}>{s.name}</option>)}
              </select>
            </label>
            <label className="field">Order date
              <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} required />
            </label>
          </div>
          <div className="field" style={{ marginBottom: 8 }}>Items</div>
          {items.map((item, index) => (
            <div className="item-row" key={index}>
              <select value={item.productId} onChange={(e) => setItem(index, "productId", e.target.value)} required>
                <option value="">Select product</option>
                {products.data.map((p) => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
              </select>
              <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => setItem(index, "quantity", e.target.value)} required />
              {items.length > 1 && (
                <button type="button" className="btn btn-sm" aria-label="Remove item" onClick={() => setItems(items.filter((_, i) => i !== index))}><X size={14} /></button>
              )}
            </div>
          ))}
          <div className="form-actions">
            <button type="button" className="btn btn-sm" onClick={() => setItems([...items, { ...emptyItem }])}><Plus size={14} /> Add item</button>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Create Order"}</button>
          </div>
          {suppliers.data.length === 0 && !suppliers.loading && (
            <p style={{ color: "var(--text-light)", fontSize: 13, marginTop: 10 }}>Add a supplier first (Suppliers page).</p>
          )}
        </form>
      )}

      <div className="card table-wrap" style={{ padding: 0 }}>
        <table>
          <tbody>
            <tr><th>Order</th><th>Supplier</th><th>Date</th><th>Items</th><th>Status</th><th>Actions</th></tr>
            {rows.map((o) => (
              <tr key={o.orderId}>
                <td>#{o.orderId}</td>
                <td>{o.supplierName}</td>
                <td>{formatDate(o.orderDate)}</td>
                <td>{o.items.map((i) => i.productName + " x " + i.quantity).join(", ")}</td>
                <td><span className={"badge " + badgeClass(o.status)}>{o.status}</span></td>
                <td>
                  <div className="row-actions">
                    {o.status === "PENDING" && (
                      <button className="btn btn-sm btn-primary" onClick={() => changeStatus(o, "APPROVED", "approved.")}><Check size={14} /> Approve</button>
                    )}
                    {o.status === "APPROVED" && (
                      <button className="btn btn-sm btn-primary" onClick={() => changeStatus(o, "RECEIVED", "received. Stock updated.")}><PackageCheck size={14} /> Mark Received</button>
                    )}
                    {(o.status === "PENDING" || o.status === "APPROVED") && (
                      <button className="btn btn-sm btn-danger" onClick={() => window.confirm("Cancel order #" + o.orderId + "?") && changeStatus(o, "CANCELLED", "cancelled.")}><Ban size={14} /> Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.loading && rows.length === 0 && <div className="empty">No purchase orders found.</div>}
      </div>
    </div>
  );
}

export default PurchaseOrders;
