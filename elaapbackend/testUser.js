const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    const hashedPassword = await bcrypt.hash(
      "Admin@12345",
      10
    );

    const user = await User.create({
      name: "Test Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Test user created:");
    console.log(user.email);
    console.log(user.role);

    process.exit();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });