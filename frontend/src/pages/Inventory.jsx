import { useState } from "react";
import { useProducts, stockStatus, statusClass } from "../hooks/useProducts";

const filters = ["All", "Low Stock", "Out of Stock"];

function Inventory({ search }) {
  const [filter, setFilter] = useState("All");
  const { products, loading, error } = useProducts();

  const rows = products.filter((p) => {
    const status = stockStatus(p.quantity);
    const matchesFilter = filter === "All" || status === filter;
    const matchesSearch = (p.productName || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalStock = products.reduce((s, p) => s + p.quantity, 0);
  const lowCount = products.filter((p) => stockStatus(p.quantity) === "Low Stock").length;
  const outCount = products.filter((p) => p.quantity === 0).length;

  return (
    <div className="content">
      <div className="page-head"><div><h1>Inventory</h1><p>{loading ? "Loading…" : "Track stock levels across all products"}</p></div></div>
      {error && <p style={{ color: "var(--red)", marginBottom: 16 }}>{error}</p>}

      <div className="grid-4">
        <div className="card summary-card"><div><div className="label">Total Stock Units</div><div className="value">{totalStock}</div></div></div>
        <div className="card summary-card"><div><div className="label">Low Stock Items</div><div className="value">{lowCount}</div></div></div>
        <div className="card summary-card"><div><div className="label">Out of Stock</div><div className="value">{outCount}</div></div></div>
      </div>

      <div className="filters">
        <div className="chip-group">
          {filters.map((f) => (
            <span key={f} className={"chip" + (filter === f ? " active" : "")} onClick={() => setFilter(f)}>{f}</span>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <tbody>
            <tr><th>ID</th><th>Product Name</th><th>Category</th><th>Current Stock</th><th>Status</th></tr>
            {rows.map((p) => {
              const status = stockStatus(p.quantity);
              return (
                <tr key={p.productId}>
                  <td>{p.productId}</td><td>{p.productName}</td><td>{p.category}</td><td>{p.quantity}</td>
                  <td><span className={"badge " + statusClass(status)}>{status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
