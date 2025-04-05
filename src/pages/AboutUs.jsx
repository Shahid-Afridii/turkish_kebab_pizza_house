import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1], // smoother in-out curve
        when: 'beforeChildren',
        staggerChildren: 0.12,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.42, 0, 0.58, 1],
      },
    },
  };
  
  
const AboutUs = () => {
  return (
    <motion.div  className="px-4 md:px-8 lg:px-16 py-10 max-w-screen-xl mx-auto"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={containerVariants}>
      <motion.h1   className="text-2xl md:text-3xl font-bold text-primary mb-8"
        variants={itemVariants}>About Us</motion.h1>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800"        variants={containerVariants}
      >
        {/* Column 1 */}
        <motion.div variants={itemVariants}>
          <h2 className="font-semibold text-lg mb-2">
            Menu Turkish Kebab Pizza House Belfast
          </h2>
          <p className="text-sm leading-relaxed text-justify">
            When you fancy a delicious Kebab & Pizza, we think you should come by us at Turkish Kebab Pizza House.
            Our well-assorted menu allows you to put together the exact meal you crave. For example, you could start
            with one of our delicious Sundries, all of which make sure your meal starts well. Once you have eaten
            your starter, we have a large selection of delicious Kebabs. You can choose to mix and match from our
            extensive menu or choose a selected Meal Deal! There are options for dining alone or creating a feast
            for multiple people. We also have Special Offers. If you need a light and delicious lunch, we also offer
            lunch menu options that you will definitely love! We also offer delicious Pizza, Burgers, Kids Meals!
            Our delicious Italian Hot Pizza is a sure favourite, and so is our famous Steak Kebab! We've got something
            we know you'll love.
          </p>
        </motion.div>

        {/* Column 2 */}
        <motion.div variants={itemVariants}>
          <h2 className="font-semibold text-lg mb-2">
            About Turkish Kebab Pizza House Belfast
          </h2>
          <p className="text-sm leading-relaxed text-justify">
            At Turkish Kebab Pizza House we love Kebab & Pizza, and always do our best to show you some of the best
            of what Kebab or Pizza has to offer. We always work with Fresh, high-quality ingredients so that your
            taste buds are truly pampered. We love to treat our customers with an exquisite dining experience,
            with speedy preparation and cooking, so you do not have to sit and wait for your food. Create an order
            easily and quickly via our website or make it even easier for yourself by downloading our free app via
            the App Store or Google Play. Then at the tap of a button you can send an order to us immediately.
          </p>
        </motion.div>

        {/* Column 3 */}
        <motion.div variants={itemVariants}>
          <h2 className="font-semibold text-lg mb-2">
            Restaurant location Turkish Kebab Pizza House Belfast
          </h2>
          <p className="text-sm leading-relaxed text-justify">
            When you have decided what you want to eat, you will find us at the address 346 Beersbridge Rd,
            Belfast BT5 5DY. We always look forward to seeing you in the restaurant when you pick up your food!
            Should you one day be in doubt about our address or our opening hours, remember that all information
            can be found in our app. The app can be downloaded from the App Store and Google Play, and ensures that
            you are never more than a few clicks away from our delicious food. We hope to see you soon!
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AboutUs;
