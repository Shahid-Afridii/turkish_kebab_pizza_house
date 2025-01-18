import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "../components/HomeBlocks/Banner";
import Search from "../components/HomeBlocks/Search";
import Categories from "../components/HomeBlocks/Categories";
import Products from "../components/HomeBlocks/Products";

const Home = () => {
  const productsHeadingRef = useRef(null);
  const categoriesRef = useRef(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const scrollToProductsHeading = () => {
    const stickyContainerHeight = document.querySelector(".sticky")?.offsetHeight || 0;

    if (productsHeadingRef.current) {
      const topPosition = productsHeadingRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: topPosition - stickyContainerHeight,
        behavior: "smooth",
      });
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
        <Banner onMenuClick={scrollToProductsHeading} />
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
        <Categories />
      </div>

      {/* Products Section */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Products ref={productsHeadingRef} />
      </motion.div>
    </div>
  );
};

export default Home;
