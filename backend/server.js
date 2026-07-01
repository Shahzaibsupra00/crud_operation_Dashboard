const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// --- IMPORT YOUR ROUTES ---
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- USE YOUR ROUTES ---
app.use("/api/users", userRoutes); // Tell Express to use the user routes
app.use("/api/auth", authRoutes);
app.use("/api/", roleRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});
