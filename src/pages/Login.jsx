import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
    },
  },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.3 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const AuthDrawer = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Log-in and Sign-up
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [formData, setFormData] = useState({
    mobileNumber: "",
    otp: "",
    name: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateOtp = () => {
    if (formData.mobileNumber) {
      setOtpSent(true);
      alert("OTP sent to your mobile number!"); // Mock message
    } else {
      alert("Please enter your mobile number first.");
    }
  };

  const handleResendOtp = () => {
    alert("OTP resent to your mobile number!"); // Mock message
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-[9998] backdrop-blur-md"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-[9999] shadow-lg flex flex-col overflow-hidden"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {isSignUp ? "Sign-up" : "Log-in"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-8 relative">
              <p className="text-sm text-gray-600 mb-4">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <span
                      className="text-red-500 font-semibold cursor-pointer"
                      onClick={() => setIsSignUp(false)}
                    >
                      Log-in
                    </span>
                  </>
                ) : (
                  <>
                    Don’t have an account?{" "}
                    <span
                      className="text-red-500 font-semibold cursor-pointer"
                      onClick={() => setIsSignUp(true)}
                    >
                      Sign-up
                    </span>
                  </>
                )}
              </p>

              <form>
                {/* Mobile Number Field */}
                <div className="mb-4">
                  <label
                    htmlFor="mobile-number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number
                  </label>
                  <div className="flex items-center border rounded-lg px-4 py-2 mt-1 transition duration-300 focus-within:ring-2 focus-within:ring-red-500">
                    <span className="text-gray-500 pr-2 border-r">+44</span>
                    <input
                      id="mobile-number"
                      name="mobileNumber"
                      type="text"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="117 2345678"
                      className="flex-1 outline-none px-2 text-sm text-gray-800 bg-transparent focus:ring-0"
                    />
                  </div>
                </div>

                {/* OTP Logic in Login */}
                {!isSignUp && otpSent && (
                  <div className="mb-6">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enter OTP
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="Enter OTP"
                      className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 outline-none transition duration-300 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Haven’t received OTP?{" "}
                      <span
                        className="text-red-500 font-semibold cursor-pointer"
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </span>
                    </p>
                  </div>
                )}

                {/* Conditional Buttons */}
                {!isSignUp && !otpSent && (
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    className="w-full bg-primary  text-white py-3 rounded-lg text-sm font-medium transition duration-300 focus:ring-2 focus:ring-blue-500"
                  >
                    Generate OTP
                  </button>
                )}

                {!isSignUp && otpSent && (
                  <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-sm font-medium transition duration-300 focus:ring-2 focus:ring-red-500 mt-4"
                  >
                    Login
                  </button>
                )}

                {/* Conditional Fields for Sign-up */}
                {isSignUp && (
                  <>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 outline-none transition duration-300 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        E-mail Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@example.com"
                        className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 outline-none transition duration-300 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </>
                )}

                {/* Submit Button for Sign-up */}
                {isSignUp && (
                  <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-sm font-medium transition duration-300 focus:ring-2 focus:ring-red-500"
                  >
                    Sign-up
                  </button>
                )}
              </form>

              {/* SVG Image */}
              <div className="hidden lg:block absolute bottom-0 left-0">
                <img
                  src="/assets/login.png" // Replace with your SVG path
                  alt="Decorative SVG"
                  className="w-60 h-auto"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthDrawer;
