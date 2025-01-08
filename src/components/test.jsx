import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {FiUser,FiMapPin,FiClock, FiSearch,FiLogOut, FiMenu, FiX, FiShoppingCart } from 'react-icons/fi'; // React Icons for Cart, Search, etc.
import { motion } from 'framer-motion'; // Import Framer Motion

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/src/assets/Mask group.png" // Replace with your actual logo path
            alt="Logo"
            className="h-12 w-auto"
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
            className="flex items-center justify-center border border-primary rounded-full h-10 w-10 text-primary hover:text-black"
          >
            <FiShoppingCart size={20} />
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

{/* Mobile Menu */}
{isMenuOpen && (
<motion.div
  initial={{ opacity: 0, y: -20 }} // Start animation: hidden and shifted up
  animate={{ opacity: 1, y: 0 }} // End animation: visible and original position
  exit={{ opacity: 0, y: -20 }} // Exit animation: hidden and shifted up
  transition={{ duration: 0.3 }} // Animation duration
  className="absolute top-16 left-0 w-full bg-white shadow-lg z-10 p-6 md:hidden"
>
  {/* User Info */}
  <div className="flex flex-col items-center space-y-2 border-b pb-4">
{/* User Icon */}
<div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
  <FiUser size={35} className="text-gray-600" /> {/* User Icon */}
</div>
<span className="font-title text-lg text-black">Suresh</span>
</div>


  {/* Account Options */}
  <div className="flex flex-col  border-gray-300">
{/* My Account */}
<Link
  to="/account"
  className="flex font-link items-center py-4 w-full text-black hover:text-primary border-b border-gray-300"
>
  <FiUser size={24} className="text-black flex-shrink-0" /> {/* My Account Icon */}
  <div className="ml-4">
    <span className="font-medium text-black block">My Account</span>
    <span className="text-sm text-gray-500 block">Edit Name, Number</span>
  </div>
</Link>

{/* Address */}
<Link
  to="/address"
  className="flex font-link items-center py-4 w-full text-black hover:text-primary border-b border-gray-300"
>
  <FiMapPin size={24} className="text-gray-600 flex-shrink-0" /> {/* Address Icon */}
  <div className="ml-4">
    <span className="font-medium text-black block">Address</span>
    <span className="text-sm text-gray-500 block">Edit Address, Add Address</span>
  </div>
</Link>

{/* Order History */}
<Link
  to="/orders"
  className="flex font-link items-center py-4 w-full text-black hover:text-primary"
>
  <FiClock size={24} className="text-black flex-shrink-0" /> {/* Order History Icon */}
  <div className="ml-4">
    <span className="font-medium text-black block">Order History</span>
    <span className="text-sm text-gray-500 block">Re-order, Rate Orders</span>
  </div>
</Link>
</div>




  {/* Navigation Links */}
  <div className="mt-4 flex justify-center items-center flex-col space-y-4">
  <Link to="/menu" className="nav-link">
            View Menu
          </Link>
          <Link to="/info" className="nav-link">
            Restaurant Info
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
  </div>

  {/* Sign-Out Button */}
  <div className="mt-6">
    <button
      className="flex items-center justify-center w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition"
    >
      <FiLogOut className="mr-2" size={20} /> {/* Sign-Out Icon */}
      Sign-out
    </button>
  </div>
</motion.div>
)}



    </header>
  );
};

export default Navbar;
