import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCart,updateQuantity, removeFromCart } from "../redux/slices/cartSlice";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaChevronDown,
  FaChevronUp,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import AccountSection from "../components/Checkout/AccountSection";
import DeliveryPickupSection from "../components/Checkout/DeliveryPickupSection";
import PaymentSection from "../components/Checkout/PaymentSection";
import OrderStatus from "../components/order/OrderStatus";
import withErrorBoundary from "../components/ErrorBoundary/withErrorBoundary"; // Import HOC
import { formatPrice } from "../utils/formatPrice";
import CustomPopup from "../components/CustomPopup";
import Login from "../pages/Login";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount) || 0; //
  const cartFetched = useSelector((state) => state.cart.cartFetched); // ✅ Track API call status
  const taxAmount = useSelector((state) => state.cart.taxAmount);
  const taxableAmount = useSelector((state) => state.cart.taxableAmount);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // ✅ Track login modal state
  const navigate = useNavigate(); // ✅ Initialize navigation

// State for custom popup
 const [isPopupOpen, setPopupOpen] = useState(false);
 const [popupConfig, setPopupConfig] = useState({});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(1);
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const openPopup = (config) => {
    setPopupConfig(config);
    setPopupOpen(true);
  };
  
  // Update the closePopup function to handle redirection
  
// ✅ Updated closePopup function
const closePopup = () => {
  setPopupOpen(false);
  if (popupConfig.onClose) {
    setTimeout(() => popupConfig.onClose(), 500); // ✅ Delay ensures state updates correctly
  }
};
 


  useEffect(() => {
    if (!cartFetched) {
      dispatch(getCart());
    }
  }, [dispatch, cartFetched]); // ✅ Remove cartItems.length dependency
  
  

    // Scroll to top when navigating to this page
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    const handlePaymentCompletion = () => {
      setPaymentCompleted(true);
    };
    useEffect(() => {
      if (!isAuthenticated) {
        openPopup({
          type: "error",
          title: "Login Required",
          subText: "You need to log in to proceed to checkout.",
          onClose: () => {
            setTimeout(() => setIsLoginModalOpen(true), 800); // ✅ Open login modal after redirect
            navigate("/"); // ✅ Redirect to home page
          },          autoClose: 2,
          showConfirmButton: false,
          showCancelButton: false,
        });
      }
    }, [isAuthenticated]);
    
   
  return (
    <div className="container mx-auto p-2 lg:p-0 bg-gray-50 min-h-screen">
      <h1 className="text-md md:text-xl font-bold mb-8 text-center text-gray-800">
        Check-Out
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
        <div className={`bg-white rounded-lg shadow-md ${activeAccordion === 1 ? "p-6" : "p-4"}`}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleAccordion(1)}
            >
              <div className="flex items-center gap-4">
                <FaUser className="text-primary w-5 h-5 md:w-6 md:h-6" />
                <h2 className="text-sm md:text-md lg:text-lg  font-semibold">Account</h2>
              </div>
              {activeAccordion === 1 ? (
                <FaChevronUp className="text-primary" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </div>
            {activeAccordion === 1 && <AccountSection />}
          </div>

      
         {/* Delivery/Pick-up Section */}
         <div className={`bg-white rounded-lg shadow-md ${activeAccordion === 2 ? "p-6" : "p-4"}`}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleAccordion(2)}
            >
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-primary w-5 h-5 md:w-6 md:h-6" />
                <h2 className="text-sm md:text-md lg:text-lg font-semibold">Delivery/Pick-up</h2>
              </div>
              {activeAccordion === 2 ? (
                <FaChevronUp className="text-primary" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </div>
            {activeAccordion === 2 && <DeliveryPickupSection />}
          </div>

          {/* Payment Section */}
          <div className={`bg-white rounded-lg shadow-md ${activeAccordion === 3 ? "p-6" : "p-4"}`}>
  <div
    className="flex items-center justify-between cursor-pointer"
    onClick={() => toggleAccordion(3)}
  >
    <div className="flex items-center gap-4">
      <FaCreditCard className="text-primary w-5 h-5 md:w-6 md:h-6" />
      <h2 className="text-sm md:text-md lg:text-lg font-semibold">Payment</h2>
    </div>
    {activeAccordion === 3 ? (
      <FaChevronUp className="text-primary" />
    ) : (
      <FaChevronDown className="text-gray-600" />
    )}
  </div>
  {activeAccordion === 3 && <PaymentSection />}
</div>
        </div>

        {/* Right Section */}
        <div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-sm md:text-lg font-semibold mb-4">Items in your cart</h2>
        <div className="flex-grow overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
    <ul className="space-y-4">
      {cartItems.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between border-b pb-4"
        >
          {/* Product Image */}
          <img
  src={item.image ? `${IMAGE_URL}${item.image}` : "/assets/noimage.png"}
  alt={item.name}
  className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg transition-opacity duration-500 opacity-0"
  onLoad={(e) => e.target.classList.remove("opacity-0")}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/assets/noimage.png";
  }}
/>


          {/* Product Details */}
          <div className="flex-1 ml-3">
            <h4 className="font-semibold text-xs md:text-sm">{item.name}</h4>
            <div className="text-xs text-gray-500 space-y-1">
             {/* Add-on Items */}
             {item.add_on_items.length > 0 && (
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Add-ons:</span>{" "}
                        {item.add_on_items.map((addOn) => `${addOn.name} (£${addOn.price})`).join(", ")}
                      </p>
                    )}
           
             
              {/* Fallback to Description */}
              {!item.toppings?.length &&
                !item.dips?.length &&
                !item.drinks?.length && (
                  <p className="line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>

          {/* Quantity Buttons */}
          <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        if (item.qty > 1) {
                          dispatch(updateQuantity({ menu_item_id: item.menu_item_id, quantity: item.qty - 1 }));
                        } else {
                          dispatch(removeFromCart({ menu_item_id: item.menu_item_id }));
                        }
                      }}
                      className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="px-2 py-1 text-xs md:text-sm font-medium text-gray-800 bg-gray-100 rounded-md border border-gray-300">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => dispatch(updateQuantity({ menu_item_id: item.menu_item_id, quantity: item.qty + 1 }))}
                      className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
        </li>
      ))}
    </ul>
