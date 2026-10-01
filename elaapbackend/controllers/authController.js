
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const startTime = performance.now();

  try {
    // Get login credentials
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both an email and password.",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const dbStart = performance.now();

    const user = await User.findOne({
      email: normalizedEmail,
    }).lean();

    const dbTime = Math.round(
      performance.now() - dbStart
    );

    console.log(`Login DB query: ${dbTime} ms`);

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify password
    const bcryptStart = performance.now();

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    const bcryptTime = Math.round(
      performance.now() - bcryptStart
    );

    console.log(
      `Password verification: ${bcryptTime} ms`
    );

    // Wrong password
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Make sure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables."
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication service is not configured correctly.",
      });
    }

    // Generate JWT
    const tokenStart = performance.now();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const tokenTime = Math.round(
      performance.now() - tokenStart
    );

    console.log(
      `JWT generation: ${tokenTime} ms`
    );

    // Total controller time
    const totalTime = Math.round(
      performance.now() - startTime
    );

    console.log(
      `Total login controller time: ${totalTime} ms`
    );

    // Send response
    return res.status(200).json({
      success: true,
      message: "Access granted. Login successful.",
      token,

      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const totalTime = Math.round(
      performance.now() - startTime
    );

    console.error(
      "Login verification error:",
      error
    );

    console.error(
      `Login failed after: ${totalTime} ms`
    );

    return res.status(500).json({
      success: false,
      message: "Unable to process login request.",
    });
  }
};
