import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const DeliveryPickupSection = () => {
  const [mode, setMode] = useState("delivery"); // 'delivery' or 'pickup'

  return (
    <div className="bg-white p-4 sm:p-6">
      {/* Header Section */}
      <div className="text-center mb-4">
        
        {mode === "delivery" && (
          <span className="text-xs text-gray-500">
            Minimum order of £10 for delivery.
          </span>
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode("delivery")}
          className={`w-28 py-2 text-sm font-medium rounded-md transition ${
            mode === "delivery"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Delivery
        </button>
        <button
          onClick={() => setMode("pickup")}
          className={`w-28 py-2 text-sm font-medium rounded-md transition ${
            mode === "pickup"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Pick-up
        </button>
      </div>

      {/* Delivery Form */}
      {mode === "delivery" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="House Number & Street Name"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Save address as (Home, Office, etc.)"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
              onClick={() => alert("Locating address...")}
            >
              <FaMapMarkerAlt />
              Locate me
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-500" />
              <input
                type="time"
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button className="text-primary text-sm font-medium hover:underline">
              Delivery Instructions
            </button>
            <button className="text-primary text-sm font-medium hover:underline">
              Add new address
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-primary text-white w-40 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {/* Pick-up Form */}
      {mode === "pickup" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-500" />
              <input
                type="time"
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-primary text-white w-40 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPickupSection;
