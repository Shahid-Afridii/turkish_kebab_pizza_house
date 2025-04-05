import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { signup, login, signupVerify, verifyOtp,getProfile } from "../../redux/slices/authSlice";
import CustomPopup from "../../components/CustomPopup";

const AccountSection = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});

  const otpInputs = useRef([]);

  const openPopup = (config) => {
    setPopupConfig(config);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    if (popupConfig.onClose) {
      setTimeout(() => popupConfig.onClose(), 500);
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      openPopup({
        type: "error",
        title: "Mobile Number Required",
        subText: "Please enter a valid mobile number.",
        showConfirmButton: false,
        showCancelButton: false,
        autoClose: 3,
      });
      return;
    }

    if (isSignUp) {
      if (!name.trim() || !email.trim()) {
        openPopup({
          type: "error",
          title: "Signup Details Required",
          subText: "Please fill in your name and email.",
          showConfirmButton: false,
          showCancelButton: false,
          autoClose: 3,
        });
        return;
      }

      if (!isValidEmail(email)) {
        openPopup({
          type: "error",
          title: "Invalid Email",
          subText: "Please enter a valid email address.",
          showConfirmButton: false,
          showCancelButton: false,
          autoClose: 3,
        });
        return;
      }
    }

    const action = isSignUp
      ? signup({ name, email, mobile: mobileNumber })
      : login({ mobile: mobileNumber });

    dispatch(action).then((res) => {
      if (res.payload?.status) {
        
       
        setStep(2);
        openPopup({
          type: "success",
          title: "OTP Sent",
          subText: "Please enter the OTP sent to your mobile number.",
          showConfirmButton: false,
          showCancelButton: false,
          autoClose: 3,
        });
      } else {
        const isInvalidMobileMessage = typeof res.payload === "string" && res.payload.toLowerCase().includes("invalid mobile");

openPopup({
  type: "error",
  title: "Error",
  subText: res.payload || "Failed to send OTP.",
  showConfirmButton: false,
  showCancelButton: false,
  autoClose: 3,
  onClose: () => {
    if (!isSignUp && isInvalidMobileMessage) {
      setIsSignUp(true); // ✅ Automatically redirect to Sign Up mode
    }
  }
});

      }
    });
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      openPopup({
        type: "error",
        title: "Invalid OTP",
        subText: "Please enter the full OTP.",
        showConfirmButton: false,
        showCancelButton: false,
        autoClose: 3,
      });
      return;
    }
  
    const action = isSignUp
      ? signupVerify({ mobile: mobileNumber, otp })
      : verifyOtp({ mobile: mobileNumber, otp });
  
    dispatch(action).then((res) => {
      if (res.payload?.status) {
        dispatch(getProfile());
        openPopup({
          type: "success",
          title: "Success",
          subText: "OTP Verified Successfully!",
          showConfirmButton: false,
          showCancelButton: false,
          autoClose: 3,
          onClose: () => {
            setStep(1);
            setOtp("");
            setMobileNumber("");
            setName("");
            setEmail("");
          },
        });
      } else {
        // ❌ OTP Failed: Clear OTP fields & inputs
        setOtp("");
        otpInputs.current.forEach((input) => {
          if (input) input.value = "";
        });
  
        // Optional: focus first input
        otpInputs.current[0]?.focus();
  
        openPopup({
          type: "error",
          title: "OTP Failed",
          subText: res.payload || "Invalid OTP, please try again.",
          showConfirmButton: false,
          showCancelButton: false,
          autoClose: 3,
        });
      }
    });
  };
  

  const handleOtpChange = (val, index) => {
    const otpArray = otp.split("");
    otpArray[index] = val;
    const updatedOtp = otpArray.join("");
    setOtp(updatedOtp);

    if (val && index < 3) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      otpInputs.current[index + 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 4);
    if (!/^[0-9]+$/.test(paste)) return;

    const otpArray = paste.split("");
    setOtp(paste);
    otpArray.forEach((char, idx) => {
      otpInputs.current[idx].value = char;
    });

    otpInputs.current[Math.min(3, otpArray.length - 1)].focus();
  };

  const handleEditNumber = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <div className="bg-white p-4 md:p-6">
      {isAuthenticated ? (
        <div className="bg-green-600 text-white p-4 md:p-6 rounded-lg flex items-center gap-4">
          <p className="text-sm md:text-base flex items-center gap-2">
            Mobile Number Verified <FaCheckCircle className="h-5 w-5 text-white" />
          </p>
        </div>
      ) : step === 1 ? (
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-2">
            {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button   aria-label={isSignUp ? "Switch to login form" : "Switch to sign-up form"}
 onClick={() => setIsSignUp(!isSignUp)} className="text-primary underline font-medium">
              {isSignUp ? "Login" : "Sign up"}
            </button>
          </p>

          <div className="flex items-center gap-2 md:gap-4 mb-3">
            <img
              src="https://flagcdn.com/w40/gb.png"
              alt="UK Flag"
              className="w-6 h-6 md:w-8 md:h-8 rounded-full border"
            />
            <input
              aria-label="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) setMobileNumber(val.slice(0, 10)); // ensure numeric + limit
              }}
              
              placeholder="117 2345678"
              className="flex-1 border rounded-lg px-2 md:px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              aria-label={isLoading ? "Sending OTP, please wait" : "Send one-time password"}
              onClick={handleSendOtp}
              disabled={isLoading}
              className={`bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold transition ${
                isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/90"
              }`}
            >
              {isLoading ? "Processing..." : "OTP"}
            </button>
          </div>

          {isSignUp && (
            <>
              <input
                type="text"
                aria-label="Enter your name"
                value={name}
                maxLength={50}
                onChange={(e) => setName(e.target.value.slice(0, 50))}
                placeholder="Your Name"
                className="w-full mb-2 border rounded-lg px-4 py-2 text-sm outline-none"
              />
              <input
                type="email"
                maxLength={100}
                aria-label="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value.slice(0, 100))}
                placeholder="Email Address"
                className="w-full mb-3 border rounded-lg px-4 py-2 text-sm outline-none"
              />
            </>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-4">Enter the OTP sent to your mobile</p>

          <div className="flex items-center gap-4">
            <div className="flex gap-2" onPaste={handlePaste}>
              {[0, 1, 2, 3].map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  aria-label={`Enter OTP digit ${idx + 1}`}
                  maxLength="1"
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  ref={(el) => (otpInputs.current[idx] = el)}
                  className="w-12 h-12 text-xl text-center border-2 border-red-500 rounded-md outline-none  focus:ring-red-400"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              aria-label={isLoading ? "Verifying one-time password, please wait" : "Verify one-time password"}

              className={`bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm transition ${
                isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/90"
              }`}
            >
              {isLoading ? "Processing..." : "Verify OTP"}
            </button>
          </div>

          <div className="flex justify-between mt-4 text-xs md:text-sm text-gray-600">
            <p>
              Haven’t received?{" "}
              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                aria-label={isLoading ? "Resending one-time password" : "Resend one-time password"}
                className="text-primary underline disabled:opacity-60"
              >
                Resend OTP
              </button>
            </p>
            {isSignUp && (
    <button     aria-label="Edit phone number"
    onClick={handleEditNumber} className="text-primary underline">
      Edit Number
    </button>
  )}
          </div>

          <div className="mt-4 text-xs md:text-sm text-gray-800 font-semibold">
            <img
              src="https://flagcdn.com/w40/gb.png"
              alt="UK Flag"
              className="inline-block w-4 h-4 md:w-5 md:h-5 rounded-full mr-2"
            />
            +44 {mobileNumber}
          </div>
        </div>
      )}

      <CustomPopup
        isOpen={isPopupOpen}
        type={popupConfig.type}
        title={popupConfig.title}
        subText={popupConfig.subText}
        onConfirm={popupConfig.onConfirm}
        onClose={closePopup}
        autoClose={popupConfig.autoClose}
        confirmLabel={popupConfig.confirmLabel}
        cancelLabel={popupConfig.cancelLabel}
        showConfirmButton={popupConfig.showConfirmButton}
        showCancelButton={popupConfig.showCancelButton}
        showCloseIcon={popupConfig.showCloseIcon}
      />
    </div>
  );
};

export default AccountSection;
