import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice";
import { FaUser, FaMapMarkerAlt, FaCreditCard, FaChevronDown, FaChevronUp, FaMinus, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const buttonVariants = {
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
};

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.price.replace("£", "")) * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold mb-8">Check-Out</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Section */}
          <div className="bg-white rounded-lg shadow">
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer"
              onClick={() => toggleAccordion(1)}
            >
              <div className="flex items-center gap-4">
                <FaUser className="text-gray-500 w-6 h-6" />
                <h2 className="text-lg font-semibold">Account</h2>
              </div>
              {activeAccordion === 1 ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {activeAccordion === 1 && (
              <div className="px-6 py-4 border-t">
                <p className="text-sm text-gray-600 mb-4">Login with your mobile number</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="flex items-center border rounded-lg px-4 py-2">
                    <img
                      src="https://flagcdn.com/w40/gb.png"
                      alt="UK Flag"
                      className="w-5 h-5 mr-2"
                    />
                    <input
                      type="text"
                      placeholder="117 2345678"
                      className="flex-1 outline-none text-sm"
                    />
                    <button className="ml-4 bg-red-500 text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-red-600">
                      Send OTP
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery/Pick-up Section */}
          <div className="bg-white rounded-lg shadow">
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer"
              onClick={() => toggleAccordion(2)}
            >
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-gray-500 w-6 h-6" />
                <h2 className="text-lg font-semibold">Delivery/Pick-up</h2>
              </div>
              {activeAccordion === 2 ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {activeAccordion === 2 && (
              <div className="px-6 py-4 border-t">
                <p className="text-sm text-gray-600">
                  Select your preferred delivery or pick-up option.
                </p>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow">
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer"
              onClick={() => toggleAccordion(3)}
            >
              <div className="flex items-center gap-4">
                <FaCreditCard className="text-gray-500 w-6 h-6" />
                <h2 className="text-lg font-semibold">Payment</h2>
              </div>
              {activeAccordion === 3 ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {activeAccordion === 3 && (
              <div className="px-6 py-4 border-t">
                <p className="text-sm text-gray-600">Choose your payment method.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Items in your cart</h2>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  {/* Product Image */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  {/* Product Details */}
                  <div className="flex-1 ml-4">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      Toppings: {item.toppings?.join(", ") || "None"}
                    </p>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="flex items-center space-x-2">
                  <motion.button
  onClick={() => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCart({ id: item.id }));
    }
  }}
  className="w-6 h-6 bg-red-500 text-white rounded-full shadow-md flex items-center justify-center hover:bg-red-600 transition-transform active:scale-95"
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
>
  <FaMinus size={10} />
</motion.button>

<motion.span
  className="px-2 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-md border border-gray-300"
>
  {item.quantity}
</motion.span>

<motion.button
  onClick={() =>
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
  }
  className="w-6 h-6 bg-red-500 text-white rounded-full shadow-md flex items-center justify-center hover:bg-red-600 transition-transform active:scale-95"
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
>
  <FaPlus size={10} />
</motion.button>

                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Item Total</span>
              <span>£{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Service Fee</span>
              <span>£0.50</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>TO PAY</span>
              <span>£{(totalPrice + 0.5).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
