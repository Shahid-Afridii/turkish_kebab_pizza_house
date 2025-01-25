import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const waveAnimation = {
  hidden: {
    y: "100%", // Start from below the screen
    opacity: 0,
    borderRadius: "100% 100% 0% 0%",
    transition: {
      duration: 0.5,
    },
  },
  visible: {
    y: 0, // Moves to its final position
    opacity: 1,
    borderRadius: "20px 20px 0 0", // Smoothly changes to rounded top
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      delay: 0.2,
    },
  },
  exit: {
    y: "100%", // Moves out of the screen
    opacity: 0,
    borderRadius: "100% 100% 0% 0%", // Reverts to a wave-like shape
    transition: {
      duration: 0.5,
    },
  },
};

const OrderStatus = ({ isVisible, onClose, orderStatus }) => {
  const statusDetails = {
    preparing: {
      message: "Preparing Order",
      time: "35 mins",
      items: 4,
      paid: true,
    },
    onTheWay: {
      message: "Your Order is on the way!",
      time: "28 mins",
      items: 4,
      paid: true,
    },
  };

  const renderStatus = statusDetails[orderStatus];

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white shadow-2xl"
      variants={waveAnimation}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Top Black Section */}
      <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
        <p className="text-sm font-semibold">Add delivery instruction</p>
        <button
          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-lg text-sm"
          onClick={onClose}
        >
          Add Message
        </button>
      </div>

      {/* Bottom Red Section */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 flex flex-col gap-2">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm text-gray-300">Status</h3>
            <p className="text-lg font-bold">{renderStatus.message}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
              ⏱ {renderStatus.time}
            </span>
            <span className="text-sm">{renderStatus.items} Items</span>
            <span className="text-sm font-bold">{renderStatus.paid ? "Paid" : "Pending"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderStatus;
