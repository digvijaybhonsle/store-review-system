import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import StoresPage from "./pages/StoresPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import Profile from "./pages/Profile";
import UserDashboard from "./pages/UserDashboard";
import ForgotPassword from "./pages/ForgotPassword";

export default function AppRoutes() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}
