import React, { useState, useEffect } from "react";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  // NEW: State to toggle between the Table view and Form view
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    rolename: "",
    status: "Y",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/roles");
      const data = await response.json();
      if (response.ok) {
        setRoles(data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const url = editingId
      ? `http://localhost:5000/api/roles/${editingId}`
      : "http://localhost:5000/api/roles";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: editingId
            ? "Role updated successfully!"
            : "Role created successfully!",
        });
        resetForm();
        fetchRoles();
        setShowForm(false); // Return to the table view on success
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to save role.",
        });
      }
    } catch (error) {
      console.error("Error saving role:", error);
      setMessage({ type: "error", text: "Network error occurred." });
    }
  };

  // Open form for a NEW role
  const handleAddNewRole = () => {
    resetForm();
    setMessage({ type: "", text: "" });
    setShowForm(true);
  };

  // Open form to EDIT an existing role
  const handleEdit = (role) => {
    setFormData({
      rolename: role.rolename,
      status: role.status,
    });
    setEditingId(role._id);
    setMessage({ type: "", text: "" });
    setShowForm(true);
  };

  // SOFT DELETE: Deactivate the role
  const handleDeactivate = async (role) => {
    if (
      window.confirm(
        `Are you sure you want to deactivate the "${role.rolename}" role?`,
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/roles/${role._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rolename: role.rolename, status: "N" }),
          },
        );

        if (response.ok) {
          setMessage({
            type: "success",
            text: "Role deactivated successfully!",
          });
          fetchRoles();
        } else {
          setMessage({ type: "error", text: "Failed to deactivate role." });
        }
      } catch (error) {
        console.error("Error deactivating role:", error);
        setMessage({ type: "error", text: "Network error occurred." });
      }
    }
  };

  const resetForm = () => {
    setFormData({ rolename: "", status: "Y" });
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
    setMessage({ type: "", text: "" }); // Clear any lingering messages
  };

  return (
    <div className="user-management">
      {/* Universal Message Banner */}
      {message.text && !showForm && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
          }}
        >
          {message.text}
        </div>
      )}

      {/* CONDITIONAL RENDERING: Form Screen OR Table Screen */}
      {showForm ? (
        /* --- FORM SCREEN --- */
        <div className="registration-screen">
          <div
            className="form-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
              borderBottom: "2px solid #f0f0f0",
              paddingBottom: "15px",
            }}
          >
            <h2>{editingId ? "Edit Role" : "Add New Role"}</h2>
            <button onClick={handleCancel} className="back-btn">
              ← Back to Roles
            </button>
          </div>

          {message.text && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "4px",
                backgroundColor:
                  message.type === "success" ? "#d4edda" : "#f8d7da",
                color: message.type === "success" ? "#155724" : "#721c24",
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="full-user-form">
            <div className="form-grid">
              <div className="input-group">
                <label>Role *</label>
                <input
                  type="text"
                  name="rolename"
                  value={formData.rolename}
                  onChange={handleChange}
                  placeholder="e.g., Administrator, Editor"
                  required
                />
              </div>

              <div className="input-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Y">Active (Y)</option>
                  <option value="N">Inactive (N)</option>
                </select>
              </div>
            </div>

            <div
              className="form-actions-main"
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button type="submit" className="save-btn-large">
                {editingId ? "Update Role" : "Save Role"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* --- TABLE SCREEN --- */
        <div className="table-screen">
          <div
            className="table-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>Role Directory</h2>
            <button
              onClick={handleAddNewRole}
              className="add-btn-large"
              style={{
                padding: "12px 24px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              + Add New Role
            </button>
          </div>

          <div
            className="table-container"
            style={{ maxHeight: "600px", overflowY: "auto" }}
          >
            <table
              className="user-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f4f4f4",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th style={{ textAlign: "left", padding: "12px" }}>Role</th>
                  <th style={{ textAlign: "left", padding: "12px" }}></th>
                  <th style={{ textAlign: "left", padding: "12px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "12px", fontWeight: "500" }}>
                      {role.rolename}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          color: role.status === "Y" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {/* {role.status === "Y" ? "Active" : "Inactive"} */}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleEdit(role)}
                        className="edit-btn"
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeactivate(role)}
                        className="delete-btn"
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          opacity: role.status === "N" ? 0.5 : 1,
                        }}
                        disabled={role.status === "N"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#666",
                        fontSize: "16px",
                      }}
                    >
                      No roles found. Click "+ Add New Role" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
