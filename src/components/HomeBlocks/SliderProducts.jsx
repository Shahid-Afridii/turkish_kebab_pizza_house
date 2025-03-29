import React, { useState, forwardRef, useEffect } from "react";
import DrawerModal from "../Cart/DrawerModal";
import { motion } from "framer-motion";
import { Navigation, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaPlus, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";


const items = [
  {
    id: 1,
    name: "Pizza Meal For 1 (10\")",
    price: "£10",
    description: "2 toppings, dip, chips and free can of drink",
    img: "assets/delicious-pizza-studio 1.png",
    rating: "4.5",
    reviews: "1K Reviews",
    popular: true,
    toppings: ["Mushroom", "Chicken", "Pepperoni", "Sweetcorn", "Onions", "Green Peppers"],
    dips: ["Curry", "Gravy", "Garlic", "Chilli", "Mint Sauce"],
    drinks: ["Coca Cola", "Diet Coke", "Fanta Orange", "Sprite"],
  },
  {
    id: 2,
    name: "Pizza Meal For 2 (12\")",
    price: "£14",
    description: "2 toppings, chips, dip and 2 free cans",
    img: "assets/delicious-pizza-studio (2) 1.png",
    rating: "4.5",
    reviews: "1K Reviews",
    popular: true,
    toppings: ["Tuna", "Bacon", "Jalapenos", "Kebab", "Salami", "Sweetcorn"],
    dips: ["House", "Garlic", "Chilli", "Barbecue", "Honey Mustard"],
    drinks: ["Coca Cola", "Diet Coke", "Coke Zero", "Pepsi", "7UP"],
  },
  {
    id: 3,
    name: "10\" Munch Box",
    price: "£11",
    description: "Lamb kebab, 2x wings, 2x nuggets, 2x chicken...",
    img: "assets/appetizing-kofta-kebab-meatballs-with-sauce-tortillas-tacos-white-plate 1.png",
    rating: "4.5",
    reviews: "1K Reviews",
    popular: true,
    toppings: ["Lamb", "Chicken", "Nuggets", "Wings", "Cheese", "Pickles"],
    dips: ["Curry", "Garlic", "Hot Sauce", "Mayonnaise"],
    drinks: ["Sprite", "Coca Cola", "Diet Coke", "Fanta Orange"],
  },
  {
    id: 4,
    name: "Special Pizza Meal...",
    price: "£20",
    description: "2 toppings, large chips, french garlic bread, 2 dips...",
    img: "assets/top-view-whole-pepperoni-pizza-with-sesame-sprinkles-top 1.png",
    rating: "4.5",
    reviews: "1K Reviews",
    popular: false,
    toppings: ["Salami", "Olives", "Peppers", "Chicken", "Mushrooms", "Sweetcorn"],
    dips: ["House", "Garlic", "Barbecue", "Ranch", "Ketchup"],
    drinks: ["Coke Zero", "Fanta Orange", "Pepsi", "Mountain Dew"],
  },
  {
    id: 5,
    name: "Burger Meal For 2",
    price: "£16",
    description: "2x burgers (chicken with cheese or 1/4lb cheese...",
    img: "assets//burger-with-fries-cherry-tomatoes 1.png",
    rating: "4.5",
    reviews: "1K Reviews",
    popular: false,
    toppings: ["Cheese", "Lettuce", "Tomato", "Pickles", "Onions", "Bacon"],
    dips: ["Ketchup", "Mayonnaise", "Mustard", "Ranch"],
    drinks: ["Coca Cola", "Sprite", "Water", "Diet Coke"],
  },
  {
    id: 6,
    name: "Big Family x2 Pizza...",
    price: "£16",
    description: "2 toppings, 2 chips, x4 goujons, 2 dips and 1.25l...",
    img: "assets/pizza-pizza-filled-with-tomatoes-salami-olives 1.png",
    rating: "4.5",
    reviews: "1K Reviews",
    popular: false,
    toppings: ["Pepperoni", "Cheese", "Sweetcorn", "Jalapenos", "Mushrooms", "Chicken"],
    dips: ["Garlic", "Chilli", "Barbecue", "Honey Mustard", "Ranch"],
    drinks: ["Coca Cola", "Diet Coke", "Sprite", "Fanta Orange"],
  },
];


const CustomNavigation = ({ prevEl, nextEl, disablePrev, disableNext, showArrows }) => {
  if (!showArrows) return null; // Hide arrows if showArrows is false
  return (
    <div className="absolute inset-y-0 flex items-center justify-between w-full pointer-events-none z-10">
      <button
        ref={prevEl}
        aria-label="Scroll to previous slide"
        className={`pointer-events-auto bg-primary text-white p-2 rounded-full shadow hover:bg-primary transition-all transform -translate-x-3 ${
          disablePrev ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disablePrev}
      >
        <FaChevronLeft />
      </button>
      <button
        ref={nextEl}
        aria-label="Scroll to next slide"
        className={`pointer-events-auto bg-primary text-white p-2 rounded-full shadow hover:bg-primary transition-all transform translate-x-3 ${
          disableNext ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disableNext}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

const Products = forwardRef((props, ref) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showArrows, setShowArrows] = useState(window.innerWidth >= 768);

  const handleAddItem = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  const prevElRef = React.useRef(null);
  const nextElRef = React.useRef(null);

  const updateArrows = (swiper) => {
    setDisablePrev(swiper.isBeginning);
    setDisableNext(swiper.isEnd);
  };

  useEffect(() => {
    const handleResize = () => {
      setShowArrows(window.innerWidth >= 768); // Show arrows only for screens >= 768px
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative px-4 sm:px-8 py-8  bg-gray-50">
      <h2 ref={ref} className="text-lg md:text-2xl font-title font-semibold mb-6">
        What are you craving for?
      </h2>

      <div className="relative">
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={10}
          slidesPerView={1.5}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 10 },
            375: { slidesPerView: 1.5, spaceBetween: 15 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1440: { slidesPerView: 4, spaceBetween: 20 },
            1920: { slidesPerView: 6, spaceBetween: 25 },
          }}
          navigation={{
            prevEl: prevElRef.current,
            nextEl: nextElRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevElRef.current;
            swiper.params.navigation.nextEl = nextElRef.current;
          }}
          onSlideChange={(swiper) => updateArrows(swiper)}
          onInit={(swiper) => updateArrows(swiper)}
          className="w-full"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col justify-between"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  {item.popular && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-sm lg:text-lg font-bold text-gray-800">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(item.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-green-600 font-semibold">
                      {item.rating}
                    </span>
                  </div>
                  <p className="text-xs lg:text-lg text-gray-600 mt-2 truncate">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-red-500 font-bold text-lg">
                      {item.price}
                    </span>
                    <button
                      aria-label={`Add ${item?.name || "item"} to cart`}
                      onClick={() => handleAddItem(item)}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary transition flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Add Item
                    </button>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Arrows */}
        <CustomNavigation
          prevEl={prevElRef}
          nextEl={nextElRef}
          disablePrev={disablePrev}
          disableNext={disableNext}
          showArrows={showArrows}
        />
      </div>

      <DrawerModal
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedItem={selectedItem}
      />
    </div>
  );
});

export default Products;
