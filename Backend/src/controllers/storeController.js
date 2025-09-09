import { StoreModel } from "../models/storeModel.js";

export const StoreController = {
  async createStore(req, res) {
  const { name, email, address } = req.body;
  try {
    const store = await StoreModel.createStore({
      name,
      email,
      address,
      owner_id: req.user.id, // ✅ take from token
    });
    res.status(201).json(store);
  } catch (err) {
    console.error("❌ Error creating store:", err);
    res.status(500).json({ error: "Failed to create store" });
  }
},


  async getStores(req, res) {
    try {
      const stores = await StoreModel.getAll();
      res.json(stores);
    } catch (err) {
      console.error("❌ Error fetching stores:", err);
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  },

  async getStoreById(req, res) {
    try {
      const { id } = req.params;
      const numericId = Number(id);

      if (isNaN(numericId)) {
        return res.status(400).json({ error: "Invalid store ID" });
      }

      const store = await StoreModel.findById(numericId);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.json(store);
    } catch (err) {
      console.error("❌ Error fetching store:", err);
      res.status(500).json({ error: "Failed to fetch store" });
    }
  },

  // NEW: Fetch stores owned by a specific owner
  async getStoresByOwner(req, res) {
  try {
    const ownerId = req.user.id;
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

    const stores = await StoreModel.findByOwner(ownerId);
    res.json(stores);
  } catch (err) {
    console.error("❌ Error fetching owner's stores:", err);
    res.status(500).json({ error: "Failed to fetch owner's stores" });
  }
},

async getReviewsForOwnerStores(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    const ownerId = Number(req.user.id);
    if (isNaN(ownerId)) {
      return res.status(400).json({ error: "Invalid owner ID" });
    }

    const reviews = await RatingModel.getReviewsByOwnerStores(ownerId);
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching owner reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

};
