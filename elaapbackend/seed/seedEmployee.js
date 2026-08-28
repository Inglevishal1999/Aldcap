// seed/seedEmployee.js
//
// Usage (run from the elaapbackend root folder):
//   node seed/seedEmployee.js

const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("../Connectdb"); // Connectdb.js lives in the project root, not config/
const User = require("../models/User");

dotenv.config();

const seedEmployee = async () => {
  try {
    await connectDB();

    const email = "employee@test.com";
    const plainPassword = "Employee@12345";

    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Employee account already exists:", existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const employee = await User.create({
      name: "Employee User",
      email,
      password: hashedPassword,
      role: "employee",
      isActive: true,
    });

    console.log("================================");
    console.log("Employee account created successfully!");
    console.log("Email:", employee.email);
    console.log("Password:", plainPassword, "(plain text, for testing only)");
    console.log("Role:", employee.role);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedEmployee();
