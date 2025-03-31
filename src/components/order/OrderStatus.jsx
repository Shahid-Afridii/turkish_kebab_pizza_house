import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

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
  const navigate = useNavigate();
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  const { orderList } = useSelector((state) => state.order);
  const [matchedOrder, setMatchedOrder] = useState(null);
  const containerRef = useRef(null);
  const [rating, setRating] = useState(0);
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
  
    if (diffMin < 1) return "Just now";
    if (diffMin === 1) return "1 minute ago";
    return `${diffMin} minutes ago`;
  };
  
  useEffect(() => {
    if (isVisible) {
      dispatch(getOrders());
      setLastRefreshedAt(new Date());

    }
  }, [dispatch, isVisible]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastRefreshedAt) {
        setLastRefreshedAt((prev) => new Date(prev)); // trigger re-render
      }
    }, 60000); // every 1 min
  
    return () => clearInterval(interval);
  }, [lastRefreshedAt]);
  
  useEffect(() => {
    if (orderId && orderList.length > 0) {
      const found = orderList.find((order) => order.order_id === orderId);
      setMatchedOrder(found || null);
    }
  }, [orderList, orderId]);

  if (!isVisible || !matchedOrder) return null;

  const itemsCount = matchedOrder.items?.length || 0;
  const paid = matchedOrder.payment_mode !== "COD";

  const statusTextMap = {
    preparing: "Preparing Order",
    accepted: "Order Accepted",
    "on the way": "Your Order is on the way!",
    delivered: "Delivered Successfully",
    pending: "Pending Confirmation",
    processing: "Processing",
    cancelled: "Order Cancelled",
  };

  const orderStatusText = statusTextMap[matchedOrder.order_status?.toLowerCase()] || "Processing";

  // ✅ If delivered, show rating section
//   if (matchedOrder.order_status?.toLowerCase() === "delivered") {
//     return (
//       <motion.div
//   ref={containerRef}
//   className="fixed bottom-0 left-0 right-0 z-[999] bg-primary text-white shadow-2xl rounded-t-2xl"
//   variants={waveAnimation}
//   initial="hidden"
//   animate="visible"
//   exit="exit"
// >
//   <div className="relative p-4 pb-2">
//      {/* Close Icon */}
//      <button
//   onClick={() => {
//     onClose();
//     sessionStorage.removeItem("latest_order_id");
//   }}
//   className="absolute top-3 right-4 text-white hover:text-white/80 text-xl"
//   aria-label="Close"
// >
//   <RxCross2 />
// </button>

//     <h1 className="text-sm font-medium mb-2">
//       Please tell us about your previous order.
//     </h1>

//     <p className="text-base font-semibold text-white mb-2">
//       {matchedOrder.items?.[0]?.name} & {itemsCount - 1} Others
//     </p>

//     {/* Star Rating */}
//     <div className="flex gap-1 mb-2">
//   {[1, 2, 3, 4, 5].map((star) => (
//     <button
//       key={star}
//       onClick={() => setRating(star)}
//       aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
//       className={`text-lg cursor-pointer transition-all ${
//         star <= rating ? "text-yellow-400" : "text-white/40"
//       }`}
//     >
//       ★
//     </button>
//   ))}
// </div>

//     {/* Issue Tags */}
//     <div className="flex flex-wrap gap-2 mb-3">
//       {["Too cold", "Delayed delivery", "Underbaked", "Incomplete order"].map((issue) => (
//         <button
//           key={issue}
//           aria-label={`Select issue: ${issue}`}
//           className="border border-white text-white rounded-md px-3 py-0.5 text-xs"
//         >
//           {issue}
//         </button>
//       ))}
//     </div>

//     {/* Feedback Textarea */}
//     <textarea
//       placeholder="Please let us know, it could help us improve."
//       className="w-full border border-white/20 bg-white text-black rounded-md p-2 resize-none focus:outline-none text-sm placeholder:text-gray-400"
//       rows="2"
//     />

//     {/* Footer */}
//     <div className="mt-3 flex justify-between items-center">
//       <button
//         className="text-xs underline underline-offset-2"
//         aria-label="View your order history"
//         onClick={() => navigate("/orders")}
//       >
//         View Order
//       </button>

//       <div className="flex gap-3">
//         <button   aria-label="Skip rating and close popup"
//   onClick={() => {
//               onClose();
//               sessionStorage.removeItem("latest_order_id");
//             }}className="text-xs text-gray-100">Skip</button>
//         <button   aria-label="Submit rating"
//  className="bg-white text-primary px-3 py-1 rounded-md text-xs font-semibold">
//           Submit
//         </button>
//       </div>
//     </div>
//   </div>
// </motion.div>

//     );
//   }

  // ❌ Else: normal order status UI
  return (
    <motion.div
    ref={containerRef}
    className="fixed bottom-0 left-0 right-0 z-[999] bg-primary text-white shadow-2xl text-sm sm:text-base"
    variants={waveAnimation}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
      <p className="text-xs sm:text-sm font-semibold">Add delivery instruction</p>
      <button
        onClick={() => {
          onClose();
          sessionStorage.removeItem("latest_order_id");
        }}
        aria-labelledby="delivery-instruction-label"
        className="bg-primary hover:bg-red-400 text-white px-3 py-1 rounded-lg text-xs sm:text-sm"
      >
        Add Message
      </button>
    </div>
  
    <div className="relative px-4 py-3 flex flex-col gap-2">
      <button
        onClick={() => {
          onClose();
          sessionStorage.removeItem("latest_order_id");
        }}
        className="absolute top-1 right-4 text-white hover:text-white/80 text-sm sm:text-xl"
        aria-label="Close"
      >
        <RxCross2 />
      </button>
  
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xs sm:text-sm text-gray-300">Status</h1>
          <p className="text-sm sm:text-lg font-bold">{orderStatusText}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm">{itemsCount} Items</span>
          <span className="text-xs sm:text-sm font-bold">{paid ? "Paid" : "Pending"}</span>
        </div>
      </div>
  
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => navigate("/orders")}
          aria-label="View your order history"
          className="text-xs sm:text-sm underline underline-offset-2"
        >
          View Order
        </button>
        <button
          onClick={() => {
            dispatch(getOrders());
            setLastRefreshedAt(new Date());
          }}
          aria-label="Refresh your orders"
          className="bg-white text-black px-3 py-1 rounded-lg text-xs sm:text-sm"
        >
          Refresh
        </button>
      </div>
  
      {lastRefreshedAt && (
        <p className="text-[10px] sm:text-xs text-white mt-1 text-right">
          Last refreshed: {getRelativeTime(lastRefreshedAt)}
        </p>
      )}
    </div>
  </motion.div>
  
  );
};

export default OrderStatus;
