import React, { useState } from "react";
import { FaCreditCard, FaGoogle, FaPaypal, FaMoneyBillWave, FaPercent } from "react-icons/fa";

const PaymentSection = ({ selectedPaymentMethod, setSelectedPaymentMethod,handlePlaceOrder,isProcessing  }) => {
  const [promotionVisible, setPromotionVisible] = useState(false);
  const [promotionCode, setPromotionCode] = useState("");

  const handleApplyPromotionCode = () => {
    if (promotionCode) {
      alert(`Promotion code "${promotionCode}" applied!`);
    } else {
      alert("Please enter a valid promotion code.");
    }
  };

  const handlePaymentMethodSelect = (method) => {
    // Convert "Pay with Cash" to "COD"
    const paymentValue = method === "Pay with Cash" ? "COD" : method;
    setSelectedPaymentMethod(paymentValue);
  };

  return (
    <div className="bg-white mt-3 p-2 space-y-4 sm:space-y-6">
      {/* Promotion Code Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <FaPercent className="text-red-500 text-sm sm:text-lg" />
            <span className="text-xs sm:text-sm font-medium text-gray-800">
              Promotion Code
            </span>
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
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-4">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {/* Pay Now - Stripe */}
        <button
          onClick={() => handlePlaceOrder("Stripe")}
          className={`flex items-center justify-center gap-2 p-3 border rounded-lg shadow-md hover:shadow-lg transition ${
            selectedPaymentMethod === "Stripe" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700"
          }`}
          disabled={isProcessing === "Stripe"} // ✅ Disable if processing
        >
          <FaCreditCard />
          {isProcessing === "Stripe" ? "Processing..." : "Pay Now"}
        </button>

        {/* Cash on Delivery (COD) */}
        <button
          onClick={() => handlePlaceOrder("COD")}
          className={`flex items-center justify-center gap-2 p-3 border rounded-lg shadow-md hover:shadow-lg transition ${
            selectedPaymentMethod === "COD" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700"
          }`}
          disabled={isProcessing === "COD"} // ✅ Disable if processing
        >
          <FaMoneyBillWave />
          {isProcessing === "COD" ? "Processing..." : "Cash on Delivery"}
        </button>
      </div>
      </div>
    </div>
  );
};

export default PaymentSection;
