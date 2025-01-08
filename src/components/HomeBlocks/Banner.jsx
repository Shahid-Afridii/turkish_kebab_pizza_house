import React from "react";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fullscreen Responsive Image */}
      <motion.img
        src="/src/assets/Banner image 4 1.png" // Replace with your image path
        alt="Pizza"
        className="absolute top-0 left-0 w-full h-full"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Left-Side Content */}
      <div className="absolute inset-0 flex items-center justify-start  xl:px-12">
        <motion.div
          className="xl:p-8 rounded-lg space-y-4 max-w-xs md:max-w-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
         <motion.h1
  className="text-[40px] leading-[44.91px] font-['Noto_Sans'] font-normal"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.8 }}
>
  Taste the <br />
  <span className="font-bold">Best Kebab & Pizza!</span>
</motion.h1>


          {/* Subtext */}
          <motion.p
            className="text-sm md:text-base leading-5 md:leading-6 text-gray-600"
            style={{ fontFamily: "'Noto Sans', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Where two culinary traditions meet perfection.
          </motion.p>

          {/* Discount and Delivery */}
          <motion.p
            className="text-[30px] leading-[45px] text-gray-800 font-['Montserrat_Alternates']"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Get <span className="text-red-500 font-[600]">10% discount</span> on order above{" "}
            <span className="font-[600]">£16</span>
          </motion.p>

          {/* Delivery Info */}
          <motion.div
            className="inline-flex items-center bg-orange-100 px-4 py-2 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <img
              src="/src/assets/delivery.png" // Replace with your PNG file path
              alt="Delivery Icon"
              className="w-5 h-5"
            />
            <span className="ml-2 text-sm md:text-base text-orange-600 font-bold">
              Delivery Time 30 min
            </span>
          </motion.div>
          <br />

          {/* Button */}
          <motion.button
            className="button-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            Check our Menu
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
