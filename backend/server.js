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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- USE YOUR ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // Tell Express to use the user routes

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});
