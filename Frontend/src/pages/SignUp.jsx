import { useState } from "react";
import { signup } from "../../src/services/authService";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiUser, FiMail, FiHome, FiLock } from "react-icons/fi";

export default function SignUp() {
  const [role, setRole] = useState("USER"); // default role
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Validation functions
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(form.password)) {
      setError(
        "Password must be 8–16 characters, include at least one uppercase letter and one special character."
      );
      return;
    }

    try {
      const newUser = await signup({ ...form, role: role.toLowerCase() });
      alert("Signed Up Successfully!!");
      navigate("/signin");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  const roles = ["ADMIN", "USER", "STORE_OWNER"];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

        {/* Name */}
        <div className="relative mb-4">
          <FiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border pl-10 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border pl-10 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address */}
        <div className="relative mb-4">
          <FiHome className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="border pl-10 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.address}
            onChange={handleChange}
            required={role !== "USER"} // Address optional for USER
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="border pl-10 pr-10 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </span>
        </div>

        {/* Toggle buttons for roles */}
        <label className="block mb-2 text-gray-700 font-semibold text-sm">
          Select your role
        </label>
        <div className="flex w-full justify-between mb-6 gap-2">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded text-white font-medium transition-colors duration-200 ${
                role === r ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {r.replace("_", " ")}
            </button>
          ))}
        </div>

        <button className="bg-blue-600 text-white py-2 px-4 w-full rounded hover:bg-blue-700 mb-2">
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
