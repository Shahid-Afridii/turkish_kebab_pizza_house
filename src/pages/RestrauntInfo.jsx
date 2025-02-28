import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopSettings } from "../redux/slices/shopSlice";
import withErrorBoundary from "../components/ErrorBoundary/withErrorBoundary"; // Import HOC

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Faster stagger for fluid entry
      delayChildren: 0.05, // Minimal delay before children start animating
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 }, // Moves down slightly with a shrink effect
  visible: {
    opacity: 1,
    y: 0,
    scale: 1, // Expands to normal size smoothly
    transition: {
      duration: 0.4, // Optimized for fast yet smooth animation
      ease: [0.25, 0.75, 0.5, 1], // Smooth cubic bezier for natural movement
    },
  },
};




// **Custom Static Skeleton Loader** (No shimmer, clean layout)
const CustomSkeleton = () => (
  <motion.div className="space-y-6 p-2 md:p-4 mx-auto " initial="hidden" animate="visible" variants={containerVariants}>
    {/* Skeleton Header */}
    <motion.div className="bg-gray-300 h-8 w-40 mx-auto rounded-md" variants={itemVariants}></motion.div>

    {/* Skeleton for Opening Hours */}
    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="h-6 bg-gray-300 w-48 mx-auto md:mx-0 rounded-md"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="grid grid-cols-3 bg-gray-200 rounded-lg shadow p-4">
            <div className="h-5 bg-gray-300 w-16 rounded-md"></div>
            <div className="h-5 bg-gray-300 w-24 mx-auto rounded-md"></div>
            <div className="h-5 bg-gray-300 w-24 mx-auto rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Skeleton for Contact Info */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 w-32 mx-auto md:mx-0 rounded-md"></div>
        <div className="bg-gray-200 rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 bg-gray-300 w-32 rounded-md"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 bg-gray-300 w-24 rounded-md"></div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const RestaurantInfo = () => {
  const dispatch = useDispatch();
  const { shop = {}, shopTimings = [], policy = {}, loading, error } = useSelector((state) => state.shop) || {};
  const hasFetched = useRef(false); // Prevents duplicate calls

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchShopSettings());
      hasFetched.current = true; // Mark as fetched
    }
  }, [dispatch]);

  if (loading) return <CustomSkeleton />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <motion.div className="p-6 md:p-8 mx-auto bg-gray-50 rounded-lg shadow-md" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 className="text-xl lg:text-2xl font-title font-bold text-red-600 mb-6 text-center" variants={itemVariants}>
        Restaurant Info
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Opening Hours Section */}
        <motion.div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6" variants={containerVariants}>
          <motion.h2 className="text-xl font-semibold text-gray-800 mb-6 text-center md:text-left" variants={itemVariants}>
            Opening Hours
          </motion.h2>
          <motion.div className="space-y-4 font-montserrat">
            {shopTimings.length > 0 ? (
              shopTimings.map((timing) => (
                <motion.div key={timing.id} className="grid grid-cols-1 md:grid-cols-3 bg-white rounded-lg shadow p-4 hover:bg-red-50 transition duration-300" variants={itemVariants}>
                  <div className="text-gray-800 font-semibold">{timing.day}</div>
                  <div className="text-gray-700 text-sm md:text-center">
                    <span className="font-medium">Pick-Up:</span> {new Date(timing.pickup_from).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} - {new Date(timing.pickup_to).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="text-gray-700 text-sm md:text-center">
                    <span className="font-medium">Delivery:</span> {new Date(timing.delivery_from).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} - {new Date(timing.delivery_to).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">No opening hours available</p>
            )}
          </motion.div>
        </motion.div>

        {/* Contact Information Section */}
        <motion.div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6 self-start" variants={containerVariants}>
          <motion.h2 className="text-xl font-semibold text-gray-800 mb-6 text-center md:text-left" variants={itemVariants}>
            Contact Information
          </motion.h2>
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center text-gray-700 hover:text-red-600 transition duration-300">
              <FaMapMarkerAlt className="text-red-600 mr-4 text-lg" />
              <span className="text-sm">{shop?.address || "No address available"}</span>
            </div>
            <div className="flex items-center text-gray-700 hover:text-red-600 transition duration-300">
              <FaPhoneAlt className="text-red-600 mr-4 text-lg" />
              <span className="text-sm">{shop?.phone || "No phone available"}</span>
            </div>
            <div className="flex items-center text-gray-700 hover:text-red-600 transition duration-300">
              <FaEnvelope className="text-red-600 mr-4 text-lg" />
              <span className="text-sm">{shop?.email || "No email available"}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default withErrorBoundary(RestaurantInfo);
