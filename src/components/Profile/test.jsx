import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

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
  

const ProfileDrawer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("orders");

  // ✅ Static User Data
  const user = {
    name: "Suresh",
    email: "mail@gmail.com",
    phone: "+44 117 2345678",
  };

  // ✅ Static Order History (Precise Fix)
  const orders = [
    {
      id: 1,
      title: "Pizza Meal For 2 (12”)",
      toppings: "Ham, Pineapple",
      dip: "Curry",
      drinks: "1 Coca Cola, 1 Diet Coke",
      date: "5th Nov 2024",
      time: "18:45 PM",
      status: "Home",
      image: "/static/pizza1.jpg",
      trackOrder: true,
      deliveryDate: "5th Nov, 18:45 PM",
    },
    {
      id: 2,
      title: "Pizza Meal For 2 (12”)",
      toppings: "Ham, Pineapple",
      dip: "Curry",
      drinks: "1 Coca Cola, 1 Diet Coke",
      date: "31st Oct 2024",
      image: "/static/pizza2.jpg",
      reorder: true,
      rateOrder: true,
    },
  ];

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
            className="fixed top-0 right-0 w-full max-w-lg h-full bg-white z-[9999] shadow-lg flex flex-col overflow-hidden rounded-lg"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="relative flex flex-col items-center p-6 border-b border-gray-200 bg-gray-100">
              {/* Close Button */}
              <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                <FaTimes size={18} />
              </button>

              {/* User Info */}
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <FiUser size={28} className="text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold mt-2">{user.name}</h2>
              <p className="text-gray-600 flex items-center text-sm">
                <FiPhone className="mr-2" /> {user.phone}
              </p>
              <p className="text-gray-600 flex items-center text-sm">
                <FiMail className="mr-2" /> {user.email}
              </p>

              {/* Sign-out & Edit Buttons */}
              <div className="mt-3 flex space-x-3">
                <button className="px-4 py-2 bg-red-500 text-white flex items-center rounded-md text-xs font-semibold">
                  <FaSignOutAlt className="mr-2" /> Sign-out
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 flex items-center rounded-md text-xs font-semibold">
                  <FaEdit className="mr-2" /> Edit
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-1/2 py-3 text-center text-sm font-medium ${
                  activeTab === "orders" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-1/2 py-3 text-center text-sm font-medium ${
                  activeTab === "addresses" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"
                }`}
              >
                Address
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === "orders" ? (
                <>
                  <h3 className="text-sm font-semibold mb-2">Today</h3>
                  {orders.map((order) => (
                    <div key={order.id} className="mb-4 flex border-b pb-4">
                      {/* Image */}
                      <img src={order.image} alt={order.title} className="w-20 h-20 rounded-md object-cover" />
                      <div className="ml-4 flex-1">
                        {/* Title + Date in same row */}
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-semibold">{order.title}</h4>
                          <span className="text-xs font-semibold text-gray-600">{order.date}</span>
                        </div>

                        {/* Order Details */}
                        <p className="text-xs text-gray-600 leading-tight">
                          <strong>Toppings:</strong> {order.toppings} | <strong>Dip:</strong> {order.dip} <br />
                          <strong>Drinks:</strong> {order.drinks}
                        </p>

                        {/* Track Order & Delivery Date */}
                        {order.trackOrder && (
                          <div className="flex justify-between items-center mt-2">
                            <button className="text-xs border px-3 py-1 rounded-md text-red-500 border-red-500">
                              Track Order
                            </button>
                            <div className="flex items-center text-xs font-medium text-gray-800">
                              <span className="mr-1">Delivery:</span> {order.deliveryDate}
                              <FiMapPin className="ml-2 text-red-500" />
                              <span className="ml-1 text-red-500 font-medium">Home</span>
                            </div>
                          </div>
                        )}

                        {/* Reorder & Rate Order */}
                        {order.reorder && (
                          <div className="flex justify-start space-x-2 mt-2">
                            <button className="text-xs px-3 py-1 border rounded-md bg-gray-200 text-gray-800">
                              REORDER
                            </button>
                            <button className="text-xs px-3 py-1 border rounded-md text-red-500 border-red-500">
                              RATE ORDER
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center text-gray-500">No addresses available.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDrawer;
