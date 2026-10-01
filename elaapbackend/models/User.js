
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // User name
    name: {
      type: String,
      trim: true,
    },

    // Email used for login
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
    },

    // User role
    role: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
      default: "employee",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;