import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import AdminUsersPage from "../pages/AdminUsersPage";
import Header from "../components/Header";
import PrivateRoute from "../components/PrivateRoute";
import ForgotPasswordPage from "../pages/ResetPasswordPage";
import Footer from "../components/Footer";
import CategoryPage from "../pages/CategoryPage";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import ProductPage from "../pages/ProductPage";
import WarrantyPolicyPage from "../pages/WarrantyPolicyPage";
import StoreSystemPage from "../pages/StoreSystemPage";
import UserGuideProPage from "../pages/UserGuideProPage";
import MemberPolicyPage from "../pages/MemberPolicyPage";
import AboutPage from "../pages/AboutPage";
import ChatBox from "../components/ChatBox";

export default function AppRouter() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/warrant-policy" element={<WarrantyPolicyPage />} />
        <Route path="/store-system" element={<StoreSystemPage />} />
        <Route path="/user-guide-pro" element={<UserGuideProPage />} />
        <Route path="/member-policy" element={<MemberPolicyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminUsersPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}
