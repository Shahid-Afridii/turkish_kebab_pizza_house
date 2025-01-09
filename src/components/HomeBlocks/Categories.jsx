import React, { useState, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.3 });
  const [hasAnimated, setHasAnimated] = useState(false);

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const itemWidth = carouselRef.current.scrollWidth / categories.length;
      const scrollPosition = index * itemWidth - containerWidth / 2 + itemWidth / 2;
      carouselRef.current.scrollTo({ left: Math.max(scrollPosition, 0), behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentIndex < categories.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handleCategoryClick = (index) => {
    setCurrentIndex(index);
    scrollToIndex(index);
  };

  React.useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true); // Prevent further animations
    }
  }, [inView, controls, hasAnimated]);

  const animationVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const arrowVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      ref={ref}
      className="flex items-center  font-montserrat justify-between rounded-lg shadow-xl mt-8 p-4 w-full overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={animationVariants}
    >
      {/* Left Arrow */}
      <motion.button
        onClick={handlePrev}
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50"
        disabled={currentIndex === 0}
        whileHover="hover"
        whileTap="tap"
        variants={arrowVariants}
      >
        <FaArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Category Items */}
      <motion.div
        ref={carouselRef}
        className="flex items-center space-x-6 overflow-x-scroll scrollbar-hide w-full px-4"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            onClick={() => handleCategoryClick(index)}
            className={`flex flex-col items-center justify-center space-y-2 cursor-pointer ${
              currentIndex === index ? "bg-primary/10 border border-primary rounded-lg" : ""
            } p-4`}
            variants={itemVariants}
            whileHover="hover"
          >
            <motion.div
              className="w-32 h-32 overflow-hidden"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={category.img}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.span
              className={`text-sm font-medium ${
                currentIndex === index ? "text-primary" : "text-gray-700"
              }`}
            >
              {category.name}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>

      {/* Right Arrow */}
      <motion.button
        onClick={handleNext}
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50"
        disabled={currentIndex === categories.length - 1}
        whileHover="hover"
        whileTap="tap"
        variants={arrowVariants}
      >
        <FaArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default CategoryCarousel;
