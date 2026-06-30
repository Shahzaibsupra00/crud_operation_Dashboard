import React, { useState, useEffect } from "react";
import "./dashboard.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Added confirmPassword to tracking form data
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
        setAvailableRoles(data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUsers(data);
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

    // Password Match Validation Logic
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
      // Don't send confirmPassword to the backend API
      if (key !== "confirmPassword") {
        submitData.append(key, formData[key]);
      }
    });

    if (imageFile) {
      submitData.append("img", imageFile);
    }

    try {
      await fetch(url, {
        method,
        body: submitData,
      });

      resetForm();
      fetchUsers();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving user:", error);
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
        await fetch(`http://localhost:5000/api/users/${user._id}`, {
          method: "PUT",
          body: submitData,
        });
        fetchUsers();
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
    <div className="user-management">
      {showForm ? (
        /* --- REGISTRATION FORM SCREEN --- */
        <div className="registration-screen">
          <div className="form-header">
            <h2>{editingId ? "Edit User Profile" : "New User Registration"}</h2>
            <button onClick={handleCancel} className="back-btn">
              &larr; Back to Users
            </button>
          </div>

          <form onSubmit={handleSubmit} className="full-user-form">
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly={!!editingId} // Readonly mode active when editing
                  style={
                    editingId
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>

              <div className="input-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>CNIC</label>
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group full-width">
                <label>Physical Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  Password {editingId && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingId}
                />
              </div>

              {/* NEW: Confirm Password Field */}
              <div className="input-group">
                <label>
                  Confirm Password{" "}
                  {editingId && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!editingId}
                />
              </div>

              <div className="input-group">
                <label>User Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
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

              <div className="input-group full-width">
                <label>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="form-actions-main">
              <button type="submit" className="save-btn-large">
                {editingId ? "Update User" : "Register User"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* --- DATA TABLE SCREEN --- */
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
                        style={{ marginRight: "10px" }}
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
      )}
    </div>
  );
};

export default UserManagement;
