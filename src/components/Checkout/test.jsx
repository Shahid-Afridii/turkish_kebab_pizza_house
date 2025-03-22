import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { signup, login, signupVerify, verifyOtp } from "../../redux/slices/authSlice";
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

    if (isSignUp && (!name.trim() || !email.trim())) {
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
        openPopup({
          type: "error",
          title: "OTP Error",
          subText: res.payload || "Failed to send OTP.",
          showConfirmButton: false,
          showCancelButton: false,
          autoClose: 3,
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
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary underline font-medium">
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
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="117 2345678"
              className="flex-1 border rounded-lg px-2 md:px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {isSignUp && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full mb-2 border rounded-lg px-4 py-2 text-sm outline-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full mb-3 border rounded-lg px-4 py-2 text-sm outline-none"
              />
            </>
          )}

          <button
            onClick={handleSendOtp}
            className="bg-primary text-white w-full py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-4">
            Enter the OTP sent to your mobile
          </p>
          <div className="flex items-center gap-2 md:gap-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your OTP"
              maxLength="4"
              className="flex-1 border rounded-lg px-2 md:px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleVerifyOtp}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90"
            >
              Verify OTP
            </button>
          </div>
          <div className="flex justify-between mt-4 text-xs md:text-sm text-gray-600">
            <p>
              Haven’t received?{" "}
              <button onClick={handleSendOtp} className="text-primary underline">
                Resend OTP
              </button>
            </p>
            <button onClick={handleEditNumber} className="text-primary underline">
              Edit Number
            </button>
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
