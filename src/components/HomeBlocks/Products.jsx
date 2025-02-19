import React, { useState,useEffect , forwardRef } from "react";
import DrawerModal from "../Cart/DrawerModal";
import { useDispatch, useSelector } from "react-redux";
import withErrorBoundary from "../../components/ErrorBoundary/withErrorBoundary"; // Import HOC
import { motion } from "framer-motion";
import { FaPlus,FaChevronDown } from "react-icons/fa";
import { fetchMenuItems } from "../../redux/slices/menuSlice"; 
import { formatPrice } from "../../utils/formatPrice";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
// Static Data for All Items
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
  const SkeletonLoader = () => {
    return (
      <div className="bg-white animate-pulse rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="relative w-full h-48 bg-gray-200"></div>
        <div className="p-4">
          <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-gray-300 rounded mb-4"></div>
          <div className="w-full h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  };
  
const Products = forwardRef((props, ref) => {
  const [visibleItems, setVisibleItems] = useState(6);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { menuItems, selectedCategoryId, status } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
  const handleShowMore = () => {
    setVisibleItems((prev) => prev + 3);
  };

  const handleAddItem = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchMenuItems()); // ✅ Fetch menu items dynamically
    }
  }, [selectedCategoryId, dispatch]);

  console.log("menuItems", menuItems);
  return (
    <div className="px-4 sm:px-8 py-8 mt-8 bg-gray-50">
      {/* <h2 ref={ref} className="text-lg md:text-2xl font-bold mb-6 text-gray-800">
        Meals
      </h2> */}
<motion.div
  className="grid grid-cols-1 p-2 lg:p-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {status === "loading" ? (
    [...Array(4)].map((_, index) => <SkeletonLoader key={index} />)
  ) : status === "error" ? (
    <div className="col-span-full flex flex-col items-center justify-center text-red-600">
      <p className="text-lg font-bold">Oops! Something went wrong.</p>
      <p className="text-sm text-gray-500">We couldn't load the menu items. Please try again.</p>
    </div>
  ) : menuItems.length === 0 ? (
    <div className="col-span-full flex flex-col items-center justify-center text-gray-600">
      <p className="text-lg font-bold">No items available.</p>
      <p className="text-sm text-gray-500">Please select a different category.</p>
    </div>
  ) : (
    menuItems.slice(0, visibleItems).map((item) => (
      <motion.div
        key={item.id}
        className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-transform duration-300 hover:scale-105"
        whileHover={{ scale: 1.05 }}
      >
        <div className="relative">
          {item.popular && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              Popular
            </span>
          )}
          {/* Food Type Indicator */}
          <span
            className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 shadow-md bg-white"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: item.food_type === "non-veg" ? "#D32F2F" : "#388E3C",
              }}
            ></span>
          </span>
          <img
  src={item.image ? `${IMAGE_URL}${item.image}` : "/assets/noimage.png"}
  alt={item.name}
  className="w-full h-48 object-cover transition-opacity duration-500 opacity-0"
  onLoad={(e) => {
    e.target.classList.remove("opacity-0"); // ✅ Smooth fade-in effect
    e.target.classList.remove("animate-pulse"); // ✅ Remove shimmer when image loads
  }}
  onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = "/assets/noimage.png"; // ✅ Fallback image
    e.target.classList.remove("animate-pulse"); // ✅ Remove shimmer on error
  }}
/>
 

        </div>
        <div className="p-4 flex flex-col">
          <h3 className="text-md lg:text-lg font-bold text-gray-800">{item.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                fill={i < Math.round(item.rating) ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`w-4 h-4 ${
                  i < Math.round(item.rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.027 6.254a1 1 0 00.95.69h6.614c.969 0 1.371 1.24.588 1.81l-5.351 3.89a1 1 0 00-.364 1.118l2.027 6.254c.3.921-.755 1.688-1.54 1.118l-5.351-3.89a1 1 0 00-1.175 0l-5.351 3.89c-.784.57-1.84-.197-1.54-1.118l2.027-6.254a1 1 0 00-.364-1.118l-5.351-3.89c-.783-.57-.38-1.81.588-1.81h6.614a1 1 0 00.95-.69l2.027-6.254z"
                />
              </svg>
            ))}
            <span className="ml-2 text-md lg:text-lg text-green-600 font-semibold">
              {item.rating}
            </span>
            <span className="ml-2 text-md lg:text-lg text-gray-500">{item.reviews}</span>
          </div>
          {item.add_ons && item.add_ons.length > 0 && (
            <p className="text-xs lg:text-lg text-gray-600 mt-2 truncate">
              {item.add_ons.map((addon) => addon.name).join(", ")}
            </p>
          )}
          <div className="flex justify-between items-center mt-4">
            <span className="text-primary font-bold text-lg">{formatPrice(item.price)}</span>
            <button
              onClick={() => handleAddItem(item)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Item
            </button>
          </div>
        </div>
      </motion.div>
    ))
  )}
</motion.div>


      {visibleItems < items.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-600 flex items-center"
          >
            Show more
            <FaChevronDown className="ml-2" />
          </button>
        </div>
      )}

      <DrawerModal
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedItem={selectedItem}
      />
    </div>
  );
});

export default withErrorBoundary(Products);
