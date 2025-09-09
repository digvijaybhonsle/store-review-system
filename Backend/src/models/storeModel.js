import pool from "../config/db.js";

export const StoreModel = {
  async createStore({ name, email, address, owner_id }) {
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, address, owner_id]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query("SELECT * FROM stores ORDER BY id ASC");
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM stores WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async findByOwner(ownerId) {
    const result = await pool.query(
      "SELECT * FROM stores WHERE owner_id = $1",
      [ownerId]
    );
    return result.rows;
  }
};
