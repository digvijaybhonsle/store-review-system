/**
 * Require one or more roles to access route
 * @param {string|string[]} roles - role or array of roles
 */
export const requireRole = (roles = []) => {
  // Ensure roles is always an array
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized. No user info found",
      });
    }

    const userRole = req.user.role?.toLowerCase();
    const allowedRoles = roles.map((r) => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Forbidden. Insufficient permissions.",
      });
    }

    next();
  };
};

