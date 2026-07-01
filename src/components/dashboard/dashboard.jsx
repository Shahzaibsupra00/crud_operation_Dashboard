import React, { useState } from "react";
import UserManagement from "./UserManagement";
import RoleManagement from "./RoleManagement";
import CustomersManagement from "./CustomersManagement/CustomersManagement";
import SuppliersManagement from "./SuppliersManagement/SuppliersManagement";
import EmployersManagement from "./EmployersManagement/EmployersManagement";
import "./dashboard.css";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("home");

  // NEW: State to track which modules are expanded in the sidebar
  const [expandedMenus, setExpandedMenus] = useState({
    systemUsers: false,
    people: false,
  });

  const admin = JSON.parse(localStorage.getItem("admin"));
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // NEW: Function to toggle individual modules open and closed
  const toggleSubMenu = (menuName) => {
    setExpandedMenus((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName], // Toggle the clicked menu
    }));
  };

  const renderContent = () => {
    switch (activeView) {
      case "users":
        return <UserManagement />;
      case "roles":
        return <RoleManagement />;

      // NEW: Placeholder views for the People module
      case "customers":
        return <CustomersManagement />;
      case "suppliers":
        return <SuppliersManagement />;
      case "employers":
        return <EmployersManagement />;

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
            {/* Top Level Item */}
            <li
              onClick={() => setActiveView("home")}
              className={`menu-item ${activeView === "home" ? "active" : ""}`}
              style={{ cursor: "pointer", padding: "10px 15px" }}
            >
              Home
            </li>

            {/* MODULE 1: System Users */}
            <li className="menu-module">
              <div
                className="module-header"
                onClick={() => toggleSubMenu("systemUsers")}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  padding: "5px",
                  fontWeight: "bold",
                  backgroundColor: expandedMenus.systemUsers
                    ? "rgba(0,0,0,0.05)"
                    : "transparent",
                }}
              >
                <span>System Users</span>
                <span>{expandedMenus.systemUsers ? "▼" : "▶"}</span>
              </div>

              {/* System Users Sub-modules */}
              {expandedMenus.systemUsers && (
                <ul
                  className="sub-menu"
                  style={{
                    paddingLeft: "30px",
                    listStyleType: "none",
                    margin: 0,
                  }}
                >
                  <li
                    onClick={() => setActiveView("users")}
                    className={activeView === "users" ? "active" : ""}
                    style={{
                      cursor: "pointer",
                      padding: "8px 0",
                      color: activeView === "users" ? "#007bff" : "inherit",
                    }}
                  >
                    Users
                  </li>
                  <li
                    onClick={() => setActiveView("roles")}
                    className={activeView === "roles" ? "active" : ""}
                    style={{
                      cursor: "pointer",
                      padding: "8px 0",
                      color: activeView === "roles" ? "#007bff" : "inherit",
                    }}
                  >
                    Roles
                  </li>
                </ul>
              )}
            </li>

            {/* MODULE 2: People */}
            <li className="menu-module">
              <div
                className="module-header"
                onClick={() => toggleSubMenu("people")}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  padding: "10px 15px",
                  fontWeight: "bold",
                  backgroundColor: expandedMenus.people
                    ? "rgba(0,0,0,0.05)"
                    : "transparent",
                }}
              >
                <span>People</span>
                <span>{expandedMenus.people ? "▼" : "▶"}</span>
              </div>

              {/* People Sub-modules */}
              {expandedMenus.people && (
                <ul
                  className="sub-menu"
                  style={{
                    paddingLeft: "30px",
                    listStyleType: "none",
                    margin: 0,
                  }}
                >
                  <li
                    onClick={() => setActiveView("customers")}
                    className={activeView === "customers" ? "active" : ""}
                    style={{
                      cursor: "pointer",
                      padding: "8px 0",
                      color: activeView === "customers" ? "#007bff" : "inherit",
                    }}
                  >
                    Customer
                  </li>
                  <li
                    onClick={() => setActiveView("suppliers")}
                    className={activeView === "suppliers" ? "active" : ""}
                    style={{
                      cursor: "pointer",
                      padding: "8px 0",
                      color: activeView === "suppliers" ? "#007bff" : "inherit",
                    }}
                  >
                    Supplier
                  </li>
                  <li
                    onClick={() => setActiveView("employers")}
                    className={activeView === "employers" ? "active" : ""}
                    style={{
                      cursor: "pointer",
                      padding: "8px 0",
                      color: activeView === "employers" ? "#007bff" : "inherit",
                    }}
                  >
                    Employee
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </aside>

        {/* Main Content Area dynamically renders based on state */}
        <main className="dashboard-main">{renderContent()}</main>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          &copy; {new Date().getFullYear()} TECHNIC MENTORS. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
