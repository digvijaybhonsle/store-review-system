import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getStores } from "../../src/services/storeService";
import { getUserRatings, createRating } from "../../src/services/ratingService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

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
        toast.error("Failed to fetch stores");
      }
    };
    fetchStores();
  }, []);

  // Fetch user reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!isNormalUser) return;
      try {
        const data = await getUserRatings(user.id);
        setReviews(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch your reviews");
      }
    };
    if (token) fetchReviews();
  }, [user.id, token, isNormalUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNormalUser) {
      toast.error("Only normal users can post reviews.");
      return;
    }

    if (!selectedStore || !reviewText.trim() || rating < 1 || rating > 5) {
      toast.warn("Please select a store, write a review, and provide a rating between 1–5.");
      return;
    }

    try {
      await createRating({
        store_id: selectedStore,
        rating,
        review: reviewText.trim(),
      });

      toast.success("Review submitted successfully!");

      setReviewText("");
      setRating(5);

      const updatedReviews = await getUserRatings(user.id);
      setReviews(updatedReviews);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit review.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 pt-24">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">
          Welcome, {user.name}
        </h2>

        {/* Submit Review */}
        {isNormalUser ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">Submit a Review</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <select
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
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

              <label className="text-lg font-semibold">Rate the store</label>
              {/* Rating Stars */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-2xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-gray-600">{rating}/5</span>
              </div>

              <textarea
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400"
                rows={4}
                required
              />

              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                Submit Review
              </button>
            </form>
          </div>
        ) : (
          <p className="text-gray-500 mb-6 italic">
            Only normal users can post reviews.
          </p>
        )}

        {/* User Reviews */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">My Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-400 italic">
              {isNormalUser ? "You haven’t written any reviews yet." : "Only normal users have reviews."}
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="border p-4 rounded-lg hover:shadow transition flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold text-blue-600">{r.store_name}</p>
                    <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
                    <p className="text-gray-700 mt-1">{r.review}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {r.rating} / 5
                  </span>
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
