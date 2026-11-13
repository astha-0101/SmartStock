import { useState } from "react";
import { useProducts, stockStatus, statusClass } from "../hooks/useProducts";
import { addProduct } from "../api";

const emptyForm = { productName: "", category: "", quantity: "", price: "" };

function Products({ search }) {
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const { products, loading, error, reload } = useProducts();

  // Category chips come from the real data in the database.
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch = (p.productName || "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    addProduct({
      productName: form.productName.trim(),
      category: form.category.trim(),
      quantity: Number(form.quantity),
      price: Number(form.price),
    })
      .then(() => {
        setForm(emptyForm);
        setShowForm(false);
        reload(); // re-read the list from the backend
      })
      .catch((err) => setFormError(err.message === "Failed to fetch" ? "Cannot reach backend at http://localhost:8080" : err.message));
  }

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Products</h1>
          <p>{loading ? "Loading…" : filtered.length + " products found"}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add Product"}</button>
      </div>
      {error && <p style={{ color: "var(--red)", marginBottom: 16 }}>{error}</p>}

      {showForm && (
        <form className="card" onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
          <input name="productName" placeholder="Product name" value={form.productName} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="quantity" type="number" min="0" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
          <input name="price" type="number" min="0.01" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
          <button className="btn btn-primary" type="submit">Save</button>
          {formError && <span style={{ color: "var(--red)", fontSize: 13 }}>{formError}</span>}
        </form>
      )}

      <div className="filters">
        <div className="chip-group">
          {categories.map((c) => (
            <span key={c} className={"chip" + (category === c ? " active" : "")} onClick={() => setCategory(c)}>{c}</span>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <tbody>
            <tr><th>ID</th><th>Product Name</th><th>Category</th><th>Price</th><th>Quantity</th><th>Status</th></tr>
            {filtered.map((p) => {
              const status = stockStatus(p.quantity);
              return (
                <tr key={p.productId}>
                  <td>{p.productId}</td><td>{p.productName}</td><td>{p.category}</td>
                  <td>₹{Number(p.price).toLocaleString()}</td><td>{p.quantity}</td>
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

export default Products;
