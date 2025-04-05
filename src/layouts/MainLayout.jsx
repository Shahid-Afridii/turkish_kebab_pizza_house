import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomCartBar from "../components/Cart/BottomCartBar";
import OrderStatus from "../components/order/OrderStatus";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isBottomBarVisible, setBottomBarVisible] = useState(true);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const shouldShowBottomCartBar = location.pathname !== "/checkout" && location.pathname !== "/orders";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryOrderId = params.get("order_id");

    if (queryOrderId) {
      setOrderId(queryOrderId);
      setShowOrderStatus(true);
    } else {
      // Check for sessionStorage fallback
      const storedOrderId = sessionStorage.getItem("latest_order_id");
      if (storedOrderId) {
        setOrderId(storedOrderId);
        setShowOrderStatus(true);
      }
    }

    const handleShowOrderStatus = (e) => {
      const id = e.detail || sessionStorage.getItem("latest_order_id");
      if (id) {
        setOrderId(id);
        setShowOrderStatus(true);
      }
    };

    window.addEventListener("show-order-status", handleShowOrderStatus);
    return () => {
      window.removeEventListener("show-order-status", handleShowOrderStatus);
    };
  }, [location]);

  return (
    <div>
      <Navbar className="bg-gray-50" />
      <main className="lg:py-4 lg:px-4 bg-gray-50">{children}</main>
      <Footer />
      {shouldShowBottomCartBar && (
        <BottomCartBar
          isVisible={isBottomBarVisible}
          onClose={() => setBottomBarVisible(false)}
        />
      )}

      {/* OrderStatus component shown if query param or sessionStorage is set */}
      {orderId && (
        <OrderStatus
          isVisible={showOrderStatus}
          onClose={() => setShowOrderStatus(false)}
          orderId={orderId}
        />
      )}
    </div>
  );
};

export default MainLayout;
