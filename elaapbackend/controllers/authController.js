import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    console.log("=================================");
    console.log("LOGIN REQUEST RECEIVED");
    console.log("LOGIN BODY:", req.body);
    console.log("=================================");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log("STEP 1: Request body received");

    const normalizedEmail = email.trim().toLowerCase();

    console.log("STEP 2: Searching user:", normalizedEmail);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    console.log("STEP 3: User search completed");

    if (!user) {
      console.log("USER NOT FOUND");

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("USER FOUND:", user.email);

    console.log("STEP 4: Checking password");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("STEP 5: Password check completed");

    if (!isPasswordValid) {
      console.log("INVALID PASSWORD");

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("PASSWORD CORRECT");

    console.log("STEP 6: Creating token");

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    console.log("STEP 7: Token created");

    return res.status(200).json({
      success: true,
      message: "Access granted. Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "employee",
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};
