const API_URL = "http://localhost:3000/api/ratings";

// ✅ Create a rating (user_id comes from JWT, not frontend)
export const createRating = async ({ store_id, rating, review }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // backend extracts user_id
    },
    body: JSON.stringify({ store_id, rating, review }),
  });

  if (!res.ok) {
    let errorMsg = "Failed to create rating";
    try {
      const error = await res.json();
      errorMsg = error.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
};

// ✅ Get all ratings (admin/manager)
export const getAllRatings = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMsg = "Failed to fetch ratings";
    try {
      const error = await res.json();
      errorMsg = error.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
};

// ✅ Get rating by ID
export const getRatingById = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMsg = "Failed to fetch rating";
    try {
      const error = await res.json();
      errorMsg = error.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
};

// ✅ Get ratings by User
export const getUserRatings = async (user_id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(`${API_URL}/user/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMsg = "Failed to fetch user ratings";
    try {
      const error = await res.json();
      errorMsg = error.error || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
};

// ✅ Get reviews for stores owned by the logged-in owner
export const getReviewsForOwnerStores = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(`${API_URL}/owner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let errorMsg = "Failed to fetch reviews for your stores";
    try {
      const error = await res.json();
      errorMsg = error.error || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
};
