import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getStoresByOwner, createStore } from "../../src/services/storeService";
import { getReviewsForOwnerStores } from "../../src/services/ratingService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [newStore, setNewStore] = useState({ name: "", address: "", email: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch stores & reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storesData = await getStoresByOwner();
        setStores(storesData);

        const reviewsData = await getReviewsForOwnerStores();
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch owner data.");
        toast.error("Failed to fetch owner data.");
      }
    };
    fetchData();
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (!newStore.name || !newStore.address || !newStore.email) {
      setError("Please fill all fields.");
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const store = await createStore(newStore);
      setStores([...stores, store]);
      setNewStore({ name: "", address: "", email: "" });
      setError("");
      toast.success("Store added successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create store.");
      toast.error(err.message || "Failed to create store.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 lg:ml-12">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">
          Welcome {user ? user.name : "Guest"}!
        </h2>

        {/* Add New Store */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">Add New Store</h3>
          <form
            onSubmit={handleAddStore}
            className="space-y-4 p-6 border rounded-lg shadow-md bg-white"
          >
            <input
              type="text"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Store
            </button>
          </form>
        </div>

        {/* My Stores */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">My Stores</h3>
          {stores.length === 0 ? (
            <p className="text-gray-500">You have not added any stores yet.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <li
                  key={store.id}
                  className="border rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{store.name}</h4>
                  <p className="text-gray-600 mb-1">📍 {store.address}</p>
                  <p className="text-gray-500 text-sm mb-3">✉️ {store.email}</p>
                  {store.avg_rating ? (
                    <p className="mt-2 text-yellow-500 font-medium">
                      ⭐ {store.avg_rating.toFixed(1)} / 5
                    </p>
                  ) : (
                    <p className="mt-2 text-gray-400 italic">No ratings yet</p>
                  )}

                  <div className="mt-4 flex space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      View
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reviews on My Stores */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Reviews on My Stores</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition"
                >
                  <p className="font-medium">{review.userName || "Anonymous"}</p>
                  <p className="text-yellow-500 font-semibold">⭐ {review.rating} / 5</p>
                  <p className="text-gray-700 italic mt-1">{review.comment || "No comment"}</p>
                  <p className="text-sm text-gray-400 mt-1">Store: {review.storeName}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
