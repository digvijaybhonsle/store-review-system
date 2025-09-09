import { RatingModel } from "../models/ratingModel.js";

export const RatingController = {
  // Create a new rating
  async createRating(req, res) {
    const { store_id, rating, review } = req.body;
    try {
      const newRating = await RatingModel.createRating({
        user_id: req.user.id, // from JWT
        store_id,
        rating,
        review,
      });
      res.status(201).json(newRating);
    } catch (err) {
      console.error("❌ Error creating rating:", err);
      if (err.code === "23505") {
        return res.status(400).json({ error: "You already reviewed this store" });
      }
      res.status(500).json({ error: "Failed to create rating" });
    }
  },

  // Get all ratings
  async getRatings(req, res) {
    try {
      const ratings = await RatingModel.getAll();
      res.status(200).json(ratings);
    } catch (err) {
      console.error("❌ Error fetching ratings:", err);
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  },

  // Get rating by ID
  async getRatingById(req, res) {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (isNaN(numericId)) {
        return res.status(400).json({ error: "Invalid rating ID" });
      }

      const rating = await RatingModel.findById(numericId);
      if (!rating) return res.status(404).json({ error: "Rating not found" });

      res.json(rating);
    } catch (err) {
      console.error("❌ Error fetching rating:", err);
      res.status(500).json({ error: "Failed to fetch rating" });
    }
  },

  // Get ratings by User
  async getRatingsByUser(req, res) {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (isNaN(numericId) || numericId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden. You can only view your own reviews." });
      }

      const ratings = await RatingModel.findByUserId(numericId);
      res.json(ratings);
    } catch (err) {
      console.error("❌ Error fetching user ratings:", err);
      res.status(500).json({ error: "Failed to fetch user ratings" });
    }
  },

  // Get reviews for owner's stores
  async getReviewsForOwnerStores(req, res) {
    try {
      const ownerId = req.user.id; // from JWT
      const reviews = await RatingModel.getReviewsByOwnerStores(ownerId);
      res.json(reviews);
    } catch (err) {
      console.error("❌ Error fetching owner store reviews:", err);
      res.status(500).json({ error: "Failed to fetch reviews for your stores" });
    }
  },
};
