import React, { useState, useEffect } from "react";
import "../dashboard.css";

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // NEW STATE: Holds the data of the customer currently being viewed
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    contact: "",
    cnic: "",
    address: "",
    status: "Y",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");

      const data = await response.json();

      if (Array.isArray(data)) {
        setCustomers(data);
      } else if (data && Array.isArray(data.data)) {
        setCustomers(data.data);
      } else if (data && Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else {
        console.error("Unexpected API response format:", data);
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching Customers:", error);
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
      ? `http://localhost:5000/api/customers/${editingId}`
      : "http://localhost:5000/api/customers";
    const method = editingId ? "PUT" : "POST";

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    if (imageFile) {
      submitData.append("pic", imageFile);
    }

    try {
      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || errorData?.error || "Unknown Server Error";
        alert(`Failed to save customer: ${errorMessage}`);
        return;
      }

      resetForm();
      fetchCustomers();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Network error: Could not connect to the server.");
    }
  };

  const handleAddNewCustomer = () => {
    resetForm();
    setShowForm(true);
  };

  // NEW FUNCTION: Sets the customer to view
  const handleView = (customer) => {
    setViewingCustomer(customer);
  };

  const handleEdit = (customer) => {
    setFormData({
      customer_name: customer.customer_name || "",
      email: customer.email || "",
      contact: customer.contact || "",
      cnic: customer.cnic || "",
      address: customer.address || "",
      status: customer.status || "Y",
    });
    setEditingId(customer._id);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDeactivate = async (customer) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${customer.customer_name}?`,
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/customers/${customer._id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          fetchCustomers();
        } else {
          alert("Failed to delete customer.");
        }
      } catch (error) {
        console.error("Error deactivating customer:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
      email: "",
      contact: "",
      cnic: "",
      address: "",
      status: "Y",
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
          <h2>Customer Directory</h2>
          <button
            onClick={handleAddNewCustomer}
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
            + Add New Customer
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
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    {customer.pic && (
                      <img
                        src={
                          customer.pic.startsWith("http")
                            ? customer.pic
                            : `http://localhost:5000${customer.pic}`
                        }
                        alt="avatar"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </td>
                  <td>{customer.customer_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.contact}</td>
                  <td>
                    {/* NEW VIEW BUTTON */}
                    <button
                      onClick={() => handleView(customer)}
                      className="edit-btn"
                      style={{
                        marginRight: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#00f2ff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#000",
                      }}
                    >
                      👁
                    </button>
                    <button
                      onClick={() => handleEdit(customer)}
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
                      onClick={() => handleDeactivate(customer)}
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
            zIndex: 9999,
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
                  {editingId
                    ? "Edit Customer Profile"
                    : "New Customer Registration"}
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
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
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
                      Address
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
                      Profile Image (Pic)
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
                    {editingId ? "Update Customer" : "Register Customer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW VIEW DETAILS MODAL SCREEN --- */}
      {viewingCustomer && (
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
            zIndex: 9999,
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              <h2 style={{ margin: 0 }}>Customer Details</h2>
              <button
                onClick={() => setViewingCustomer(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {/* Profile Image View */}
              {viewingCustomer.pic ? (
                <div style={{ textAlign: "center", marginBottom: "15px" }}>
                  <img
                    src={
                      viewingCustomer.pic.startsWith("http")
                        ? viewingCustomer.pic
                        : `http://localhost:5000${viewingCustomer.pic}`
                    }
                    alt="Customer"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 15px auto",
                    color: "#999",
                  }}
                >
                  No Image
                </div>
              )}

              {/* Data Rows */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "10px",
                }}
              >
                <strong style={{ color: "#555" }}>Name:</strong>
                <span>{viewingCustomer.customer_name || "N/A"}</span>

                <strong style={{ color: "#555" }}>Email:</strong>
                <span>{viewingCustomer.email || "N/A"}</span>

                <strong style={{ color: "#555" }}>Contact:</strong>
                <span>{viewingCustomer.contact || "N/A"}</span>

                <strong style={{ color: "#555" }}>CNIC:</strong>
                <span>{viewingCustomer.cnic || "N/A"}</span>

                <strong style={{ color: "#555" }}>Address:</strong>
                <span>{viewingCustomer.address || "N/A"}</span>

                <strong style={{ color: "#555" }}>Status:</strong>
                <span>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        viewingCustomer.status === "Y" ? "#d4edda" : "#f8d7da",
                      color:
                        viewingCustomer.status === "Y" ? "#155724" : "#721c24",
                    }}
                  >
                    {viewingCustomer.status === "Y" ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>
            </div>

            <div style={{ marginTop: "25px", textAlign: "right" }}>
              <button
                onClick={() => setViewingCustomer(null)}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManagement;
