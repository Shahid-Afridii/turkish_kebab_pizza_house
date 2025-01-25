import React, { useState } from "react";

const AccountSection = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Mobile, Step 2: Enter OTP

  const handleSendOtp = () => {
    if (mobileNumber) {
      setStep(2); // Move to OTP verification
    }
  };

  const handleVerifyOtp = () => {
    if (otp) {
      alert("OTP Verified!");
    }
  };

  const handleEditNumber = () => {
    setStep(1); // Back to mobile number input
    setOtp("");
  };

  return (
    <div className="bg-white  p-4 md:p-6">
     
      {step === 1 ? (
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-4">
            Login with your mobile number
          </p>
          <div className="flex items-center gap-2 md:gap-4">
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
              className="flex-1 border rounded-lg px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSendOtp}
              className="bg-primary text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium text-xs md:text-sm hover:bg-primary/90"
            >
              OTP
            </button>
          </div>
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
              className="flex-1 border rounded-lg px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleVerifyOtp}
              className="bg-primary text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium text-xs md:text-sm hover:bg-primary/90"
            >
              Verify OTP
            </button>
          </div>
          <div className="flex justify-between mt-4 text-xs md:text-sm text-gray-600">
            <p>
              Haven’t Received?{" "}
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
    </div>
  );
};

export default AccountSection;
