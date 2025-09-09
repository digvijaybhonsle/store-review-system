import express from "express";
import { AuthController } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Normal User Signup
router.post("/signup/user", (req, res) => {
  req.body.role = "USER";
  AuthController.register(req, res);
});

// Store Owner Signup
router.post("/signup/store-owner", (req, res) => {
  req.body.role = "STORE_OWNER";
  AuthController.register(req, res);
});

// Admin Signup 
router.post("/signup/admin", (req, res) => {
  req.body.role = "ADMIN";
  AuthController.register(req, res);
});

// Login (for all roles)
router.post("/login", AuthController.login);

router.put("/update-password", authenticate, AuthController.updatePassword);

export default router;
