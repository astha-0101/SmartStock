import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Notice from "../components/Notice";
import { useFetch } from "../hooks/useFetch";
import { createSupplier, deleteSupplier, fetchSuppliers, updateSupplier } from "../api";
import { errorMessage } from "../utils";

const emptyForm = { name: "", email: "", phone: "", address: "" };

function Suppliers({ search }) {
  const { data: suppliers, loading, error, reload } = useFetch(fetchSuppliers, []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const term = search.toLowerCase();
  const rows = suppliers.filter((s) =>
    [s.name, s.email, s.phone, s.address].some((v) => (v || "").toLowerCase().includes(term)));

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice(null);
    setShowForm(true);
  }

  function openEdit(s) {
    setEditingId(s.supplierId);
    setForm({ name: s.name || "", email: s.email || "", phone: s.phone || "", address: s.address || "" });
    setNotice(null);
    setShowForm(true);
  }

  function submit(e) {
    e.preventDefault();
    setSaving(true);
    const action = editingId ? updateSupplier(editingId, form) : createSupplier(form);
    action
      .then(() => {
        setNotice({ type: "success", text: editingId ? "Supplier updated." : "Supplier added." });
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        reload();
      })
      .catch((err) => setNotice({ type: "error", text: errorMessage(err) }))
      .finally(() => setSaving(false));
  }

  function remove(s) {
    if (!window.confirm("Delete supplier " + s.name + "?")) return;
    deleteSupplier(s.supplierId)
      .then(() => { setNotice({ type: "success", text: "Supplier deleted." }); reload(); })
      .catch((err) => setNotice({ type: "error", text: errorMessage(err) }));
  }

  return (
    <div className="content">
      <div className="page-head">
        <div><h1>Suppliers</h1><p>{loading ? "Loading…" : rows.length + " suppliers"}</p></div>
        <button className="btn btn-primary" onClick={showForm ? () => setShowForm(false) : openAdd}>
          {showForm ? "Cancel" : <><Plus size={16} /> Add Supplier</>}
        </button>
      </div>
      {error && <div className="notice error">{error}</div>}
      <Notice notice={notice} />

      {showForm && (
        <form className="card form-card" onSubmit={submit}>
          <div className="form-grid">
            <label className="field">Supplier name<input name="name" value={form.name} onChange={change} required /></label>
            <label className="field">Email<input name="email" type="email" value={form.email} onChange={change} required /></label>
            <label className="field">Phone<input name="phone" value={form.phone} onChange={change} required /></label>
            <label className="field">Address<input name="address" value={form.address} onChange={change} /></label>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : editingId ? "Update Supplier" : "Save Supplier"}</button>
          </div>
        </form>
      )}

      <div className="card table-wrap" style={{ padding: 0 }}>
        <table>
          <tbody>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr>
            {rows.map((s) => (
              <tr key={s.supplierId}>
                <td>{s.supplierId}</td><td>{s.name}</td><td>{s.email}</td><td>{s.phone}</td><td>{s.address}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-sm" onClick={() => openEdit(s)}><Pencil size={14} /> Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(s)}><Trash2 size={14} /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && <div className="empty">No suppliers found. Add your first supplier.</div>}
      </div>
    </div>
  );
}

export default Suppliers;
