import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const AuthController = {
  // Generic register function
  async register(req, res) {
    const { name, email, password, address, role } = req.body;
    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.createUser({
        name,
        email,
        password: hashedPassword,
        address,
        role,
      });

      res.status(201).json(user);
    } catch (err) {
      console.error("Error in register:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Error in login:", err);
      res.status(500).json({ error: "Login failed" });
    }
  },

  async updatePassword(req, res) {
    const userId = req.user.id; // From JWT
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          message: "Email, current password, and new password are required",
        });
    }

    try {
      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Verify email matches authenticated user's email
      if (user.email !== email) {
        return res
          .status(403)
          .json({ message: "Email does not match logged-in user" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(userId, hashedNewPassword);

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error("Error updating password:", err);
      res.status(500).json({ message: "Failed to update password" });
    }
  },
};
