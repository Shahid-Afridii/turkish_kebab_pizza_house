import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaChevronDown } from "react-icons/fa";

const items = [
    {
      id: 1,
      name: "Pizza Meal For 1 (10\")",
      price: "£10",
      description: "2 toppings, dip, chips and free can of drink",
      img: "/src/assets/delicious-pizza-studio 1.png",
      rating: "4.5",
      reviews: "1K Reviews",
      popular: true,
    },
    {
      id: 2,
      name: "Pizza Meal For 2 (12\")",
      price: "£14",
      description: "2 toppings, chips, dip and 2 free cans",
      img: "/src/assets/delicious-pizza-studio (2) 1.png",
      rating: "4.5",
      reviews: "1K Reviews",
      popular: true,
    },
    {
      id: 3,
      name: "10\" Munch Box",
      price: "£11",
      description: "Lamb kebab, 2x wings, 2x nuggets, 2x chicken...",
      img: "/src/assets/appetizing-kofta-kebab-meatballs-with-sauce-tortillas-tacos-white-plate 1.png",
      rating: "4.5",
      reviews: "1K Reviews",
      popular: true,
    },
    {
      id: 4,
      name: "Special Pizza Meal...",
      price: "£20",
      description: "2 toppings, large chips, french garlic bread, 2 dips...",
      img: "/src/assets/top-view-whole-pepperoni-pizza-with-sesame-sprinkles-top 1.png",
      rating: "4.5",
      reviews: "1K Reviews",
      popular: false,
    },
    {
      id: 5,
      name: "Burger Meal For 2",
      price: "£16",
      description: "2x burgers (chicken with cheese or 1/4lb cheese...",
      img: "/src/assets//burger-with-fries-cherry-tomatoes 1.png",
      rating: "4.5",
      reviews: "1K Reviews",
      popular: false,
    },
    {
      id: 6,
      name: "Big Family x2 Pizza...",
      price: "£16",
      description: "2 toppings, 2 chips, x4 goujons, 2 dips and 1.25l...",
      img: "/src/assets/pizza-pizza-filled-with-tomatoes-salami-olives 1.png",
      rating: "4.5",
      reviews: "1K Reviews",
      popular: false,
    },
  ];

const Products = () => {
  const [visibleItems, setVisibleItems] = useState(6); // Default visible items
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has run

  const handleShowMore = () => {
    setVisibleItems((prev) => prev + 3); // Load more items
  };

  React.useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true); // Prevent further animations
    }
  }, [inView, controls, hasAnimated]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
  };

  const childVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="px-6 py-8 mt-8">
      {/* Heading */}
      <h2 className="text-2xl font-title font-semibold mb-6">Meals</h2>

      {/* Grid of Items */}
      <motion.div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate={controls}
        variants={cardVariants}
      >
        {items.slice(0, visibleItems).map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col justify-between"
            variants={childVariants}
          >
            {/* Image */}
            <div className="relative">
              {item.popular && (
                <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-36 object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col justify-between h-full">
              <h3 className="text-lg font-bold font-Noto_Sans text-gray-800">{item.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                {/* Rating */}
                <span className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={i < Math.round(item.rating) ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 text-yellow-400 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.027 6.254a1 1 0 00.95.69h6.614c.969 0 1.371 1.24.588 1.81l-5.351 3.89a1 1 0 00-.364 1.118l2.027 6.254c.3.921-.755 1.688-1.54 1.118l-5.351-3.89a1 1 0 00-1.175 0l-5.351 3.89c-.784.57-1.84-.197-1.54-1.118l2.027-6.254a1 1 0 00-.364-1.118l-5.351-3.89c-.783-.57-.38-1.81.588-1.81h6.614a1 1 0 00.95-.69l2.027-6.254z"
                      />
                    </svg>
                  ))}
                </span>
                <span className="ml-2 text-green-600 font-semibold">
                  {item.rating}
                </span>
                <span className="ml-2 text-gray-500">{item.reviews}</span>
              </div>
              <p className="text-sm text-gray-600 font-Montserrat_Alternates mt-2">{item.description}</p>

              {/* Price and Button */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-primary font-montserrat font-bold text-lg">
                  {item.price}
                </span>
                <button className="bg-primary font-button text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                  Add Item
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Show More Button */}
      {visibleItems < items.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="flex items-center justify-center bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
          >
            Show more
            <FaChevronDown className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;

