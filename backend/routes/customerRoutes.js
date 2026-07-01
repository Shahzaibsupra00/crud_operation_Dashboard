const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure Multer to save files in the 'uploads' folder
const upload = multer({ dest: "uploads/" });

const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

router.get("/", getCustomers);

router.post("/", upload.single("pic"), createCustomer);

router.put("/:id", upload.single("pic"), updateCustomer);

router.delete("/:id", deleteCustomer);

module.exports = router;
