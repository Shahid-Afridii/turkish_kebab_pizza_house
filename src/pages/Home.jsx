import React from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/HomeBlocks/Banner';
import Search from '../components/HomeBlocks/Search';
import Categories from '../components/HomeBlocks/Categories';
import Products from '../components/HomeBlocks/Products';

const Home = () => {
  return (
    <div className="relative">
      {/* Banner Section */}
      <div className="relative">
        <Banner />
      </div>

      {/* Sticky Search Section */}
      <motion.div
        className="sticky top-0 z-50 bg-gray-50 "
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <Search />
      </motion.div>

      {/* Sticky Categories Section */}
      <motion.div
        className=""
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.2 }}
      >
        <Categories />
      </motion.div>

      {/* Products Section with Blur */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Products />
      </motion.div>
    </div>
  );
};

export default Home;
