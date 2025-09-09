import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";

export const UserController = {
  // Admin creates a user manually
  async createUser(req, res) {
    const { name, email, password, address, role } = req.body;
    try {
      // Hash password before saving
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
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Failed to create user" });
    }
  },

  // Get all users (admin only)
  async getUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },
};
