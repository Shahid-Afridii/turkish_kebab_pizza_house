import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomCartBar from "../components/Cart/BottomCartBar";
import OrderStatus from "../components/order/OrderStatus";


const MainLayout = ({ children }) => {
  const location = useLocation(); // Get current route
  const [isBottomBarVisible, setBottomBarVisible] = useState(true); // Track visibility
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [orderId, setOrderId] = useState(null);
  // Hide BottomCartBar only on the checkout page
  const shouldShowBottomCartBar = location.pathname !== "/checkout" || location.pathname !== "/orders";
  useEffect(() => {
    // Show immediately if sessionStorage has it (e.g. after page reload)
    const storedOrderId = sessionStorage.getItem("latest_order_id");
    if (storedOrderId) {
      setOrderId(storedOrderId);
      setShowOrderStatus(true);
    }
  
    // Then listen for dispatched custom event (from Checkout)
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
  }, []);
  
  useEffect(() => {
    // Hide on route change
    setShowOrderStatus(false);
  }, [location.pathname]);
  
  return (  
    <div>
      <Navbar className="bg-gray-50" />
      <main className="lg:py-4 lg:px-4 bg-gray-50">{children}</main>
      <Footer />

      {/* ✅ Show BottomCartBar if not on Checkout Page */}
      {shouldShowBottomCartBar && (
        <BottomCartBar isVisible={isBottomBarVisible} onClose={() => setBottomBarVisible(false)} />
      )}
      <OrderStatus
        isVisible={showOrderStatus}
        onClose={() => setShowOrderStatus(false)}
        orderId={orderId}
      />
    </div>
  );
};

export default MainLayout;
