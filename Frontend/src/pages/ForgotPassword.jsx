import React, { useState } from "react";
import { updatePassword } from "../services/authService";
import { Eye, EyeOff, Lock, Mail } from "lucide-react"; // 👈 lucide-react icons

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and Confirm password do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      const response = await updatePassword({
        email,
        currentPassword,
        newPassword,
      });
      setSuccess(response.message || "Password updated successfully");
    } catch (err) {
      console.error("Complete error:", err);
      setError(err.message || "Failed to update password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Update Your Password
      </h2>
      <p className="text-center text-gray-500 text-sm mt-2">
        Enter your email and current password to securely update your account
        password.
      </p>

      {error && (
        <p className="text-red-600 mt-4 p-2 bg-red-100 rounded text-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 mt-4 p-2 bg-green-100 rounded text-sm">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none text-gray-700"
              required
            />
          </div>
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full outline-none text-gray-700"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full outline-none text-gray-700"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Must be at least 6 characters.
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full outline-none text-gray-700"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
