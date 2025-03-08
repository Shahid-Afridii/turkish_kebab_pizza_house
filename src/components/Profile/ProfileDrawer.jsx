import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiMail, FiPhone, FiMapPin,FiMoreVertical,FiEdit,FiTrash2  } from "react-icons/fi";

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
  const addresses = [
    { id: 1, title: "Home", address: "1111 Brookvale Ave, BT15 3AR", isPrimary: true },
    { id: 2, title: "Office", address: "2534 Brookvale Ave, BT15 3AR" },
    { id: 3, title: "Friends Home", address: "3321 Brookvale Ave, BT15 3AR" },
  ];
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
  const [showOptions, setShowOptions] = useState(null);

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
           {/* ✅ Header with Background Pattern */}
             {/* **Header with Background Pattern** */}
              {/* **Header with Background (FIXED HEIGHT)** */}
              <div className="relative w-full rounded-lg overflow-hidden">
      {/* **Header Section with Background** */}
      <div className="relative h-[130px] bg-gray-100">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/profilebg.png')" }}
        ></div>

        {/* **Close Button** */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
        >
          <FaTimes size={16} />
        </button>
      </div>

      {/* **User Profile Section** */}
      <div className="relative flex flex-col items-center -mt-12">
        {/* **Profile Image** */}
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
          <FiUser size={36} className="text-gray-600" />
        </div>

        {/* **User Details** */}
        <h2 className="text-xl font-bold text-gray-800 mt-2">{user.name}</h2>
        <div className="flex flex-row justify-center text-gray-600 text-sm mt-2 space-x-6">
  <div className="flex items-center space-x-2">
    <FiPhone className="text-gray-600 text-lg" />
    <span>{user.phone}</span>
  </div>
  <div className="flex items-center space-x-2">
    <FiMail className="text-gray-600 text-lg" />
    <span>{user.email}</span>
  </div>
</div>

      </div>

      {/* **Buttons Section** */}
      <div className="mt-4 flex justify-center space-x-4 px-6 pb-4">
        <button className="flex items-center bg-red-500 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-600 shadow-md">
          <FaSignOutAlt className="mr-2" /> Sign-out
        </button>
        <button className="flex items-center border border-red-500 text-red-500 px-5 py-2 rounded-md text-sm font-semibold bg-red-100 hover:bg-red-200 shadow-md">
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
               <div className="flex flex-col space-y-4">
               {orders.map((order) => (
                 <div key={order.id} className="border-b pb-4">
                   {/* **Order Container (Responsive Flex)** */}
                   <div className="flex flex-col md:flex-row items-start md:items-center">
                     
                     {/* Order Image (Ensures it stays properly aligned) */}
                     <img src={order.image} alt={order.title} className="w-16 h-16 md:w-20 md:h-20 rounded-md object-cover" />
                     
                     {/* Order Details */}
                     <div className="mt-2 md:mt-0 md:ml-4 flex-1">
                       {/* Title & Date in Same Row on Desktop, Stacked on Mobile */}
                       <div className="flex flex-col md:flex-row justify-between">
                         <h4 className="text-sm font-semibold">{order.title}</h4>
                         <span className="text-xs font-semibold text-gray-600">{order.date}</span>
                       </div>
             
                       {/* Order Description */}
                       <p className="text-xs text-gray-600 leading-tight mt-1">
                         <strong>Toppings:</strong> {order.toppings} | <strong>Dip:</strong> {order.dip} <br />
                         <strong>Drinks:</strong> {order.drinks}
                       </p>
             
                       {/* **Track Order & Delivery Date (Responsive Alignment)** */}
                       {order.trackOrder && (
                         <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mt-2 space-y-2 md:space-y-0">
                           
                           {/* Track Order Button */}
                           <button className="text-xs border px-3 py-1 rounded-md text-red-500 border-red-500">
                             Track Order
                           </button>
             
                           {/* Delivery Info */}
                           <div className="flex items-center text-xs font-medium text-gray-800">
                             <span className="mr-1">Delivery:</span> {order.deliveryDate}
                             <FiMapPin className="ml-2 text-red-500" />
                             <span className="ml-1 text-red-500 font-medium">{order.status}</span>
                           </div>
                         </div>
                       )}
             
                       {/* **Reorder & Rate Order (Proper Spacing on Mobile)** */}
                       {order.reorder && (
  <div className="flex flex-row md:flex-row md:justify-start space-x-2 mt-2">
    <button className="text-xs md:text-xs px-3 py-1 border rounded-md bg-gray-200 text-gray-800 w-1/2 md:w-auto">
      REORDER
    </button>
    <button className="text-xs md:text-xs px-3 py-1 border rounded-md text-red-500 border-red-500 w-1/2 md:w-auto">
      RATE ORDER
    </button>
  </div>
)}

                     </div>
                   </div>
                 </div>
               ))}
             </div>
             
              ) : (
                <div className="">
  {addresses.length > 0 ? (
    addresses.map((item) => (
      <div key={item.id} className="relative border-b pb-4 mb-4">
        {/* **Address Title & Primary Label (Smaller on Mobile)** */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm md:text-lg font-semibold">
            {item.title} {item.isPrimary && <span className="text-xs md:text-sm text-gray-500">(Primary address)</span>}
          </h3>

          {/* **Three Dots Menu Button (Smaller on Mobile)** */}
          <button onClick={() => setShowOptions(showOptions === item.id ? null : item.id)}>
            <FiMoreVertical className="text-gray-500 text-base md:text-lg" />
          </button>
        </div>

        {/* **Address Description (Smaller on Mobile)** */}
        <p className="text-xs md:text-sm text-gray-600">{item.address}</p>

        {/* **Dropdown Menu (Edit, Delete, Set Primary) - Scaled Down on Mobile** */}
        {showOptions === item.id && (
          <div className="absolute right-6 top-10 bg-white shadow-md rounded-md py-2 w-36 md:w-40 border z-10">
            <button className="flex items-center px-3 py-1 text-xs md:text-sm hover:bg-gray-100 w-full">
              <FiEdit className="mr-2 text-gray-600" /> Edit
            </button>
            <button className="flex items-center px-3 py-1 text-xs md:text-sm text-red-500 hover:bg-gray-100 w-full">
              <FiTrash2 className="mr-2" /> Delete
            </button>
            {!item.isPrimary && (
              <button className="flex items-center px-3 py-1 text-xs md:text-sm text-red-600 font-semibold hover:bg-gray-100 w-full">
                Set as Primary
              </button>
            )}
          </div>
        )}
      </div>
    ))
  ) : (
    // **No Addresses Available UI (Smaller Font for Mobile)**
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <FiMapPin className="text-2xl md:text-3xl text-gray-400 mb-2" />
      <p className="text-xs md:text-sm">No addresses available</p>
    </div>
  )}

  {/* **Add Address Button (Smaller on Mobile)** */}
  <div className="flex justify-center mt-4">
    <button className="bg-red-500 text-white px-4 py-2 rounded-md text-xs md:text-sm font-semibold hover:bg-red-600">
      Add Address
    </button>
  </div>
</div>

              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDrawer;
