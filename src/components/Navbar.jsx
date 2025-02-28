import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiSearch,
  FiLogOut,
  FiMenu,
  FiX,
  FiShoppingCart,
} from "react-icons/fi"; // React Icons
import { motion } from "framer-motion"; // Import Framer Motion
import { useSelector, useDispatch } from "react-redux";
import Login from "../pages/Login";
import { logout } from "../redux/slices/authSlice";
import CustomPopup from "../components/CustomPopup";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
   // ✅ Get authentication state from Redux
   const { user, isAuthenticated } = useSelector((state) => state.auth);
  const toggleLoginDrawer = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    setIsLoginDrawerOpen(true);
  };

  const closeLoginDrawer = () => {
    setIsLoginDrawerOpen(false);
  };
  const cartItems = useSelector((state) => state.cart.items); // Fetch cart items from Redux store
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0); // Calculate total items in the cart
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
// ✅ Handle Logout
const handleLogout = () => {
  dispatch(logout());
  navigate("/"); // Redirect to home after logout
};
  return (
    <header className="bg-gray-50 relative z-[9999]">
      <div className="container mx-auto flex justify-between items-center px-2 py-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/Mask group.png" // Replace with your actual logo path
            alt="Logo"
            className="h-16 w-18"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/menu"
            className={`nav-link ${
              isActive("/menu") ? "border-b-2 border-primary text-primary" : ""
            }`}
          >
            View Menu
          </Link>
          <Link
            to="/info"
            className={`nav-link ${
              isActive("/info") ? "border-b-2 border-primary text-primary" : ""
            }`}
          >
            Restaurant Info
          </Link>
          <Link
            to="/about"
            className={`nav-link ${
              isActive("/about") ? "border-b-2 border-primary text-primary" : ""
            }`}
          >
            About Us
          </Link>
        </nav>

        {/* Desktop Cart & Login */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Cart Icon */}
           {/* Cart Icon with Badge */}
  <div className="relative flex items-center">
    <Link
      to="/cart"
      className="flex items-center justify-center rounded-full h-12 w-12  transition"
    >
      <img src="assets/cart.png" alt="Cart" className="w-12 h-12" />
    </Link>
    {totalItems > 0 && (
      <span className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
        {totalItems}
      </span>
    )}
  </div>


  {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/account"
                className="flex items-center space-x-2 border p-2 rounded-md hover:bg-gray-100 transition"
              >
                <FiUser className="text-primary" size={20} />
                <span className="text-sm font-medium">{user?.name || "Profile"}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 font-semibold hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="#login" onClick={toggleLoginDrawer} className="button-primary">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Search Icon */}
          <button className="flex items-center justify-center h-10 w-10 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition">
            <FiSearch size={20} />
          </button>

          {/* Hamburger Menu */}
          <button
            className="flex items-center justify-center h-10 w-10 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
  <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto">
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: "0%" }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3 }}
      className="h-full w-full px-6 py-8"
    >
      {/* Close Icon */}
      <div className="flex justify-end">
        <button
          onClick={closeMenu}
          className="flex items-center justify-center h-10 w-10 text-primary bg-red-100 border border-primary rounded-full hover:bg-gray-100 transition"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center space-y-2 border-b pb-4">
        {/* User Icon */}
        <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
          <FiUser size={30} className="text-gray-600" />
        </div>
        <span className="font-title text-base text-black">Suresh</span>
      </div>

      {/* Account Options */}
      <div className="flex flex-col border-gray-300 mt-6">
        {/* My Account */}
        <Link
          to="/account"
          className="flex font-link items-center py-3 w-full text-black hover:text-primary border-b border-gray-300 text-sm"
          onClick={closeMenu}
        >
          <FiUser size={20} className="text-black flex-shrink-0" />
          <div className="ml-4">
            <span className="font-medium text-black block text-sm">My Account</span>
            <span className="text-xs text-gray-500 block">
              Edit Name, Number
            </span>
          </div>
        </Link>

        {/* Address */}
        <Link
          to="/address"
          className="flex font-link items-center py-3 w-full text-black hover:text-primary border-b border-gray-300 text-sm"
          onClick={closeMenu}
        >
          <FiMapPin size={20} className="text-gray-600 flex-shrink-0" />
          <div className="ml-4">
            <span className="font-medium text-black block text-sm">Address</span>
            <span className="text-xs text-gray-500 block">
              Edit Address, Add Address
            </span>
          </div>
        </Link>

        {/* Order History */}
        <Link
          to="/orders"
          className="flex font-link items-center py-3 w-full text-black hover:text-primary text-sm"
          onClick={closeMenu}
        >
          <FiClock size={20} className="text-black flex-shrink-0" />
          <div className="ml-4">
            <span className="font-medium text-black block text-sm">
              Order History
            </span>
            <span className="text-xs text-gray-500 block">
              Re-order, Rate Orders
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="mt-6 flex justify-center items-center flex-col space-y-2">
        <Link
          to="/menu"
          className={`nav-link text-sm ${
            isActive("/menu")
              ? "border-b-2 border-primary text-primary"
              : ""
          }`}
          style={{fontSize: "16px"}}
          onClick={closeMenu}
        >
          View Menu
        </Link>
        <Link
          to="/info"
          className={`nav-link text-sm ${
            isActive("/info")
              ? "border-b-2 border-primary text-primary"
              : ""
          }`}
          style={{fontSize: "16px"}}

          onClick={closeMenu}
        >
          Restaurant Info
        </Link>
        <Link
          to="/about"
          className={`nav-link text-sm ${
            isActive("/about")
              ? "border-b-2 border-primary text-primary"
              : ""
          }`}
          style={{fontSize: "16px"}}

          onClick={closeMenu}
        >
          About Us
        </Link>
      </div>

      {/* Sign-Out Button */}
      <div className="mt-6">
      {isAuthenticated ? (
              <div className="flex flex-col items-center space-y-2 border-b pb-4">
                {/* User Icon */}
              
              
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 font-semibold hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={toggleLoginDrawer}
                  className="text-primary font-semibold text-lg"
                >
                  Login
                </button>
              </div>
            )}
      </div>
    </motion.div>
  </div>
)}

            <Login isOpen={isLoginDrawerOpen} onClose={closeLoginDrawer} />

    </header>
  );
};

export default Navbar;
