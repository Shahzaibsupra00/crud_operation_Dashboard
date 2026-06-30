const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure an "uploads" folder exists in your backend directory!
  },
  filename: function (req, file, cb) {
    // Generate a unique file name using the current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// --- ROUTES ---
router.get("/", getUsers);
// Notice we added `upload.single('img')` as middleware to intercept the file before the controller
router.post("/", upload.single("img"), createUser);
router.put("/:id", upload.single("img"), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
