import React, { useState, useEffect } from "react";
import "./dashboard.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    cnic: "",
    address: "",
    password: "",
    role: "user",
    status: "Y",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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
    const url = editingId
      ? `http://localhost:5000/api/users/${editingId}`
      : "http://localhost:5000/api/users";
    const method = editingId ? "PUT" : "POST";

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
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
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      contact: user.contact || "",
      cnic: user.cnic || "",
      address: user.address || "",
      password: "",
      role: user.role || "user",
      status: user.status || "Y",
    });
    setEditingId(user._id);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
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
      role: "user",
      status: "Y",
    });
    setEditingId(null);
    setImageFile(null);
  };

  return (
    <div className="user-management">
      <h3>{editingId ? "Edit User" : "Add New User"}</h3>

      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          name="name"
          placeholder="Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cnic"
          placeholder="CNIC"
          value={formData.cnic}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required={!editingId}
        />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Y">Active (Y)</option>
          <option value="N">Inactive (N)</option>
        </select>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* --- NEW WRAPPER ADDED HERE FOR SCROLLING --- */}
      <div
        className="table-container"
        style={{ maxHeight: "400px", overflowY: "auto", marginTop: "20px" }}
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
              <th>Status</th>
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
                <td>{user.status === "Y" ? "Active" : "Inactive"}</td>
                <td>
                  <button onClick={() => handleEdit(user)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* -------------------------------------------- */}
    </div>
  );
};

export default UserManagement;
