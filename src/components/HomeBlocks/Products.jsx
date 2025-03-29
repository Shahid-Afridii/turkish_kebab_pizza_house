import React, { useState,useEffect , forwardRef } from "react";
import DrawerModal from "../Cart/DrawerModal";
import { useDispatch, useSelector } from "react-redux";
import withErrorBoundary from "../../components/ErrorBoundary/withErrorBoundary"; // Import HOC
import { motion } from "framer-motion";
import { FaPlus,FaChevronDown } from "react-icons/fa";
import { fetchMenuItems } from "../../redux/slices/menuSlice"; 
import { clearSearchResults } from "../../redux/slices/searchSlice";
import { formatPrice } from "../../utils/formatPrice";
import { FaChevronUp } from "react-icons/fa";
import useWindowWidth from "../../components/useWindowWidth";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
// Static Data for All Items

  const SkeletonLoader = () => {
    return (
      <div className="bg-white animate-pulse rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="relative w-full h-64 bg-gray-200"></div>
        <div className="p-4">
          <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-gray-300 rounded mb-4"></div>
          <div className="w-full h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  };
  
const Products = forwardRef(({ productRef }, ref) => {
  const [visibleItems, setVisibleItems] = useState(6);
  const [hasExpanded, setHasExpanded] = useState(false);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { menuItems, selectedCategoryId, status } = useSelector((state) => state.menu);
  const { results: searchResults } = useSelector((state) => state.search);
  const displayedItems =
  searchResults && searchResults.length > 0 ? searchResults : menuItems;
  const { keyword } = useSelector((state) => state.search);
  const windowWidth = useWindowWidth();

  const dispatch = useDispatch();
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
  const handleShowMore = () => {
    setVisibleItems((prev) => prev + 3);
    setHasExpanded(true);

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
    // ✅ Only dispatch fetchMenuItems when there's no active search
    if (selectedCategoryId && (!searchResults || searchResults.length === 0)) {
      dispatch(fetchMenuItems());
    }
  
    // ✅ Always clear previous search results when switching category
    if (searchResults?.length > 0) {
      dispatch(clearSearchResults());
    }
  }, [selectedCategoryId, dispatch]);

  useEffect(() => {
    const calculateVisibleItems = () => {
      let cols = 1;
      let rows = 2;
  
      if (windowWidth >= 1536) cols = 6;
      else if (windowWidth >= 1280) cols = 4;
      else if (windowWidth >= 1024) cols = 3;
      else if (windowWidth >= 768) cols = 3;
      else {
        // Mobile: force show more items
        cols = 1;
        rows = 6; // ✅ Show 6 items on small screen (1 col x 6 rows)
      }
  
      setVisibleItems(cols * rows);
    };
  
    calculateVisibleItems();
  }, [windowWidth, searchResults, selectedCategoryId]);
  

  console.log("keyword", keyword);
  return (
    <div ref={productRef} className="px-4 sm:px-8 py-8 mt-8 bg-gray-50">
     {searchResults && searchResults.length > 0 && (
      <div className="mb-6 px-2 sm:px-4 text-gray-700">
        <p className="text-sm sm:text-base font-medium">
          Showing <span className="text-primary font-bold">{searchResults.length}</span> results for{" "}
          <span className="italic text-primary font-semibold">"{keyword}"</span>
        </p>
      </div>
    )}
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
  ) : displayedItems.slice(0, visibleItems).length === 0 ? (

    <div className="col-span-full flex flex-col items-center justify-center text-gray-600">
      <p className="text-lg font-bold">No items available.</p>
      <p className="text-sm text-gray-500">Please select a different category.</p>
    </div>
  ) : (
    displayedItems.slice(0, visibleItems).map((item) => (
  
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
          {item.food_type !== "others" && (
  <span
    className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 shadow-md bg-white"
  >
    <span
      className="w-3 h-3 rounded-full"
      style={{
        backgroundColor:
          item.food_type === "non-veg" ? "#D32F2F" : "#388E3C",
      }}
    ></span>
  </span>
)}

          <img
  src={item.image ? `${IMAGE_URL}${item.image}` : "/assets/noimage.png"}
  alt={item.name}
  className="w-full h-64 object-cover transition-opacity duration-500 opacity-0"
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
          {/* <div className="flex items-center text-sm text-gray-500 mt-2">
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
          </div> */}
          {item.add_ons && item.add_ons.length > 0 && (
            <p className="text-xs lg:text-lg text-gray-600 mt-2 truncate">
              {item.add_ons.map((addon) => addon.name).join(", ")}
            </p>
          )}
          <div className="flex justify-between items-center mt-4">
            <span className="text-primary font-bold text-lg">{formatPrice(item.price)}</span>
            <button
              onClick={() => handleAddItem(item)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary transition flex items-center"
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


<div className="flex justify-center mt-8 gap-4 flex-wrap">
  {visibleItems < displayedItems.length && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleShowMore}
      className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium shadow hover:bg-primary/90 transition duration-300"
    >
      <span>Load More...</span>
      <FaChevronDown className="mt-[2px]" />
    </motion.button>
  )}

{hasExpanded && visibleItems > (
  windowWidth >= 1536 ? 12 :
  windowWidth >= 1280 ? 8 :
  windowWidth >= 1024 ? 6 :
  windowWidth >= 768 ? 6 :
  6 
) && (

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        setVisibleItems(6);
        setHasExpanded(false);
      }}
      className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium shadow hover:bg-primary/90 transition duration-300"
    >
      <span>Load less</span>
      <FaChevronUp className="mt-[2px]" />
    </motion.button>
  )}
</div>




      <DrawerModal
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedItem={selectedItem}
      />
    </div>
  );
});

export default withErrorBoundary(Products);
