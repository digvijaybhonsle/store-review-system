import express from "express";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import { authenticate } from "./src/middleware/auth.js";
import adminRoutes from "./src/routes/admin.js";
import userRoutes from "./src/routes/userRoutes.js";
import storeRoutes from "./src/routes/storeRoutes.js";
import ratingRoutes from "./src/routes/ratingRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world 🌍");
});


app.get("/api/protected", authenticate, (req, res) => {
    res.json({ message: `Hello ${req.user.email}, you are authorized!` });
});

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

app.listen(port, async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("DB test query:", result.rows[0]);
    } catch (err) {
        console.error("not reachable at startup:", err);
    }
    console.log(`App running on port ${port}`);
});
