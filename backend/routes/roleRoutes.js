// routes/roleRoutes.js
const express = require("express");
const router = express.Router();

// Import the controller functions
const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

// Map the routes to their specific controller functions
router.post("/roles", createRole);
router.get("/roles", getRoles);
router.put("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

module.exports = router;
