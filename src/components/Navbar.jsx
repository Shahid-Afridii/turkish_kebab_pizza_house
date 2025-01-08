import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiSearch,
  FiLogOut,
  FiMenu,
  FiX,
  FiShoppingCart,
} from 'react-icons/fi'; // React Icons for Cart, Search, etc.
import { motion } from 'framer-motion'; // Import Framer Motion

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white  relative z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/src/assets/Mask group.png" // Replace with your actual logo path
            alt="Logo"
            className="h-16 w-18"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/menu" className="nav-link">
            View Menu
          </Link>
          <Link to="/info" className="nav-link">
            Restaurant Info
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
        </nav>

        {/* Desktop Cart & Login */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Cart Icon */}
          <Link
  to="/cart"
  className="flex items-center justify-center  rounded-full h-10 w-12  hover:text-black"
>
  <img
    src="/src/assets/cart.png" // Replace with your image path
    alt="Cart"
   
  />
</Link>

          {/* Login Button */}
          <Link to="/login" className="button-primary">
            Login
          </Link>
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
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
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
                <FiUser size={35} className="text-gray-600" />
              </div>
              <span className="font-title text-lg text-black">Suresh</span>
            </div>

            {/* Account Options */}
            <div className="flex flex-col border-gray-300 mt-6">
              {/* My Account */}
              <Link
                to="/account"
                className="flex font-link items-center py-4 w-full text-black hover:text-primary border-b border-gray-300"
                onClick={closeMenu}
              >
                <FiUser size={24} className="text-black flex-shrink-0" />
                <div className="ml-4">
                  <span className="font-medium text-black block">My Account</span>
                  <span className="text-sm text-gray-500 block">Edit Name, Number</span>
                </div>
              </Link>

              {/* Address */}
              <Link
                to="/address"
                className="flex font-link items-center py-4 w-full text-black hover:text-primary border-b border-gray-300"
                onClick={closeMenu}
              >
                <FiMapPin size={24} className="text-gray-600 flex-shrink-0" />
                <div className="ml-4">
                  <span className="font-medium text-black block">Address</span>
                  <span className="text-sm text-gray-500 block">Edit Address, Add Address</span>
                </div>
              </Link>

              {/* Order History */}
              <Link
                to="/orders"
                className="flex font-link items-center py-4 w-full text-black hover:text-primary"
                onClick={closeMenu}
              >
                <FiClock size={24} className="text-black flex-shrink-0" />
                <div className="ml-4">
                  <span className="font-medium text-black block">Order History</span>
                  <span className="text-sm text-gray-500 block">Re-order, Rate Orders</span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="mt-6 flex justify-center items-center flex-col space-y-4">
              <Link to="/menu" className="nav-link" onClick={closeMenu}>
                View Menu
              </Link>
              <Link to="/info" className="nav-link" onClick={closeMenu}>
                Restaurant Info
              </Link>
              <Link to="/about" className="nav-link" onClick={closeMenu}>
                About Us
              </Link>
            </div>

            {/* Sign-Out Button */}
            <div className="mt-6">
              <button
                className="flex items-center justify-center w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition"
                onClick={closeMenu}
              >
                <FiLogOut className="mr-2" size={20} />
                Sign-out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
