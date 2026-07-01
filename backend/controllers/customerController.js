const Customer = require("../models/Customer");

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { customer_name, email, contact, cnic, address, status } = req.body;

    // Check if Multer processed an image file
    let picPath = "";
    if (req.file) {
      picPath = `/uploads/${req.file.filename}`;
    }

    const newCustomer = new Customer({
      customer_name,
      email,
      contact,
      cnic,
      address,
      status: status || "Y",
      pic: picPath,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { customer_name, email, contact, cnic, address, status } = req.body;
    const updateData = { customer_name, email, contact, cnic, address, status };

    // Only update the picture if a new file was uploaded
    if (req.file) {
      updateData.pic = `/uploads/${req.file.filename}`;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" },
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    // SOFT DELETE: Update the status to "N" instead of removing the document entirely
    const deletedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { status: "N" },
      { new: true },
    );

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer deleted successfully (soft delete)",
      customer: deletedCustomer,
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
