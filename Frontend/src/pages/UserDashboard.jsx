import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getStores } from "../../src/services/storeService";
import { getUserRatings, createRating } from "../../src/services/ratingService";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const isNormalUser = user.role.toLowerCase() === "user";

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data);
        if (data.length > 0) setSelectedStore(data[0].id);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch stores");
      }
    };
    fetchStores();
  }, []);

  // Fetch user reviews only for normal users
  useEffect(() => {
    const fetchReviews = async () => {
      if (!isNormalUser) return;
      try {
        const data = await getUserRatings(user.id);
        setReviews(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your reviews. Only normal users have reviews.");
      }
    };
    if (token) fetchReviews();
  }, [user.id, token, isNormalUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNormalUser) {
      setError("Only normal users can post reviews.");
      return;
    }

    if (!selectedStore || !reviewText.trim() || rating < 1 || rating > 5) {
      setError("Please select a store, write a review, and provide a rating between 1-5.");
      return;
    }

    try {
      await createRating({
        store_id: selectedStore,
        rating,
        review: reviewText.trim(),
      });

      setError("");
      setReviewText("");
      setRating(5);

      // Refresh reviews
      const updatedReviews = await getUserRatings(user.id);
      setReviews(updatedReviews);
    } catch (err) {
      console.error(err);
      if (err.message.toLowerCase().includes("forbidden")) {
        setError("Only normal users can post reviews.");
      } else {
        setError(err.message || "Failed to submit review.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 pt-24">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">Welcome, {user.name}</h2>

        {/* Submit Review */}
        {isNormalUser ? (
          <div className="bg-white shadow-md rounded p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Submit a Review</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <select
                className="border p-2 rounded"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                required
              >
                {stores.length === 0 ? (
                  <option value="">No stores available</option>
                ) : (
                  stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))
                )}
              </select>

              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border p-2 rounded w-24"
                required
              />

              <textarea
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="border px-2 py-2 rounded w-full"
                rows={4}
                required
              />

              <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Submit Review
              </button>
            </form>
          </div>
        ) : (
          <p className="text-gray-500 mb-6">
            Only normal users can post reviews.
          </p>
        )}

        {/* User Reviews */}
        <div className="bg-white shadow-md rounded p-6">
          <h3 className="text-xl font-semibold mb-4">My Reviews</h3>
          {reviews.length === 0 ? (
            <p>{isNormalUser ? "No reviews yet." : "Only normal users have reviews."}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="border p-3 rounded flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold">{r.store_name}</p>
                    <p>Rating: {r.rating} ⭐</p>
                    <p>{r.review}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
