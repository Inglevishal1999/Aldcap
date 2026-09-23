import User from "../models/User.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    // 1. Destructure incoming payload keys matching your React state strings
    const { email, password } = req.body;

    // 2. Validate input fields are present
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both an email and password."
      });
    }

    // 3. Look up user by lowercase email string
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password." 
      });
    }

    // 4. Verify the submitted password against the database hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password." 
      });
    }

    // 5. Generate JSON Web Token (JWT) securely
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "1d" }
    );

    // 6. Return the exact object structure your React frontend expects
    return res.status(200).json({
      success: true,
      message: "Access granted. Login successful.",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role // Returns "admin" or "employee" to pass React validation rules
      }
    });

  } catch (error) {
    console.error("Login verification system error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Unable to connect to the login service due to a server error." 
    });
  }
};
