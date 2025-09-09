import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllRatings } from "../../src/services/ratingService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoresPage = () => {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getAllRatings();
        setRatings(data);
        toast.success("Ratings fetched successfully!");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch ratings.");
        toast.error("Failed to fetch ratings.");
      }
    };

    fetchRatings();
  }, []);

  // Group ratings by store id
  const ratingsByStore = ratings.reduce((acc, r) => {
    if (!acc[r.store_id]) {
      acc[r.store_id] = {
        store_id: r.store_id,
        store_name: r.store_name,
        ratings: [],
      };
    }
    acc[r.store_id].ratings.push(r);
    return acc;
  }, {});

  const stores = Object.values(ratingsByStore);

  // Apply filters
  const filteredStores = stores.filter((storeGroup) => {
    const avgRating =
      storeGroup.ratings.reduce((sum, r) => sum + r.rating, 0) /
      storeGroup.ratings.length;

    const nameMatch =
      !searchName ||
      storeGroup.store_name.toLowerCase().includes(searchName.toLowerCase());
    const ratingMatch =
      !filterName || Math.floor(avgRating) === Number(filterName);

    return nameMatch && ratingMatch;
  });

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 pt-24">
        <h2 className="text-3xl font-semibold mb-6">Available Stores</h2>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by store name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Filter by Rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} ⭐
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {filteredStores.length === 0 ? (
          <p className="text-gray-500">No stores found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => {
              const avgRating =
                store.ratings.reduce((sum, r) => sum + r.rating, 0) /
                store.ratings.length;

              return (
                <div
                  key={store.store_id}
                  className="border rounded-lg shadow-md p-6 bg-white hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {store.store_name}
                  </h3>

                  <p className="mt-3 flex items-center text-yellow-500 font-semibold text-lg">
                    <span className="mr-2 text-2xl">⭐</span>
                    <span>{avgRating.toFixed(1)} / 5</span>
                    <span className="ml-3 text-gray-500 text-sm font-normal">
                      ({store.ratings.length} reviews)
                    </span>
                  </p>

                  <div className="mt-5 space-y-4 max-h-64 overflow-y-auto">
                    {store.ratings.map((r) => (
                      <div key={r.id} className="border-t pt-3">
                        <p className="font-semibold text-gray-800">
                          {r.user_name || "Anonymous"}
                        </p>
                        <p className="text-yellow-500 font-semibold">
                          ⭐ {r.rating}
                        </p>
                        <p className="text-gray-700 italic mt-1">
                          {r.review || "No review provided."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresPage;
