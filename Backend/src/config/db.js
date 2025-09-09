import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "assignment",
    password: process.env.DB_PASSWORD || "12345",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

// Check connection
pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL database"))
    .catch((err) => {
        console.error("❌ DB connection error:", err);
        process.exit(1);
    });

export default pool;
