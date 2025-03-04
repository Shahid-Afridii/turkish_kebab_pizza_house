import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchMenuData,setSelectedCategoryId  } from "../../redux/slices/menuSlice";
import withErrorBoundary from "../../components/ErrorBoundary/withErrorBoundary"; // Import HOC

// const categories = [
//   { id: 1, name: "Meals", img: "assets/side-view-pizza-with-chicken-mushrooms-served-with-sauce-vegetables-salad-wooden-plate-removebg-preview 1.png" },
//   { id: 2, name: "Pizzas", img: "assets/hawaiian-pizza-removebg-preview 1.png" },
//   { id: 3, name: "Garlic Breads", img: "assets/delicious-orange-bun-table-removebg-preview 1.png" },
//   { id: 4, name: "Kebabs", img: "assets/cooked-meat-veggies-kebab-skewers-with-pita-removebg-preview 1.png" },
//   { id: 5, name: "Burgers", img: "assets/front-view-tasty-meat-burger-with-vegetables-dark-surface-sandwich-fast-food-bun-removebg-preview 1.png" },
//   { id: 6, name: "Sundries", img: "assets/Chicken_wings-removebg-preview 1.png" },
//   { id: 7, name: "Chips", img: "assets/horizontal-view-delicious-homemade-potato-chips-brown-plate-gray-table-removebg-preview 1.png" },
// ];

const CategoryCarousel = () => {
  const [isScrollable, setIsScrollable] = useState(false);
  
  const carouselRef = useRef(null);
  const isFetched = useRef(false);
  const dispatch = useDispatch();
  const { menu, selectedCategoryId, status } = useSelector((state) => state.menu);// ✅ Load API & Image URLs from Vite environment variables
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const { ref, inView } = useInView({
    triggerOnce: true, // Animation triggers only once
    threshold: 0.1, // Trigger when 10% of the component is in the viewport
  });

  // Check if the carousel is scrollable
  const updateScrollable = () => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const contentWidth = carouselRef.current.scrollWidth;
      setIsScrollable(contentWidth > containerWidth); // Enable arrows if content exceeds container
    }
  };

  
  useEffect(() => {
    if (!isFetched.current && menu?.length === 0 && status === "idle") {
      dispatch(fetchMenuData());
      isFetched.current = true; // Prevents double call
    }
  }, [status]);
  
  
  


  
  useEffect(() => {
    updateScrollable();
    window.addEventListener("resize", updateScrollable);
    return () => window.removeEventListener("resize", updateScrollable);
  }, []);

  const handleNext = () => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const scrollAmount = containerWidth * 0.75; // Increase scroll speed by scrolling 75% of the container width
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const scrollAmount = containerWidth * 0.75; // Increase scroll speed
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (swipeDistance > 30) {
      // Swipe left
      handleNext();
    } else if (swipeDistance < -30) {
      // Swipe right
      handlePrev();
    }
  };

  const handleCategoryClick = (id) => {
    dispatch(setSelectedCategoryId(id)); // ✅ Update Redux state with selected category
    dispatch(fetchMenuItems()); // ✅ Fetch menu items for the new category
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center w-full mt-4 md:mt-8 shadow-xl lg:shadow-sm"
    >
      {/* Left Arrow */}
      {isScrollable && (
        <button
          onClick={handlePrev}
          className="absolute left-[-5px] sm:left-2 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-white shadow-md rounded-full flex items-center justify-center text-primary border border-primary hover:bg-primary hover:text-white hidden sm:flex"
        >
          <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}

      {/* Carousel */}
      <motion.div
        ref={carouselRef}
        initial={{ opacity: 0, y: -50 }} // Start from the top
        animate={inView ? { opacity: 1, y: 0 } : {}} // Move to its original position
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`flex ${
          isScrollable ? "justify-start" : "justify-center"
        } gap-4 pb-4 overflow-hidden w-full px-2 md:px-8`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
    {menu.length === 0 ? (
  menu.map((_, index) => (
    <motion.div
      key={index}
      className="flex flex-col items-center justify-center w-20 sm:w-32 lg:w-32 cursor-pointer rounded-full"
    >
      {/* Skeleton for the Category Image -  */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded-full shadow-sm bg-gray-200 animate-pulse border border-gray-300"></div>

      {/* Skeleton for the Category Name - */}
      <span className="mt-2 text-xs sm:text-sm font-medium text-gray-400 w-10 h-4 bg-gray-200 animate-pulse rounded"></span>
    </motion.div>
  ))
) : status === "error" ? (
  // 🔥 Error UI
  <div className="flex flex-col items-center justify-center w-full text-center py-6">
    <span className="text-red-500 text-lg font-semibold">
      ⚠ Oops! Something went wrong.
    </span>
    <p className="text-gray-500 text-sm mt-1">We couldn't load the categories. Please try again.</p>
    <button
      onClick={() => dispatch(fetchMenuData())}
      className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
    >
      Retry 🔄
    </button>
  </div>
) : menu.filter((category) => category.status === "active").length > 0 ? (
  // ✅ Render only active categories
  menu
    .filter((category) => category.status === "active")
    .map((category) => (
      <motion.div
        key={category.id}
        onClick={() => handleCategoryClick(category.id)}
        className="flex flex-col items-center p-1 justify-center w-20 sm:w-32 lg:w-32 cursor-pointer rounded-full"
        whileHover={{ scale: 1.05 }}
      >
        <div
          className={`flex items-center p-2 justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 overflow-hidden rounded-full shadow-sm  ${
            selectedCategoryId === category.id
              ? "border-2 border-primary shadow-lg"
              : "border-2 border-transparent"
          }`}
        >
          <img
            src={category.image ? `${IMAGE_URL}${category.image}` : "/assets/noimage.png"}
            alt={category.name}
            className="w-full h-full object-contain transition-opacity duration-500 opacity-0  rounded-full"
            onLoad={(e) => e.target.classList.remove("opacity-0")}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/noimage.png";
            }}
          />
        </div>
        <span
          className={`mt-2 text-xs sm:text-sm font-medium text-center truncate ${
            selectedCategoryId === category.id ? "text-primary" : "text-gray-700"
          }`}
          title={category.name}
          style={{ maxWidth: "6rem" }}
        >
          {category.name}
        </span>
      </motion.div>
    ))
) : (
  // 🔥 No Active Categories UI
  <div className="flex flex-col items-center justify-center w-full text-center py-6">
    <span className="text-gray-500 text-lg font-semibold">📂 No Active Categories Found</span>
    <p className="text-gray-400 text-sm mt-1">Check back later for more updates.</p>
  </div>
)}

      </motion.div>

      {/* Right Arrow */}
      {isScrollable && (
        <button
          onClick={handleNext}
          className="absolute right-[-5px] sm:right-2 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-white shadow-md rounded-full flex items-center justify-center text-primary border border-primary hover:bg-primary hover:text-white hidden sm:flex"
        >
          <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
};

export default withErrorBoundary(CategoryCarousel);
