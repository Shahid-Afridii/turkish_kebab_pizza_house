import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomCartBar from "../components/Cart/BottomCartBar";


const MainLayout = ({ children }) => {
  const location = useLocation(); // Get current route
  const [isBottomBarVisible, setBottomBarVisible] = useState(true); // Track visibility

  // Hide BottomCartBar only on the checkout page
  const shouldShowBottomCartBar = location.pathname !== "/checkout";

  return (
    <div>
      <Navbar className="bg-gray-50" />
      <main className="lg:py-4 lg:px-4 bg-gray-50">{children}</main>
      <Footer />

      {/* ✅ Show BottomCartBar if not on Checkout Page */}
      {shouldShowBottomCartBar && (
        <BottomCartBar isVisible={isBottomBarVisible} onClose={() => setBottomBarVisible(false)} />
      )}
    </div>
  );
};

export default MainLayout;
