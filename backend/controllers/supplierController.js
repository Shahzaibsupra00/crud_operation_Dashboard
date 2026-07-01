const Supplier = require("../models/Supplier");

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { supplier_name, email, contact, cnic, address, status, pic } =
      req.body;
    let picPath = "";
    if (req.file) {
      picPath = `/uploads/${req.file.filename}`;
    }
    const newSupplier = new Supplier({
      supplier_name,
      email,
      contact,
      cnic,
      address,
      status: status || "Y",
      pic: picPath,
    });
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { supplier_name, email, contact, cnic, address, status, pic } =
      req.body;
    const updateData = { supplier_name, email, contact, cnic, address, status };

    // Only update the picture if a new file was uploaded
    if (req.file) {
      updateData.pic = `/uploads/${req.file.filename}`;
    }
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" },
    );
    if (!updatedSupplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { status: "N" },
      { new: true },
    );
    if (!deletedSupplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res
      .status(200)
      .json({
        message: "Supplier deleted successfully (soft delete)",
        supplier: deletedSupplier,
      });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
