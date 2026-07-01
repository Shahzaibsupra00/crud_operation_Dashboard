import React, { useState, useEffect } from "react";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);
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
    <div className="user-management" style={{ position: "relative" }}>
      {/* Universal Message Banner (Shows on the Table View) */}
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

      {/* --- ALWAYS SHOW TABLE SCREEN --- */}
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
                <th style={{ textAlign: "left", padding: "12px" }}>Actions</th>
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
                    ></span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => handleEdit(role)}
                      className="edit-btn"
                      style={{
                        marginRight: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#ffc107",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
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
                      }}
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

      {/* --- MODAL FORM SCREEN (OVERLAYS THE TABLE) --- */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Guarantees it sits on top
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <div className="registration-screen">
              <div
                className="form-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "10px",
                }}
              >
                <h2 style={{ margin: 0 }}>
                  {editingId ? "Edit Role" : "Add New Role"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="back-btn"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Message Banner (Shows inside modal if form submission fails) */}
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
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Role *
                    </label>
                    <input
                      type="text"
                      name="rolename"
                      value={formData.rolename}
                      onChange={handleChange}
                      placeholder="e.g., Administrator, Editor"
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        boxSizing: "border-box",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="form-actions-main"
                  style={{
                    marginTop: "25px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn-large"
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    {editingId ? "Update Role" : "Save Role"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
