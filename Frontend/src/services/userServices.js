const API_BASE = "http://localhost:3000/api/users";

// ✅ Get all users (admin only)
export const getUsers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch users");
  }

  return res.json();
};

// ✅ Create a new user (admin only)
export const createUser = async ({ name, email, password, address, role }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, password, address, role }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create user");
  }

  return res.json();
};

