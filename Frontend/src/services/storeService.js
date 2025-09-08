// src/services/storeService.js

const API_BASE = "http://localhost:3000/api/stores";

// Get all stores
export const getStores = async () => {
  const res = await fetch(`${API_BASE}`);
  return res.json();
};

// Get stores owned by the logged-in owner
export const getStoresByOwner = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found. Please login.");

  const res = await fetch(`${API_BASE}/owner`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch owner stores");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};


// Create a new store (for owner/admin)
export const createStore = async (storeData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storeData),
  });
  return res.json();
};


export async function getReviewsForOwnerStores() {
  const res = await fetch(`${API_BASE}/owner`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch owner reviews");
  }

  return res.json();
}
