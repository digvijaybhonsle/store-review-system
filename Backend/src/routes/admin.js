import express from "express";
import { authenticate } from "../middleware/auth.js";  
import { requireRole } from "../middleware/role.js";   

const router = express.Router();

// Example protected route only for admin
router.get("/", authenticate, requireRole("admin"), (req, res) => {
    res.json({ message: `Hello ${req.user.email}, welcome Admin!` });
});

export default router;
