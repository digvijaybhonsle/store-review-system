// Frontend/src/services/authService.js
const API_URL = "http://localhost:3000/api/auth";

/**
 * Login user
 * @param {Object} param0
 * @param {string} param0.email
 * @param {string} param0.password
 */
export const login = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();
  // Save token to localStorage for auth
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data; 
};

/**
 * Signup user
 * @param {Object} param0
 * @param {string} param0.name
 * @param {string} param0.email
 * @param {string} param0.password
 * @param {string} param0.address
 * @param {string} [param0.role] - optional: "normal", "store_owner", "admin"
 */
export const signup = async ({ name, email, password, address, role = "USER" }) => {
  // Map frontend role to URL segment
  let rolePath = "user";
  if (role.toLowerCase() === "store_owner") rolePath = "store-owner";
  else if (role.toLowerCase() === "admin") rolePath = "admin";

  const res = await fetch(`http://localhost:3000/api/auth/signup/${rolePath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, address }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Signup failed");
  }

  const data = await res.json();
  return data;
};


/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const updatePassword = async ({ email, currentPassword, newPassword }) => {
  const res = await fetch(`${API_URL}/update-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, currentPassword, newPassword }),
  });

  if (!res.ok) {
    let errorMsg = "Failed to update password";
    try {
      const error = await res.json();
      errorMsg = error.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
};

