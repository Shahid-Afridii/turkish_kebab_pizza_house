import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const RestaurantInfo = () => {
  return (
    <motion.div
      className="p-6 md:p-8 mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl font-title font-bold text-red-600 mb-6 text-center"
        variants={itemVariants}
      >
        Restaurant Info
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Opening Hours Section */}
        <motion.div
          className="md:col-span-2"
          variants={containerVariants}
        >
          <motion.h2
            className="text-xl font-Montserrat_Alternates font-semibold text-gray-800 mb-6 text-center md:text-left"
            variants={itemVariants}
          >
            Opening Hours
          </motion.h2>
          <motion.div className="space-y-4 font-montserrat">
            {[
              { day: "Monday", pickup: "16:00 - 01:00", delivery: "16:00 - 00:30" },
              { day: "Tuesday", pickup: "16:00 - 01:00", delivery: "16:00 - 00:30" },
              { day: "Wednesday", pickup: "16:00 - 01:00", delivery: "16:00 - 00:30" },
              { day: "Thursday", pickup: "16:00 - 01:00", delivery: "16:00 - 00:30" },
              { day: "Friday", pickup: "16:00 - 02:00", delivery: "16:00 - 01:30" },
              { day: "Saturday", pickup: "16:00 - 02:00", delivery: "16:00 - 01:30" },
              { day: "Sunday", pickup: "16:00 - 01:00", delivery: "16:00 - 00:30" },
            ].map((row, index) => (
              <motion.div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 bg-white rounded-lg shadow p-4 hover:bg-red-50 transition duration-300"
                variants={itemVariants}
              >
                <div className="text-gray-800 font-semibold">{row.day}</div>
                <div className="text-gray-700 text-sm md:text-center">
                  <span className="font-medium">Pick-Up:</span> {row.pickup}
                </div>
                <div className="text-gray-700 text-sm md:text-center">
                  <span className="font-medium">Delivery:</span> {row.delivery}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Contact Information Section */}
        <motion.div
          className="md:col-span-1 font-Montserrat_Alternates self-start"
          variants={containerVariants}
        >
          <motion.h2
            className="text-xl font-semibold text-gray-800 mb-6 text-center md:text-left"
            variants={itemVariants}
          >
            Contact Information
          </motion.h2>
          <motion.div
            className="bg-white rounded-lg shadow p-6 space-y-4"
            variants={itemVariants}
          >
            <div className="flex items-center text-gray-700 hover:text-red-600 transition duration-300">
              <FaMapMarkerAlt className="text-red-600 mr-4 text-lg" />
              <span className="text-sm">346 Beersbridge Rd, Belfast</span>
            </div>
            <div className="flex items-center text-gray-700 hover:text-red-600 transition duration-300">
              <FaPhoneAlt className="text-red-600 mr-4 text-lg" />
              <span className="text-sm">02890202800</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RestaurantInfo;
