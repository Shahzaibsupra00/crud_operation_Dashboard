require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seedAdmin() {
  try {
    // 1. Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected successfully.");

    // 2. Delete ALL existing users from the database
    await User.deleteMany({});
    console.log("🗑️  Cleared all existing users from the database.");

    // 4. Create the admin using the updated schema fields
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "11223344",
      role: "admin",
      contact: "1234567890",
      cnic: "1234512345671",
      address: "123 Admin Street, Tech City",
      img: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      status: "Y",
    });

    console.log("🎉 Admin seeded successfully!");
    process.exit(0);
  } catch (error) {
    // 5. Catch and display errors gracefully
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();
