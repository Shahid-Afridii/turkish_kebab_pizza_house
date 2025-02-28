import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { signup, login, signupVerify, verifyOtp } from "../redux/slices/authSlice";
import CustomPopup from "../components/CustomPopup";

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
 // State for custom popup
 const [isPopupOpen, setPopupOpen] = useState(false);
 const [popupConfig, setPopupConfig] = useState({});


 const openPopup = (config) => {
  setPopupConfig(config);
  setPopupOpen(true);
};

// Update the closePopup function to handle redirection
const closePopup = () => {
  setPopupOpen(false);
  if (popupConfig.redirectOnClose) {
    router.push(popupConfig.redirectOnClose);
  }
};

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
 // Reset form fields when the modal opens
 useEffect(() => {
  if (isOpen) {
    setFormData({
      mobileNumber: "",
      otp: ["", "", "", ""],
      name: "",
      email: "",
    });
    setOtpSent(false);
  }
}, [isOpen]);
  useEffect(() => {
    if (otpSent) {
      otpRefs[0].current.focus();
    }
  }, [otpSent]);
 // ✅ Validate Fields
 const validateFields = () => {
  if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
    openPopup({
      type: "error",
      title: "Invalid Mobile Number",
      subText: "Please enter a valid 10-digit mobile number.",
      onClose: closePopup,
      autoClose: 2,
      showConfirmButton: false,
      showCancelButton: false,
    });
    return false;
  }

  if (isSignUp) {
    if (!formData.name.trim()) {
      openPopup({
        type: "error",
        title: "Name Required",
        subText: "Please enter your full name.",
        onClose: closePopup,
        autoClose: 2,
        showConfirmButton: false,
        showCancelButton: false,
      });
      return false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      openPopup({
        type: "error",
        title: "Invalid Email",
        subText: "Please enter a valid email address.",
        onClose: closePopup,
        autoClose: 2,
        showConfirmButton: false,
        showCancelButton: false,
      });
      return false;
    }
  }

  return true;
};
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
    if (!validateFields()) return;
  
    const action = isSignUp
      ? signup({ name: formData.name, email: formData.email, mobile: formData.mobileNumber })
      : login({ mobile: formData.mobileNumber });
  
    dispatch(action).then((res) => {
      if (res.payload?.status) {
        setOtpSent(true);
        openPopup({
          type: "success",
          title: "OTP Sent!",
          subText: "Please enter the OTP sent to your mobile number.",
          onClose: closePopup,
          autoClose: 2,
          showConfirmButton: false,
          showCancelButton: false,
        });
      } else {
        openPopup({
          type: "error",
          title: "Error!",
          subText: res.payload || "Failed to send OTP. Try again.",
          onClose: closePopup,
          autoClose: 2,
          showConfirmButton: false,
        showCancelButton: false,
        });
      }
    });
  };
  
  const handleVerifyOtp = () => {
    const otpString = formData.otp.join("");
    if (otpString.length !== 4) {
      return openPopup({
        type: "error",
        title: "Invalid OTP",
        subText: "Please enter the full OTP.",
        onClose: closePopup,
        autoClose: 2,
        showConfirmButton: false,
        showCancelButton: false,
      });
    }
  
    const action = isSignUp
      ? signupVerify({ mobile: formData.mobileNumber, otp: otpString })
      : verifyOtp({ mobile: formData.mobileNumber, otp: otpString });
  
    dispatch(action).then((res) => {
      if (res.payload?.status) {
        onClose();
        setOtpSent(false);
        setFormData({ mobileNumber: "", otp: ["", "", "", ""], name: "", email: "" });
        navigate("/");
      } else {
        openPopup({
          type: "error",
          title: "Invalid OTP!",
          subText: res.payload || "Please enter the correct OTP.",
          onClose: closePopup,
          autoClose: 2,
          showConfirmButton: false,
          showCancelButton: false,
        });
      }
    });
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

          <CustomPopup
        isOpen={isPopupOpen}
        type={popupConfig.type}
        title={popupConfig.title}
        subText={popupConfig.subText}
        onConfirm={closePopup}
        onClose={closePopup}
        autoClose={popupConfig.autoClose}
        confirmLabel={popupConfig.confirmLabel}
        cancelLabel={popupConfig.cancelLabel}
        showConfirmButton={popupConfig.showConfirmButton}
        showCancelButton={popupConfig.showCancelButton}
        showCloseIcon={popupConfig.showCloseIcon}
      />
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthDrawer;
