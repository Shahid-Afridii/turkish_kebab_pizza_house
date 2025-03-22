import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/slices/orderSlice";

const waveAnimation = {
  hidden: { y: "100%", opacity: 0, borderRadius: "100% 100% 0% 0%", transition: { duration: 0.5 } },
  visible: {
    y: 0,
    opacity: 1,
    borderRadius: "20px 20px 0 0",
    transition: { type: "spring", stiffness: 50, damping: 15, delay: 0.2 },
  },
  exit: { y: "100%", opacity: 0, borderRadius: "100% 100% 0% 0%", transition: { duration: 0.5 } },
};

const OrderStatus = ({ isVisible, onClose, orderId }) => {
  const dispatch = useDispatch();
  const { orderList, isLoading } = useSelector((state) => state.order);
  const [matchedOrder, setMatchedOrder] = useState(null);

  useEffect(() => {
    if (isVisible) {
      dispatch(getOrders());
    }
  }, [dispatch, isVisible]);

  useEffect(() => {
    if (orderId && orderList.length > 0) {
      const found = orderList.find((order) => order.order_id === orderId);
      setMatchedOrder(found || null);
    }
  }, [orderList, orderId]);

  const containerRef = useRef(null);

  if (!isVisible) return null;

  // Optional fallback while fetching
  if (!matchedOrder) {
    return (
      <motion.div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white shadow-2xl p-4 text-center"
        variants={waveAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <p className="text-white text-sm">Loading order details...</p>
      </motion.div>
    );
  }

  const time = "30 mins";
  const itemsCount = matchedOrder.items?.length || 0;
  const paid = matchedOrder.payment_mode !== "COD";
  const statusTextMap = {
    preparing: "Preparing Order",
    onTheWay: "Your Order is on the way!",
    delivered: "Delivered Successfully",
    pending: "Pending Confirmation",
  };
  const orderStatusText = statusTextMap[matchedOrder.order_status?.toLowerCase()] || "Processing";

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white shadow-2xl"
      variants={waveAnimation}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
        <p className="text-sm font-semibold">Add delivery instruction</p>
        <button
          onClick={() => {
            onClose();
            sessionStorage.removeItem("latest_order_id"); // ✅ Clear only after close
          }}
          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-lg text-sm"
        >
          Add Message
        </button>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm text-gray-300">Status</h3>
            <p className="text-lg font-bold">{orderStatusText}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
              ⏱ {time}
            </span>
            <span className="text-sm">{itemsCount} Items</span>
            <span className="text-sm font-bold">{paid ? "Paid" : "Pending"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderStatus;
