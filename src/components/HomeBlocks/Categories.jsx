import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const categories = [
  { id: 1, name: "Meals", img: "assets/side-view-pizza-with-chicken-mushrooms-served-with-sauce-vegetables-salad-wooden-plate-removebg-preview 1.png" },
  { id: 2, name: "Pizzas", img: "assets/hawaiian-pizza-removebg-preview 1.png" },
  { id: 3, name: "Garlic Breads", img: "assets/delicious-orange-bun-table-removebg-preview 1.png" },
  { id: 4, name: "Kebabs", img: "assets/cooked-meat-veggies-kebab-skewers-with-pita-removebg-preview 1.png" },
  { id: 5, name: "Burgers", img: "assets/front-view-tasty-meat-burger-with-vegetables-dark-surface-sandwich-fast-food-bun-removebg-preview 1.png" },
  { id: 6, name: "Sundries", img: "assets/Chicken_wings-removebg-preview 1.png" },
  { id: 7, name: "Chips", img: "assets/horizontal-view-delicious-homemade-potato-chips-brown-plate-gray-table-removebg-preview 1.png" },
];

const CategoryCarousel = () => {
  const [isScrollable, setIsScrollable] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // Track the active category
  const carouselRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Check if the carousel is scrollable
  useEffect(() => {
    const updateScrollable = () => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        const contentWidth = carouselRef.current.scrollWidth;
        setIsScrollable(contentWidth > containerWidth); // Enable arrows if content exceeds container
      }
    };

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
    setActiveCategory(id); // Set the clicked category as active
  };

  return (
    <div className="relative flex items-center justify-center w-full mt-4 md:mt-8 shadow-xl lg:shadow-sm">
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
      <div
        ref={carouselRef}
        className={`flex ${
          isScrollable ? "justify-start" : "justify-center"
        } gap-4 pb-4 overflow-hidden w-full px-2 md:px-8`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex flex-col items-center justify-center w-20 sm:w-32 lg:w-32 cursor-pointer rounded-full`}
            whileHover={{ scale: 1.05 }}
          >
            <div
              className={`flex items-center  justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-32 lg:h-32 overflow-hidden rounded-full shadow-sm bg-white ${
                activeCategory === category.id
                  ? "border-2 border-primary shadow-lg"
                  : "border-2 border-transparent"
              }`}
            >
              <img
                src={category.img}
                alt={category.name}
                className="w-full h-full object-contain "
              />
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm font-medium text-center truncate ${
                activeCategory === category.id ? "text-primary" : "text-gray-700"
              }`}
              style={{ maxWidth: "5rem" }}
            >
              {category.name}
            </span>
          </motion.div>
        ))}
      </div>

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

export default CategoryCarousel;
