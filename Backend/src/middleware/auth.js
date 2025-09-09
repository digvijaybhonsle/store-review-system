import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Authenticate JWT token and attach user info to req.user
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

/**
 * Optional helper: Only allow a specific user or admin (e.g., update own profile)
 */
export const ownerOrAdmin = (paramIdName) => (req, res, next) => {
  const targetId = Number(req.params[paramIdName]);
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.id !== targetId && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
