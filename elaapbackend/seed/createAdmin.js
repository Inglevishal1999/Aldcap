const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/connectDB"); // adjust filename if yours differs
const User = require("../models/User");

dotenv.config();


const createAdmin = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    const email = "admin@aldc.com";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@12345", 12);

    // Create admin
    const admin = await User.create({
      name: "ALDC Administrator",
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("================================");
    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exit(1);
  }
};

createAdmin();