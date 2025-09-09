import { Router } from "express";
import { RatingController } from "../controllers/ratingController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// ✅ Create rating (only USER role)
router.post("/", authenticate, requireRole("USER"), RatingController.createRating);

// ✅ Get all ratings
router.get("/", RatingController.getRatings);

// ✅ Get ratings by User (specific route, must come before :id)
router.get("/user/:id", authenticate, requireRole("USER"), RatingController.getRatingsByUser);

// ✅ Get ratings for all stores owned by the logged-in owner
router.get("/owner", authenticate, requireRole("STORE_OWNER"), RatingController.getReviewsForOwnerStores);

// ✅ Finally: Get rating by ID (generic, keep last)
router.get("/:id", RatingController.getRatingById);

export default router;
