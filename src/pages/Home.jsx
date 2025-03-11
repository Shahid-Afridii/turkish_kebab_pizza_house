import React, { useRef, useState, useEffect,Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Search from "../components/HomeBlocks/Search";
import Categories from "../components/HomeBlocks/Categories";
import SliderProducts from "../components/HomeBlocks/SliderProducts";
import Products from "../components/HomeBlocks/Products";
import withErrorBoundary from "../components/ErrorBoundary/withErrorBoundary"; 

import SkeletonBanner from "../components/skeleton/BannerSkeleton";

  // Lazy-load components with dynamic fallbacks and error messages
const BannerWithErrorBoundary = withErrorBoundary(
  React.lazy(() => import("../components/HomeBlocks/Banner")),
  <SkeletonBanner />,
  "Failed to load the banner."
);
const Home = () => {

  const productRef = useRef(null);


  const categoriesRef = useRef(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
// ✅ Store Selected Category ID Here
const [selectedCategoryId, setSelectedCategoryId] = useState(null);

 
  const scrollToProducts = () => {
    console.log("Scrolling to product section:", productRef.current); // Debugging log
  
    if (productRef.current) {
      // ✅ Get the exact position and add an offset
      const yOffset = -100; // Adjust based on your layout (increase if hidden under navbar)
      const y = productRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
  
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      console.error("productRef is null");
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      setIsScrollingUp(currentScrollY < lastScrollY);

      // Check if Categories component is out of view
      const categoriesRect = categoriesRef.current?.getBoundingClientRect();
      if (categoriesRect) {
        setIsStickyVisible(categoriesRect.bottom <= 0 && isScrollingUp);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isScrollingUp]);

  return (
    <div className="relative">
      <div className="relative">
      <BannerWithErrorBoundary scrollToProducts={scrollToProducts}  />
      </div>

      {/* Sticky Search Section */}
      <motion.div
        className="sticky top-0 z-50 bg-gray-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="bg-gray-50">
          <Search />
        </div>

        {/* Sticky Categories Section */}
        <div className="relative">
          <AnimatePresence>
            {isStickyVisible && (
              <div
                key="sticky-categories"
                className="sticky top-0 z-50 bg-gray-50 border-t border-gray-200"
              >
                <Categories />
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Original Categories Component */}
      <div
        ref={categoriesRef}
        className="relative"
        style={{
          display: isStickyVisible ? "none" : "block", // Instant toggle
        }}
      >
        <Categories setSelectedCategory={setSelectedCategoryId} />
      </div>

      {/* Products Section */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Products productRef={productRef} selectedCategoryId={selectedCategoryId} />
      </motion.div>
      {/* slider Products Section */}
      {/* <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <SliderProducts  />
      </motion.div> */}
    </div>
  );
};

export default Home;
