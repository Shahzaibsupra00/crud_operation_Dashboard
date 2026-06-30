// controllers/roleController.js
const Role = require("../models/Role"); // Adjust path if needed

// ==========================================
// 1. CREATE: Add a new role
// ==========================================
const createRole = async (req, res) => {
  try {
    const { rolename, status } = req.body;

    const existingRole = await Role.findOne({ rolename });
    if (existingRole) {
      return res.status(400).json({ error: "Role already exists" });
    }

    const newRole = new Role({
      rolename,
      status: status || "Y",
    });

    const savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ==========================================
// 2. READ: Get all roles
// ==========================================
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

// ==========================================
// 3. UPDATE: Edit an existing role
// ==========================================
const updateRole = async (req, res) => {
  try {
    const { rolename, status } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { rolename, status },
      { new: true },
    );

    if (!updatedRole) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ==========================================
// 4. DELETE: Remove a role
// ==========================================
const deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);

    if (!deletedRole) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Export all the functions so the route file can use them
module.exports = {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
};
