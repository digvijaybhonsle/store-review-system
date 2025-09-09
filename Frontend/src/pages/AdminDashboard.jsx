import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getStores, createStore } from "../../src/services/storeService";
import { getAllRatings } from "../../src/services/ratingService";
import { getUsers, createUser } from "../../src/services/userServices";
import { toast } from "react-toastify"; // ✅ use toast for notifications
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);

  // UI States
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      try {
        const [storeData, ratingData, userData] = await Promise.all([
          getStores(),
          getAllRatings(),
          getUsers(),
        ]);
        setStores(storeData);
        setRatings(ratingData);
        setUsers(userData);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
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

  // ✅ Validation helpers
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    password.length >= 6;

  const handleCreateUser = async () => {
    if (!newUser.name || !validateEmail(newUser.email)) {
      toast.warning("Enter valid name and email");
      return;
    }
    if (!validatePassword(newUser.password)) {
      toast.warning("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      await createUser(newUser);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      toast.success("User created successfully!");
      setShowUserForm(false);
      setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async () => {
    if (!newStore.name || !validateEmail(newStore.email)) {
      toast.warning("Enter valid store name and email");
      return;
    }
    try {
      setLoading(true);
      await createStore(newStore);
      const updatedStores = await getStores();
      setStores(updatedStores);
      toast.success("Store created successfully!");
      setShowStoreForm(false);
      setNewStore({ name: "", email: "", address: "" });
    } catch (err) {
      toast.error(err.message || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-10 pt-24">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { label: "All Stores", value: stores.length },
            { label: "All Ratings", value: ratings.length },
            { label: "Average Rating", value: `${avgRating} ⭐` },
            { label: "Max Rating", value: `${maxRating} ⭐` },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add User & Store */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Add User */}
          <div className="p-4 bg-white rounded-lg shadow flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Add User</h3>
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowUserForm((prev) => !prev)}
            >
              {showUserForm ? "Close Form" : "Add"}
            </button>
            {showUserForm && (
              <div className="mt-4 space-y-2">
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
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  disabled={loading}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                  onClick={handleCreateUser}
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            )}
          </div>

          {/* Add Store */}
          <div className="p-4 bg-white rounded-lg shadow flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Add Store</h3>
            <button
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => setShowStoreForm((prev) => !prev)}
            >
              {showStoreForm ? "Close Form" : "Add"}
            </button>
            {showStoreForm && (
              <div className="mt-4 space-y-2">
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
                <button
                  disabled={loading}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                  onClick={handleCreateStore}
                >
                  {loading ? "Creating..." : "Create Store"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="my-10 bg-white shadow rounded-lg p-6">
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
              className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

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
                    {user.role}
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
