import { TriangleAlert, Ban, Boxes, IndianRupee } from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import { CategoryChart, MonthlyChart } from "../components/Charts";
import { useFetch } from "../hooks/useFetch";
import { fetchReportSummary } from "../api";
import { formatCurrency } from "../utils";

function ProductTable({ title, rows, emptyText, color }) {
  return (
    <div className="card">
      <div className="section-head"><h3>{title}</h3></div>
      <table>
        <tbody>
          <tr><th>ID</th><th>Product</th><th>Category</th><th>Quantity</th></tr>
          {rows.map((p) => (
            <tr key={p.productId}>
              <td>{p.productId}</td><td>{p.productName}</td><td>{p.category}</td>
              <td style={{ color }}>{p.quantity}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="4">{emptyText}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Reports() {
  const { data, loading, error } = useFetch(fetchReportSummary);

  return (
    <div className="content">
      <div className="page-head"><div><h1>Reports</h1><p>{loading ? "Loading…" : "Calculated live from the database"}</p></div></div>
      {error && <div className="notice error">{error}</div>}
      {data && (
        <>
          <div className="grid-4">
            <SummaryCard label="Inventory Value" value={formatCurrency(data.totalInventoryValue)} trend="Quantity x price" icon={<IndianRupee size={20} />} />
            <SummaryCard label="Total Units" value={data.totalUnits} trend={data.totalProducts + " products"} icon={<Boxes size={20} />} />
            <SummaryCard label="Low Stock" value={data.lowStock.length} trend="10 units or fewer" icon={<TriangleAlert size={20} />} />
            <SummaryCard label="Out of Stock" value={data.outOfStock.length} trend="Quantity is 0" icon={<Ban size={20} />} />
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="section-head"><h3>Category Distribution</h3></div>
              <CategoryChart categories={data.categories} />
            </div>
            <div className="card">
              <div className="section-head"><h3>Monthly Stock Movement</h3><span className="link">Units, last 6 months</span></div>
              <MonthlyChart months={data.monthlyMovement} />
            </div>
          </div>

          <div className="grid-2">
            <ProductTable title="Low Stock Products" rows={data.lowStock} emptyText="No low-stock products." color="var(--yellow)" />
            <ProductTable title="Out of Stock Products" rows={data.outOfStock} emptyText="No out-of-stock products." color="var(--red)" />
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
