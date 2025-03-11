import React, { useRef, useEffect,useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Link,useLocation } from "react-router-dom";
import { getCart,setBottomBarVisible } from "../../redux/slices/cartSlice"; // ✅ Import getCart

const waveAnimation = {
  hidden: {
    y: "100%", // Start from below the screen
    opacity: 0,
    borderRadius: "100% 100% 0% 0%",
    transition: {
      duration: 0.5,
    },
  },
  visible: {
    y: 0, // Moves to its final position
    opacity: 1,
    borderRadius: "20px 20px 0 0", // Smoothly changes to rounded top
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      delay: 0.2,
    },
  },
  exit: {
    y: "100%", // Moves out of the screen
    opacity: 0,
    borderRadius: "100% 100% 0% 0%", // Reverts to a wave-like shape
    transition: {
      duration: 0.5,
    },
  },
};

const BottomCartBar = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get current route
  const cartItems = useSelector((state) => state.cart.items);
  const isLoading = useSelector((state) => state.cart.isLoading);
  const totalAmount = useSelector((state) => state.cart.totalAmount) || 0; // ✅ Get total from API response
  const isVisible = useSelector((state) => state.cart.isBottomBarVisible); // ✅ Get visibility from Redux


console.log("totalAmount bar", totalAmount);
  useEffect(() => {
    dispatch(getCart()); // ✅ Fetch cart items when component mounts
  }, []);
// ✅ Prevent bar from closing when route changes
// Only triggers when the route changes

  console.log("cartItems bar", cartItems);
  

  const discountThreshold = 16; // Minimum total for discount
  const amountNeeded = Math.max(0, discountThreshold - totalAmount);

  const containerRef = useRef(null);

  

  if (!isVisible || location.pathname === "/checkout") return null;


  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-50 bg-green-700 text-white shadow-2xl"
      variants={waveAnimation}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Top Black Section */}
      <div className="bg-black text-white rounded-t-lg px-4 py-2 text-center lg:text-left lg:px-8">
        <p className="font-Montserrat_Alternates text-xs sm:text-sm lg:text-lg font-semibold">
          {amountNeeded > 0
            ? `Add £${amountNeeded.toFixed(2)} more for a 10% discount`
            : "You're eligible for a 10% discount!"}
        </p>
      </div>

      {/* Bottom Green Section */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
        {/* Items Count Button */}
        <Link  to="/checkout" className="flex font-Montserrat_Alternates items-center justify-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-3 rounded-lg font-bold text-xs sm:text-sm lg:text-lg">
        {cartItems.length} Item{cartItems.length !== 1 ? "s" : ""}
        </Link>

        {/* Cart Details */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <Link  to="/checkout" className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            <img
              src="assets/Vector.png" // Replace with the correct path to your cart icon
              alt="Cart Icon"
              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
            />
            <span className="font-montserrat font-semibold text-xs sm:text-sm lg:text-lg">
              View Cart
            </span>
          </Link>
          <div className="h-4 sm:h-6 lg:h-8 w-[2px] bg-white opacity-70"></div>
          <span className="font-bold text-sm sm:text-lg lg:text-xl">
          £{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Close Button */}
        <button
         onClick={() => dispatch(setBottomBarVisible(false))}
          className="text-white px-3 py-2 rounded-lg font-bold text-xs sm:text-sm lg:text-lg flex items-center justify-center"
        >
          <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default BottomCartBar;
