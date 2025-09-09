import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", authenticate, requireRole("admin"), UserController.getUsers);
router.post("/", authenticate, requireRole("admin"), UserController.createUser);

export default router;
