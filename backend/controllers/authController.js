const User = require("../models/User");

// General Login (Allows both 'admin' and 'user')
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if fields are empty
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    // 2. Find account by email, password, and allow specific roles
    const account = await User.findOne({
      email,
      password,
      role: { $in: ["admin", "user"] }, // This allows either role to proceed
    });

    // 3. Verify credentials exist
    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password.",
      });
    }

    // 4. Check the account status AFTER verifying credentials
    if (account.status === "N") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Login restricted.",
      });
    }

    // 5. If credentials are correct and status is OK, proceed with login
    return res.status(200).json({
      success: true,
      message: "Login Successful.",
      userData: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role, // The frontend will receive whether they are an admin or user here
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = login;