</div>
  </div>

  <div className="bg-white rounded-lg shadow p-4 mt-4 md:mt-6">
    <h2 className="text-sm md:text-lg font-semibold mb-4">Order Summary</h2>
    <div className="flex justify-between text-xs md:text-sm mb-2">
      <span>Item Total</span>
      <span>{formatPrice(taxableAmount) || 0}</span>
      </div>
    <div className="flex justify-between text-xs md:text-sm mb-4">
      <span>Service Fee</span>
      <span>{formatPrice(taxAmount) || 0} </span>
    </div>
    <div className="flex justify-between text-sm md:text-lg font-bold">
      <span>TO PAY</span>
      <span>{formatPrice(totalAmount)}</span>
      </div>
  </div>
</div>

{paymentCompleted && <OrderStatus isVisible={true} onClose={() => setPaymentCompleted(false)} orderStatus="preparing" />}


      </div>
      <CustomPopup
        isOpen={isPopupOpen}
        type={popupConfig.type}
        title={popupConfig.title}
        subText={popupConfig.subText}
        onConfirm={closePopup}
        onClose={closePopup}
        autoClose={popupConfig.autoClose}
        confirmLabel={popupConfig.confirmLabel}
        cancelLabel={popupConfig.cancelLabel}
        showConfirmButton={popupConfig.showConfirmButton}
        showCancelButton={popupConfig.showCancelButton}
        showCloseIcon={popupConfig.showCloseIcon}
      />
<Login isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />      
    </div>
  );
};

export default withErrorBoundary(Checkout);
