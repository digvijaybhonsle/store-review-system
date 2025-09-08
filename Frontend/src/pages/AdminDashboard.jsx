import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getStores, createStore } from "../../src/services/storeService";
import { getAllRatings } from "../../src/services/ratingService";
import { getUsers, createUser } from "../../src/services/userServices";

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);

  // State for showing forms and form inputs
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const matchesRole = filterRole
      ? user.role.toLowerCase() === filterRole.toLowerCase()
      : true;
    return matchesName && matchesRole;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeData = await getStores();
        setStores(storeData);

        const ratingData = await getAllRatings();
        setRatings(ratingData);

        const userData = await getUsers();
        setUsers(userData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(2)
      : 0;
  const maxRating =
    ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating)) : 0;

  // Handlers for creating user and store
  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      alert("User created Successfully!!");
      setShowUserForm(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateStore = async () => {
    try {
      await createStore(newStore);
      const updatedStores = await getStores();
      setStores(updatedStores);
      setShowStoreForm(false);
      alert("Strore Created Successfully!!");
      setNewStore({
        name: "",
        email: "",
        address: "",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-10 pt-24">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Pento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* All Stores */}
          <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">All Stores</h3>
            <p className="text-2xl font-bold">{stores.length}</p>
          </div>

          {/* All Ratings */}
          <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">All Ratings</h3>
            <p className="text-2xl font-bold">{ratings.length}</p>
          </div>

          {/* Average Rating */}
          <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
            <p className="text-2xl font-bold">{avgRating} ⭐</p>
          </div>

          {/* Max Rating */}
          <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Max Rating</h3>
            <p className="text-2xl font-bold">{maxRating} ⭐</p>
          </div>

          {/* Add User */}
          <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between col-span-2">
            <h3 className="text-lg font-semibold mb-2">Add User</h3>
            <button
              className="mt-auto px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowUserForm(true)} // Only controls user form visibility
            >
              Add
            </button>
            {showUserForm && ( // Conditional rendering only for user form
              <div className="mt-4 space-y-2">
                {/* user form inputs */}
                <input
                  placeholder="Name"
                  className="block w-full border rounded px-2 py-1"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <input
                  placeholder="Email"
                  className="block w-full border rounded px-2 py-1"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <input
                  placeholder="Password"
                  type="password"
                  className="block w-full border rounded px-2 py-1"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                <input
                  placeholder="Address"
                  className="block w-full border rounded px-2 py-1"
                  value={newUser.address}
                  onChange={(e) =>
                    setNewUser({ ...newUser, address: e.target.value })
                  }
                />
                <select
                  className="block w-full border rounded px-2 py-1"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="normal">Owner</option>
                </select>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={handleCreateUser} // only creates user
                  >
                    Create
                  </button>
                  <button
                    className="flex-1 px-3 py-1 bg-gray-400 text-white rounded"
                    onClick={() => setShowUserForm(false)} // hides user form
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Store */}
          <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between col-span-2">
            <h3 className="text-lg font-semibold mb-2">Add Store</h3>
            <button
              className="mt-auto px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => setShowStoreForm(true)} // only controls store form visibility
            >
              Add
            </button>
            {showStoreForm && ( // Conditional rendering only for store form
              <div className="mt-4 space-y-2">
                {/* store form inputs */}
                <input
                  placeholder="Store Name"
                  className="block w-full border rounded px-2 py-1"
                  value={newStore.name}
                  onChange={(e) =>
                    setNewStore({ ...newStore, name: e.target.value })
                  }
                />
                <input
                  placeholder="Store Email"
                  className="block w-full border rounded px-2 py-1"
                  value={newStore.email}
                  onChange={(e) =>
                    setNewStore({ ...newStore, email: e.target.value })
                  }
                />
                <input
                  placeholder="Address"
                  className="block w-full border rounded px-2 py-1"
                  value={newStore.address}
                  onChange={(e) =>
                    setNewStore({ ...newStore, address: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-1 bg-green-600 text-white rounded"
                    onClick={handleCreateStore} // only creates store
                  >
                    Create
                  </button>
                  <button
                    className="flex-1 px-3 py-1 bg-gray-400 text-white rounded"
                    onClick={() => setShowStoreForm(false)} // hides store form
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Users Listing Section */}
        <div className="mt-10 bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800">
            All Users
          </h3>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Filter by name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store_owner</option>
            </select>
          </div>

          {/* Users List */}
          <ul className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user._id || user.id}
                  className="py-3 flex justify-between items-center hover:bg-gray-50 rounded px-3 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                    {user.role.toUpperCase()}
                  </span>
                </li>
              ))
            ) : (
              <li className="py-3 text-center text-gray-400 italic">
                No users found.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
