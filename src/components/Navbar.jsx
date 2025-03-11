import React, { useState,useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiSearch,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiChevronRight,
  FiX,
  FiShoppingCart,
} from "react-icons/fi"; // React Icons
import { motion } from "framer-motion"; // Import Framer Motion
import { useSelector, useDispatch } from "react-redux";
import Login from "../pages/Login";
import { logout,getProfile } from "../redux/slices/authSlice";
import CustomPopup from "../components/CustomPopup";
import { clearCart } from "../redux/slices/cartSlice";
import ProfileDrawer from "../components/Profile/ProfileDrawer";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
console.log("isAuthenticated", isAuthenticated);
  const closeLoginDrawer = () => {
    setIsLoginDrawerOpen(false);
  };
  const cartItems = useSelector((state) => state.cart.items); // Fetch cart items from Redux store
  const totalItems = useSelector((state) => state.cart.totalItems) || 0; 
  console.log("totalItems", totalItems);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
// ✅ Handle Logout

 const handleLogout = () => {
   dispatch(logout());  // ✅ Clear authentication state
   dispatch(clearCart()); // ✅ Clear cart data
   onClose(); 
   navigate("/"); // ✅ Redirect to home page
 };
useEffect(() => {
  if (isAuthenticated && !user) {
    dispatch(getProfile()); // ✅ Fetch profile if authenticated but no user data
  }
}, [isAuthenticated, user, dispatch]);
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
          {/* <Link
            to="/menu"
            className={`nav-link ${
              isActive("/menu") ? "border-b-2 border-primary text-primary" : ""
            }`}
          >
            View Menu
          </Link> */}
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
      to="/checkout"
      className="flex items-center justify-center rounded-full h-12 w-12  transition"
    >
      <img src="assets/cart.png" alt="Cart" className="w-12 h-12" />
    </Link>
    {cartItems.length > 0 && (
      <span className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
        {cartItems.length}
      </span>
    )}
  </div>


  {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div
                onClick={() => setIsProfileOpen(true)} 
                className="flex items-center space-x-2 cursor-pointer border p-2 rounded-md hover:bg-gray-100 transition"
              >
                <FiUser className="text-primary" size={20} />
                <span className="text-sm font-medium">{user?.name || ""}</span>
              </div>
             
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
          {/* <button className="flex items-center justify-center h-10 w-10 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition">
            <FiSearch size={20} />
          </button> */}

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
      {isAuthenticated ?   <div onClick={() => setIsProfileOpen(true)} className="flex flex-col items-center space-y-2 border-b pb-4">
        {/* User Icon */}
        <div  className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
          <FiUser size={30} className="text-gray-600" />
        </div>
        <span className="text-sm font-medium">{user?.name || ""}</span>
 {/* View Profile Label with Bottom Dashed Border */}
 <div className="flex items-center">
        <span className="text-xs border-b-2 border-primary font-medium text-gray-600">View Profile</span>
        <FiChevronRight className="text-gray-500" size={14} />

        {/* Fix: Centered Bottom Border */}
      </div>       </div>:  <div  onClick={toggleLoginDrawer} className="flex flex-col items-center space-y-2 border-b pb-4">
        {/* User Icon */}
        <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
          <FiLogIn size={30} className="text-gray-600" />
        </div>
        <span className="text-sm font-medium">Login</span>
        </div>}
     


      {/* Navigation Links */}
      <div className="mt-6 flex justify-center items-center flex-col space-y-2">
        {/* <Link
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
        </Link> */}
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
{isAuthenticated ?  <Link
          to="#"
          className={`nav-link text-sm ${
            isActive("/about")
              ? "border-b-2 border-primary text-primary"
              : ""
          }`}
          style={{fontSize: "16px"}}

          onClick={handleLogout}
        >
          Signout
        </Link>: false}
      </div>
     
    </motion.div>
  </div>
)}

            <Login  isOpen={isLoginDrawerOpen} onClose={closeLoginDrawer} />
            <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />


    </header>
  );
};

export default Navbar;
