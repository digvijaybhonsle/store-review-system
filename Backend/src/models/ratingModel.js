import pool from "../config/db.js";

export const RatingModel = {
  async createRating({ user_id, store_id, rating, review }) {
    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating, review)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, store_id, rating, review || null]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      `SELECT r.*, u.name AS user_name, s.name AS store_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       ORDER BY r.id ASC`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT r.*, u.name AS user_name, s.name AS store_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async findByUserId(user_id) {
    const result = await pool.query(
      `SELECT r.*, s.name AS store_name
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE r.user_id = $1
       ORDER BY r.id DESC`,
      [user_id]
    );
    return result.rows;
  },

  async getReviewsByOwnerStores(ownerId) {
    const result = await pool.query(
      `SELECT r.id, r.rating, r.review AS comment, u.name AS "userName", s.name AS "storeName"
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       JOIN stores s ON s.id = r.store_id
       WHERE s.owner_id = $1
       ORDER BY r.created_at DESC`,
      [ownerId]
    );
    return result.rows;
  },
};
