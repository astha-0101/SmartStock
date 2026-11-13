// Reusable card used for Total Products, Total Inventory, Low Stock, Pending Orders.
// Receives data via props instead of being written 4 separate times.
function SummaryCard({ label, value, trend, icon }) {
  return (
    <div className="card summary-card">
      <div>
        <div className="label">{label}</div>
        <div className="value">{value}</div>
        <div className="trend">{trend}</div>
      </div>
      <div className="icon">{icon}</div>
    </div>
  );
}

export default SummaryCard;
