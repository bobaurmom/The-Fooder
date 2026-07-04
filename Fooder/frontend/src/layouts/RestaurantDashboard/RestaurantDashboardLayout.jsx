import { useState } from "react";
import "./RestaurantDashboardLayout.css";
import Home from "../../pages/Home";
import AddMenuItemForm from "../../pages/AddMenuItemForm";
import CartCheckout from "../../pages/CartCheckout";

const PAGE_META = {
  dashboard: { title: "Dashboard",   sub: "Welcome back! Here's what's happening today." },
  food:      { title: "Manage Food", sub: "Add, edit, or remove menu items." },
  orders:    { title: "Orders",      sub: "View and manage customer orders." },
};

function Navbar({ page, setPage }) {
  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "food",      label: "Food" },
    { key: "orders",    label: "Orders" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <nav className="nav-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`nav-tab ${page === t.key ? "active" : ""}`}
              onClick={() => setPage(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="navbar-logo">
          The <span>Fooder</span>
        </div>

        <div className="navbar-right">
          <div className="nav-search-box">
            <span className="nav-search-icon">🔍</span>
            <input type="text" placeholder="Search..." />
          </div>
          <button className="icon-btn">
            🔔
            <span className="notif-dot" />
          </button>
          <button className="icon-btn">👤</button>
          <button className="btn-logout">⬡ Logout</button>
        </div>

      </div>
    </header>
  );
}

export default function RestaurantDashboardLayout() {
  const [page, setPage] = useState("dashboard");
  const meta = PAGE_META[page];

  return (
    <div>
      <Navbar page={page} setPage={setPage} />

      <main className="layout-main">
        <div className="page-header">
          <h1>{meta.title}</h1>
          <p>{meta.sub}</p>
        </div>

        {page === "dashboard" && <Home />}
        {page === "food"      && <AddMenuItemForm />}
        {page === "orders"    && <CartCheckout />}
      </main>

      <footer className="layout-footer">@ The-Fooder</footer>
    </div>
  );
}
