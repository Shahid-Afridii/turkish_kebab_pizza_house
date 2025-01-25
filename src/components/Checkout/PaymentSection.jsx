import React, { useState } from "react";
import { FaCreditCard, FaGoogle, FaPaypal, FaMoneyBillWave, FaPercent } from "react-icons/fa";

const PaymentSection = () => {
  const [promotionVisible, setPromotionVisible] = useState(false);
  const [promotionCode, setPromotionCode] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleApplyPromotionCode = () => {
    if (promotionCode) {
      alert(`Promotion code "${promotionCode}" applied!`);
    } else {
      alert("Please enter a valid promotion code.");
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <div className="bg-white mt-3 p-2  space-y-4 sm:space-y-6">
      {/* Section Header */}
    

      {/* Promotion Code Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <FaPercent className="text-red-500 text-base sm:text-lg" />
            <span className="text-sm sm:text-base font-medium text-gray-800">Promotion Code</span>
          </div>
          {!promotionVisible ? (
            <button
              onClick={() => setPromotionVisible(true)}
              className="text-red-500 text-xs sm:text-sm font-medium hover:underline self-end sm:self-center"
            >
              Add
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                onClick={handleApplyPromotionCode}
                className="bg-red-500 text-white text-xs sm:text-sm px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-sm sm:text-lg font-medium text-gray-700 mb-2 sm:mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {/* Credit/Debit Card */}
          <button
            onClick={() => handlePaymentMethodSelect("Credit/Debit Card")}
            className={`flex items-center gap-2 p-3 border rounded-lg shadow-md hover:shadow-lg transition ${
              selectedPaymentMethod === "Credit/Debit Card"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <FaCreditCard className="text-base sm:text-2xl" />
            <span className="text-xs sm:text-sm font-medium">Credit/Debit Card</span>
          </button>

          {/* PayPal */}
          <button
            onClick={() => handlePaymentMethodSelect("PayPal")}
            className={`flex items-center gap-2 p-3 border rounded-lg shadow-md hover:shadow-lg transition ${
              selectedPaymentMethod === "PayPal"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <FaPaypal className="text-base sm:text-2xl" />
            <span className="text-xs sm:text-sm font-medium">PayPal</span>
          </button>

          {/* Google Pay */}
          <button
            onClick={() => handlePaymentMethodSelect("Google Pay")}
            className={`flex items-center gap-2 p-3 border rounded-lg shadow-md hover:shadow-lg transition ${
              selectedPaymentMethod === "Google Pay"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <FaGoogle className="text-base sm:text-2xl" />
            <span className="text-xs sm:text-sm font-medium">Google Pay</span>
          </button>

          {/* Pay with Cash */}
          <button
            onClick={() => handlePaymentMethodSelect("Pay with Cash")}
            className={`flex items-center gap-2 p-3 border rounded-lg shadow-md hover:shadow-lg transition ${
              selectedPaymentMethod === "Pay with Cash"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <FaMoneyBillWave className="text-base sm:text-2xl" />
            <span className="text-xs sm:text-sm font-medium">Pay with Cash</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
