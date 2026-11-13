import { useEffect, useState } from "react";
import { Bell, CircleX, Search, TriangleAlert } from "lucide-react";
import { fetchNotifications } from "../api";

// Top navbar: search box, working notification bell (real stock alerts), profile.
// `refreshKey` changes when the page changes, so alerts reload from the backend.
function Navbar({ title, search, onSearchChange, refreshKey }) {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchNotifications()
      .then((data) => { setAlerts(data); setFailed(false); })
      .catch(() => setFailed(true));
  }, [refreshKey]);

  return (
    <header className="navbar">
      <h2>{title}</h2>
      <div className="search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search this page..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="nav-right">
        <div className="bell-wrap">
          <div className="icon-btn" role="button" aria-label="Notifications" onClick={() => setOpen(!open)}>
            <Bell size={18} />
            {alerts.length > 0 && <span className="notif-badge">{alerts.length}</span>}
          </div>
          {open && (
            <div className="notif-panel">
              <div className="notif-head">Stock alerts</div>
              {failed && <div className="empty">Cannot reach backend.</div>}
              {!failed && alerts.length === 0 && <div className="empty">No alerts. All products are well stocked.</div>}
              {alerts.map((a) => (
                <div key={a.productId} className={"notif-item " + (a.type === "OUT_OF_STOCK" ? "out" : "low")}>
                  {a.type === "OUT_OF_STOCK" ? <CircleX size={16} /> : <TriangleAlert size={16} />}
                  <span>{a.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="profile">
          <div className="avatar">AS</div>
          <span>Astha Singh</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
