import { TriangleAlert, Ban, Boxes, ClipboardList, IndianRupee, Package, Truck, Warehouse } from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import { CategoryChart, MonthlyChart } from "../components/Charts";
import { useProducts, stockStatus } from "../hooks/useProducts";
import { useFetch } from "../hooks/useFetch";
import { fetchPurchaseOrders, fetchReportSummary, fetchStockMovements, fetchSuppliers } from "../api";
import { formatCurrency, formatDateTime, formatDate } from "../utils";

function Dashboard() {
  const { products, loading, error } = useProducts();
  const report = useFetch(fetchReportSummary);
  const orders = useFetch(fetchPurchaseOrders, []);
  const movements = useFetch(fetchStockMovements, []);
  const suppliers = useFetch(fetchSuppliers, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockItems = products.filter((p) => stockStatus(p.quantity) === "Low Stock");
  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const openOrders = orders.data.filter((o) => o.status === "PENDING" || o.status === "APPROVED").length;
  const firstError = error || report.error || orders.error || movements.error || suppliers.error;

  return (
    <div className="content">
      <h1>Dashboard</h1>
      <p style={{ color: "var(--text-light)", margin: "6px 0 20px" }}>
        {loading ? "Loading…" : "Live inventory statistics."}
      </p>
      {firstError && <div className="notice error">{firstError}</div>}

      <div className="grid-4">
        <SummaryCard label="Total Products" value={totalProducts} trend="In database" icon={<Package size={20} />} />
        <SummaryCard label="Total Inventory" value={totalStock} trend="Units in stock" icon={<Boxes size={20} />} />
        <SummaryCard label="Low Stock" value={lowStockItems.length} trend="10 units or fewer" icon={<TriangleAlert size={20} />} />
        <SummaryCard label="Out of Stock" value={outOfStock} trend="Quantity is 0" icon={<Ban size={20} />} />
      </div>

      <div className="grid-4">
        <SummaryCard label="Inventory Value" value={formatCurrency(report.data ? report.data.totalInventoryValue : 0)} trend="Quantity x price" icon={<IndianRupee size={20} />} />
        <SummaryCard label="Suppliers" value={suppliers.data.length} trend="Registered" icon={<Truck size={20} />} />
        <SummaryCard label="Open Purchase Orders" value={openOrders} trend="Pending or approved" icon={<ClipboardList size={20} />} />
        <SummaryCard label="Categories" value={report.data ? report.data.categories.length : 0} trend="With products" icon={<Warehouse size={20} />} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-head"><h3>Products by Category</h3></div>
          <CategoryChart categories={report.data ? report.data.categories : []} />
        </div>
        <div className="card">
          <div className="section-head"><h3>Monthly Stock Movement</h3><span className="link">Last 6 months</span></div>
          <MonthlyChart months={report.data ? report.data.monthlyMovement : []} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-head"><h3>Recent Stock Movements</h3></div>
          <div className="table-wrap">
            <table>
              <tbody>
                <tr><th>Product</th><th>Type</th><th>Change</th><th>When</th></tr>
                {movements.data.slice(0, 5).map((m) => (
                  <tr key={m.transactionId}>
                    <td>{m.productName}</td>
                    <td>{m.type}</td>
                    <td>{m.previousQuantity} to {m.newQuantity}</td>
                    <td>{formatDateTime(m.createdAt)}</td>
                  </tr>
                ))}
                {!movements.loading && movements.data.length === 0 && <tr><td colSpan="4">No stock movements yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="section-head"><h3>Recent Purchase Orders</h3></div>
          <div className="table-wrap">
            <table>
              <tbody>
                <tr><th>Order</th><th>Supplier</th><th>Date</th><th>Status</th></tr>
                {orders.data.slice(0, 5).map((o) => (
                  <tr key={o.orderId}>
                    <td>#{o.orderId}</td><td>{o.supplierName}</td><td>{formatDate(o.orderDate)}</td>
                    <td><span className={"badge " + badgeClass(o.status)}>{o.status}</span></td>
                  </tr>
                ))}
                {!orders.loading && orders.data.length === 0 && <tr><td colSpan="4">No purchase orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-head"><h3>Low Stock Products</h3></div>
        <table>
          <tbody>
            <tr><th>ID</th><th>Product</th><th>Category</th><th>Quantity</th></tr>
            {lowStockItems.map((p) => (
              <tr key={p.productId}>
                <td>{p.productId}</td><td>{p.productName}</td><td>{p.category}</td>
                <td style={{ color: "var(--red)" }}>{p.quantity}</td>
              </tr>
            ))}
            {!loading && lowStockItems.length === 0 && <tr><td colSpan="4">No low-stock products.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function badgeClass(status) {
  if (status === "RECEIVED") return "completed";
  if (status === "APPROVED") return "processing";
  if (status === "CANCELLED") return "cancelled";
  return "pending";
}

export default Dashboard;
