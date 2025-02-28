import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { signup, login, signupVerify, verifyOtp } from "../redux/slices/authSlice";

const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.3 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const AuthDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [isSignUp, setIsSignUp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    otp: ["", "", "", ""],
    name: "",
    email: "",
  });

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (otpSent) {
      otpRefs[0].current.focus();
    }
  }, [otpSent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; 

    let newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleGenerateOtp = () => {
    if (!formData.mobileNumber) return alert("Please enter your mobile number.");

    if (isSignUp) {
      dispatch(signup({ name: formData.name, email: formData.email, mobile: formData.mobileNumber })).then((res) => {
        if (res.payload) setOtpSent(true);
      });
    } else {
      dispatch(login({ mobile: formData.mobileNumber })).then((res) => {
        if (res.payload) setOtpSent(true);
      });
    }
  };

  const handleVerifyOtp = () => {
    const otpString = formData.otp.join("");
    if (otpString.length === 4) {
      if (isSignUp) {
        dispatch(signupVerify({ mobile: formData.mobileNumber, otp: otpString }));
      } else {
        dispatch(verifyOtp({ mobile: formData.mobileNumber, otp: otpString }));
      }
    } else {
      alert("Please enter the full OTP.");
    }
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
                {isSignUp ? "Sign-up" : otpSent ? "Verify OTP" : "Log-in"}
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
              {!otpSent ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    {isSignUp ? (
                      <>Already have an account? <span className="text-red-500 font-semibold cursor-pointer" onClick={() => setIsSignUp(false)}>Log-in</span></>
                    ) : (
                      <>Don’t have an account? <span className="text-red-500 font-semibold cursor-pointer" onClick={() => setIsSignUp(true)}>Sign-up</span></>
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
                   

                    {/* Sign-up Fields */}
                    {isSignUp && (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your Name"
                            className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 outline-none transition duration-300 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                          <input
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

                    {/* Buttons */}
                    <button
                      type="button"
                      onClick={handleGenerateOtp}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-sm font-medium transition duration-300 focus:ring-2 focus:ring-red-500"
                    >
                      {isLoading ? "Processing..." : isSignUp ? "Sign-up" : "Generate OTP"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
                    Enter OTP
                  </h3>
                  <div className="flex justify-center space-x-3 mb-6">
                    {formData.otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        ref={otpRefs[index]}
                        maxLength="1"
                        className="w-12 h-12 text-xl text-center border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-sm font-medium transition duration-300 focus:ring-2 focus:ring-red-500"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

              {/* Decorative Image */}
              <div className="hidden lg:block absolute bottom-0 left-0">
                <img src="/assets/login.png" alt="Decorative SVG" className="w-60 h-auto" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthDrawer;
