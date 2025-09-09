import { useState } from "react";
import { login } from "../../src/services/authService";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible, AiOutlineMail, AiOutlineLock } from "react-icons/ai";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ Password validation (8–16 chars, 1 uppercase, 1 special char)
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be 8–16 characters, include at least one uppercase letter and one special character."
      );
      return;
    }

    try {
      const { user } = await login({ email, password });
      alert("Signed in Successfully!!");

      switch (user.role.toLowerCase()) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "store_owner":
          navigate("/owner/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
    } catch (err) {
      if (err.message.includes("Invalid credentials")) {
        setError("Incorrect email or password.");
      } else {
        setError(err.message || "Login failed. Please try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-lg w-full max-w-md flex flex-col rounded-2xl border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Sign In
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
        )}

        {/* Email Input with Icon */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <AiOutlineMail className="absolute left-3 top-10 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Enter your email"
            className="border pl-10 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input with Icon & Toggle */}
        <div className="mb-2 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <AiOutlineLock className="absolute left-3 top-10 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="border pl-10 pr-10 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute top-12 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </span>
        </div>

        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:underline mb-4 self-end"
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 w-full rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
