import React, { useState } from "react";
import UserManagement from "./UserManagement";
import "./dashboard.css";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeView, setActiveView] = useState("home");

  const admin = JSON.parse(localStorage.getItem("admin"));
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (activeView) {
      case "users":
        return <UserManagement />;
      case "home":
      default:
        return (
          <>
            <h2 className="dashboard-welcome">
              Welcome, {admin?.name || user?.name || "User"}!
            </h2>
            <p>Select a menu item on the left to get started.</p>
          </>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-toggle-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="dashboard-title">Dashboard</h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-body">
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        )}

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <ul className="sidebar-menu">
            {/* Update state when clicked */}
            <li
              onClick={() => setActiveView("home")}
              className={activeView === "home" ? "active" : ""}
            >
              Home
            </li>
            <li
              onClick={() => setActiveView("users")}
              className={activeView === "users" ? "active" : ""}
            >
              Users
            </li>
          </ul>
        </aside>

        {/* Main Content Area dynamically renders based on state */}
        <main className="dashboard-main">{renderContent()}</main>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          &copy; {new Date().getFullYear()} TECHNIC MENTORS. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
