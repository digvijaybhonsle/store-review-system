import pool from "../config/db.js";

export const UserModel = {
  async createUser({ name, email, password, address, role = "normal" }) {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, email, password, address, role]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    // ✅ fixed naming
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  async findById(id) {
    // ✅ fixed naming
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  },

  async updatePassword(userId, newHashedPassword) {
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
      [newHashedPassword, userId]
    );
    return result.rows[0];
  },
};
