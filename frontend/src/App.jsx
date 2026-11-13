import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import StockHistory from "./pages/StockHistory";
import Reports from "./pages/Reports";

const titles = {
  dashboard: "Dashboard",
  products: "Products",
  inventory: "Inventory",
  suppliers: "Suppliers",
  orders: "Purchase Orders",
  stock: "Stock History",
  reports: "Reports",
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [search, setSearch] = useState("");

  function renderPage() {
    switch (activePage) {
      case "products": return <Products search={search} />;
      case "inventory": return <Inventory search={search} />;
      case "suppliers": return <Suppliers search={search} />;
      case "orders": return <PurchaseOrders search={search} />;
      case "stock": return <StockHistory search={search} />;
      case "reports": return <Reports />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="app">
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <div className="main">
        <Navbar title={titles[activePage]} search={search} onSearchChange={setSearch} refreshKey={activePage} />
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
