import React, { useState, useEffect } from "react";
import "./dashboard.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    cnic: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/roles");
      const data = await response.json();
      if (response.ok) {
        // Handle cases where the backend wraps the array in an object
        setAvailableRoles(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();

      // FIX: Robust check to ensure we are setting an array to state
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error("Unexpected API response format:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const url = editingId
      ? `http://localhost:5000/api/users/${editingId}`
      : "http://localhost:5000/api/users";
    const method = editingId ? "PUT" : "POST";

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") {
        submitData.append(key, formData[key]);
      }
    });

    if (imageFile) {
      submitData.append("img", imageFile);
    }

    try {
      const response = await fetch(url, {
        method,
        body: submitData,
      });

      // FIX: Added error checking to stop the form from closing if the backend rejects it
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || errorData?.error || "Unknown Server Error";
        alert(`Failed to save user: ${errorMessage}`);
        return;
      }

      resetForm();
      fetchUsers(); // Refresh the table
      setShowForm(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Network error: Could not connect to the server.");
    }
  };

  const handleAddNewUser = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      contact: user.contact || "",
      cnic: user.cnic || "",
      address: user.address || "",
      password: "",
      confirmPassword: "",
      role: user.role || "user",
    });
    setEditingId(user._id);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDeactivate = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      const submitData = new FormData();
      submitData.append("name", user.name || "");
      submitData.append("email", user.email || "");
      submitData.append("contact", user.contact || "");
      submitData.append("cnic", user.cnic || "");
      submitData.append("address", user.address || "");
      submitData.append("role", user.role || "user");
      submitData.append("status", "N");

      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${user._id}`,
          {
            method: "PUT",
            body: submitData,
          },
        );

        if (response.ok) {
          fetchUsers();
        } else {
          alert("Failed to delete user.");
        }
      } catch (error) {
        console.error("Error deactivating user:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      contact: "",
      cnic: "",
      address: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });
    setEditingId(null);
    setImageFile(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="user-management" style={{ position: "relative" }}>
      {/* --- ALWAYS SHOW DATA TABLE SCREEN --- */}
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
          <h2>User Directory</h2>
          <button
            onClick={handleAddNewUser}
            className="add-btn-large"
            style={{
              padding: "12px 24px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            + Add New User
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
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={
                        user.img?.startsWith("http")
                          ? user.img
                          : `http://localhost:5000${user.img}`
                      }
                      alt="avatar"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
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
                      onClick={() => handleDeactivate(user)}
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
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <div className="registration-screen">
              <div
                className="form-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <h2>
                  {editingId ? "Edit User Profile" : "New User Registration"}
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
                  &times; Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="full-user-form">
                <div
                  className="form-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                  }}
                >
                  <div className="input-group">
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      readOnly={!!editingId}
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                        backgroundColor: editingId ? "#e9ecef" : "white",
                        cursor: editingId ? "not-allowed" : "text",
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      CNIC
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div
                    className="input-group full-width"
                    style={{ gridColumn: "span 2" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Physical Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Password {editingId && "(Leave blank to keep current)"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!editingId}
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Confirm Password{" "}
                      {editingId && "(Leave blank to keep current)"}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!editingId}
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="input-group">
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      User Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      {availableRoles
                        .filter((role) => role.status === "Y")
                        .map((role) => (
                          <option key={role._id} value={role.rolename}>
                            {role.rolename}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div
                    className="input-group full-width"
                    style={{ gridColumn: "span 2" }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="form-actions-main"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "20px",
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
                    {editingId ? "Update User" : "Register User"}
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

export default UserManagement;
