import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const NotFound = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center bg-white text-center p-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.img
        src="https://ik.imagekit.io/efvdt4rto0b/website-under-construction-concept-showing-404-message-internet-connection-problem-network-error-404-server-error-perfect-for-landing-pages-ui-web-apps-editorial-flyers-and-banners-vector%20(1)_1wqQ7d6N4v.jpg?updatedAt=1743400274886"
        alt="404 - Not Found"
        className="w-full max-w-md mb-4"
        variants={item}
      />

      <motion.h1
        className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2"
        variants={item}
      >
        Page Not Found
      </motion.h1>

      <motion.p
        className="mb-6 text-gray-500 text-sm sm:text-base"
        variants={item}
      >
        Oops! The page you're looking for doesn't exist or has been moved.
      </motion.p>

      <motion.div variants={item}>
        <Link to="/" aria-label='Back to Home'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            aria-label='Back to Home'
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-primary text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:bg-opacity-90 text-sm sm:text-base"
          >
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
