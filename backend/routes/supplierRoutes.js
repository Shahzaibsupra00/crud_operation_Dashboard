const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists in your backend root!
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appends timestamp to prevent overwriting
  },
});

const upload = multer({ storage: storage });

// --- Routes ---
router.get("/", getSuppliers);

router.post("/", upload.single("pic"), createSupplier);

router.put("/:id", upload.single("pic"), updateSupplier);

router.delete("/:id", deleteSupplier);

module.exports = router;
