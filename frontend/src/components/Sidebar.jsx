import { ChartColumn, ClipboardList, History, LayoutDashboard, Package, Truck, Warehouse } from "lucide-react";

const menuItems = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "products", label: "Products", Icon: Package },
  { key: "inventory", label: "Inventory", Icon: Warehouse },
  { key: "suppliers", label: "Suppliers", Icon: Truck },
  { key: "orders", label: "Purchase Orders", Icon: ClipboardList },
  { key: "stock", label: "Stock History", Icon: History },
  { key: "reports", label: "Reports", Icon: ChartColumn },
];

function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-box">S</div>
        <div className="logo-text">
          <b>SmartStock</b>
          <span>INVENTORY SYSTEM</span>
        </div>
      </div>
      <div className="menu-label">MENU</div>
      <nav className="menu">
        {menuItems.map(({ key, label, Icon }) => (
          <a
            key={key}
            href="#"
            className={active === key ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(key);
            }}
          >
            <Icon size={18} /> {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
