import { Router } from "express";
import { StoreController } from "../controllers/storeController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// Create a new store (admin only)
router.post("/", authenticate, requireRole(["STORE_OWNER", "ADMIN"]), StoreController.createStore);

// Get all stores (public)
router.get("/", StoreController.getStores);

// Get stores owned by the logged-in owner
router.get(
  "/owner",
  authenticate,
  requireRole(["STORE_OWNER", "ADMIN"]),
  StoreController.getStoresByOwner
);


// Get store by ID (public)
router.get("/:id", StoreController.getStoreById);

export default router;
