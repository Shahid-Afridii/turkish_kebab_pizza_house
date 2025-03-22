import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCart,updateQuantity,removeCartItem} from "../redux/slices/cartSlice";
import { submitOrder } from "../redux/slices/orderSlice"; // Import API call
import { getAddresses } from "../redux/slices/userAddressSlice"; // Fetch addresses
import { clearCart } from "../redux/slices/cartSlice"; // ✅ Import clearCart

import {
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaChevronDown,
  FaChevronUp,
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingCart,
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
  console.log("totalAmount", totalAmount);
  const cartFetched = useSelector((state) => state.cart.cartFetched); // ✅ Track API call status
  const taxAmount = useSelector((state) => state.cart.taxAmount);
  const taxableAmount = useSelector((state) => state.cart.taxableAmount);

  // ✅ Fetch from LocalStorage (For Guests)
  const [localCartItems, setLocalCartItems] = useState([]);
  const [localTotalAmount, setLocalTotalAmount] = useState(0);
  const [localTaxAmount, setLocalTaxAmount] = useState(0);
  const [localTaxableAmount, setLocalTaxableAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Loading state for payment processing


   // ✅ Dynamic state for order
   const [selectedMode, setSelectedMode] = useState("delivery"); // Default to delivery
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Store payment mode
   const [selectedAddress, setSelectedAddress] = useState(1); // Default address (Make this dynamic)
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { addresses, selectedAddressId, isLoading: isAddressLoading } = useSelector((state) => state.userAddress);
  const [itemToRemove, setItemToRemove] = useState(null);

  const { isLoading, error } = useSelector((state) => state.order);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // ✅ Track login modal state
  const navigate = useNavigate(); // ✅ Initialize navigation

// State for custom popup
 const [isPopupOpen, setPopupOpen] = useState(false);
 const [popupConfig, setPopupConfig] = useState({});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(1);
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
console.log("isAuthenticated", isAuthenticated);
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };
console.log("selectedAddress", selectedAddressId);
console.log("First Address ID:", selectedAddressId);

// ✅ Fetch Cart: API for Authenticated | LocalStorage for Guests
const loadLocalCart = () => {
  if (!isAuthenticated) {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setLocalCartItems(storedCart);

    // ✅ Calculate totals dynamically
    const total = storedCart.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0);
    const tax = total * 0.05; // Example tax calculation (5%)
    const taxable = total - tax;

    setLocalTotalAmount(total);
    setLocalTaxAmount(tax);
    setLocalTaxableAmount(taxable);
  }
};

useEffect(() => {
  if (isAuthenticated) {
    if (!cartFetched) {
      dispatch(getCart());
    }
  } else {
    loadLocalCart();
  }

  window.addEventListener("storage", loadLocalCart);
  return () => {
    window.removeEventListener("storage", loadLocalCart);
  };
}, [isAuthenticated, dispatch, cartFetched]);
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
 
  // ✅ Fetch addresses on component mount
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

   // ✅ Set the first address dynamically when addresses are fetched
useEffect(() => {
  if (selectedAddressId !== null) {
    setSelectedAddress(selectedAddressId);
  }
}, [selectedAddressId]);

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
  
// ✅ Function to remove item from localStorage for guests
const handleRemoveLocalItem = (itemId) => {
  
    const updatedCart = localCartItems.filter((item) => item.menu_item_id !== itemId);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    loadLocalCart();
  
};

// ✅ Function to update quantity in localStorage for guests
const handleUpdateLocalQuantity = (itemId, newQuantity) => {
  if (!isAuthenticated) {
    const updatedCart = localCartItems.map((item) =>
      item.menu_item_id === itemId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    loadLocalCart();
  } else {
    dispatch(updateQuantity({ menu_item_id: itemId, quantity: newQuantity }));
  }
};

      // ✅ Open Confirmation Popup
 // ✅ Open Confirmation Popup
const openDeletePopup = (item) => {
  console.log(item, "item");

  setPopupConfig({
    type: "warning",
    title: "Remove Item",
    subText: `Are you sure you want to remove ${item.name} from the cart?`,
    confirmLabel: "Yes, Remove",
    cancelLabel: "Cancel",
    showConfirmButton: true,
    showCancelButton: true,
    onConfirm: () => handleRemoveItem(item), // ✅ Pass function reference instead of calling it
  });

  setPopupOpen(true);
};

// ✅ Handle Remove Item
const handleRemoveItem = async (item) => {
  try {
    await dispatch(removeCartItem(item.cart_id)).unwrap();
    
    // ✅ Show Success Popup
    setPopupConfig({
      type: "success",
      title: "Removed",
      subText: "Item removed from the cart successfully!",
      autoClose: 2,
      showConfirmButton: false,
      showCancelButton: false,
    });
  } catch (err) {
    // ✅ Show Error Popup
    setPopupConfig({
      type: "error",
      title: "Failed to Remove",
      subText: err?.message || "Could not remove the item from cart.",
      autoClose: 3,
      showConfirmButton: false,
      showCancelButton: false,
    });
  }

  setPopupOpen(true);
};

    const handleOrderSubmit = async () => {
      setPopupOpen(false); // Close popup before submission
      
      const orderData = {
        address_id: selectedAddress, // Make sure this comes dynamically
        mode: selectedMode,
        payment_mode: selectedPaymentMethod,
      };
  
      try {
        await dispatch(submitOrder(orderData)).unwrap();
        
        // ✅ Show success popup
        setPopupConfig({
          type: "success",
          title: "Order Placed!",
          subText: "Your order has been successfully placed.",
          autoClose: 3,
          showConfirmButton: false,
          showCancelButton: false,
          onClose: () => navigate("/orders"), // Redirect after success
        });
        // ✅ Clear Cart After Successful Order
    dispatch(clearCart());
        setPopupOpen(true);
      } catch (err) {
        // ✅ Show error popup
        setPopupConfig({
          type: "error",
          title: "Order Failed",
          subText: err || "There was an issue placing your order.",
          autoClose: 3,
          showConfirmButton: false,
          showCancelButton: false,
        });
        setPopupOpen(true);
      }
    };
   // ✅ Handle Place Order
 // ✅ Handle Place Order with Loading State
 const handlePlaceOrder = async (paymentMode) => {
  if (!selectedAddress) {
    setPopupConfig({
      type: "error",
      title: "Address Required",
      subText: "Please select an address before placing your order.",
      autoClose: 3,
      showConfirmButton: false,
      showCancelButton: false,
    });
    setPopupOpen(true);
    return;
  }

  setSelectedPaymentMethod(paymentMode);
  setIsProcessing(paymentMode); // ✅ Set loading state for selected payment method

  const orderData = {
    address_id: selectedAddress,
    mode: selectedMode,
    payment_mode: paymentMode, 
  };

  try {
    const resultAction = await dispatch(submitOrder(orderData)); // Get full Redux action object
    console.log("Full Action Response:", resultAction); // Debugging log
    if (submitOrder.fulfilled.match(resultAction)) {
      const response = resultAction.payload; // ✅ Extract the actual payload
      console.log("Extracted Response Payload:", response);

      if (response?.url) {
        window.open(response.url, "_blank"); // ✅ Open Stripe URL in a new tab
        return;
      }
    } else {
      throw new Error(resultAction.payload || "Order submission failed");
    }
    // // ✅ Show success popup
    setPopupConfig({
      type: "success",
      title: "Order Placed!",
      subText: "Your order has been successfully placed.",
      autoClose: 3,
      showConfirmButton: false,
      showCancelButton: false,
      onClose: () => navigate("/orders"), 
    });

    // dispatch(clearCart());
    setPopupOpen(true);
  } catch (err) {
    setPopupConfig({
      type: "error",
      title: "Order Failed",
      subText: err || "There was an issue placing your order.",
      autoClose: 3,
      showConfirmButton: false,
      showCancelButton: false,
    });
    setPopupOpen(true);
  } finally {
    setIsProcessing(false); // ✅ Reset loading state after API call completes
  }
};
    // ✅ Open Confirmation Popup
    const openOrderPopup = () => {
      if (!selectedPaymentMethod) {
        setPopupConfig({
          type: "error",
          title: "Payment Method Required",
          subText: "Please select a payment method before placing your order.",
          showConfirmButton: false,
          showCancelButton: false,
          autoClose: 3,
        });
        setPopupOpen(true);
        return;
      }
  
      setPopupConfig({
        type: "warning",
        title: "Confirm Your Order",
        subText: `Are you sure you want to place this order with ${selectedMode} and ${selectedPaymentMethod}?`,
        confirmLabel: "Yes, Place Order",
        cancelLabel: "Cancel",
        showConfirmButton: true,
        showCancelButton: true,
        onConfirm: handleOrderSubmit,
      });
      setPopupOpen(true);
    };
  
    const displayedCartItems = isAuthenticated ? cartItems : localCartItems;
    const displayedTotalAmount = isAuthenticated ? totalAmount : localTotalAmount;
    const displayedTaxAmount = isAuthenticated ? taxAmount : localTaxAmount;
    const displayedTaxableAmount = isAuthenticated ? taxableAmount : localTaxableAmount;
console.log("displayedCartItems", displayedCartItems);
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
         {isAuthenticated &&   <div className={`bg-white rounded-lg shadow-md ${activeAccordion === 2 ? "p-6" : "p-4"}`}>
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
            {activeAccordion === 2 && <DeliveryPickupSection mode={selectedMode} setMode={setSelectedMode} />}
          </div>}
       

          {/* Payment Section */}
          {isAuthenticated &&     <div className={`bg-white rounded-lg shadow-md ${activeAccordion === 3 ? "p-6" : "p-4"}`}>
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
  {activeAccordion === 3 && <PaymentSection
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            handlePlaceOrder={handlePlaceOrder} // ✅ Passing function as prop
            isProcessing={isProcessing} // ✅ Passing loading state

          />}
</div> }
      
{/* Order Button */}
{/* <div className="flex justify-center mt-6">
        <button
          onClick={openOrderPopup}
          className="flex items-center px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90"
          disabled={isLoading}
        >
          <FaShoppingCart className="mr-2" />
          {isLoading ? "Processing..." : "Place Order"}
        </button>
      </div> */}
        </div>

        {/* Right Section */}
        <div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
  <h2 className="text-sm md:text-lg font-semibold mb-4">Items in your cart</h2>
  {displayedCartItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <p className="text-gray-500 mb-4">No items in cart</p>
          <button
            onClick={() => navigate("/")} // Change this based on your router
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Add Products
          </button>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
          <ul className="space-y-4">
            {displayedCartItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b pb-4 relative">
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
                  <h4 className="font-semibold text-xs md:text-sm">
                    {formatPrice(item.price)}
                    <button
  onClick={() => {
    console.log("isAuthenticated", isAuthenticated);
    isAuthenticated == false ? handleRemoveLocalItem(item.menu_item_id) : openDeletePopup(item);
    window.dispatchEvent(new Event("storage")); // 🔥 Forces re-render of BottomCartBar

    // !isAuthenticated ? openDeletePopup(item) : handleRemoveLocalItem(item.menu_item_id);
  }}
  className="ml-2 mb-2 p-2 text-red-500 hover:text-red-700"
>
  <FaTrash size={12} />
</button>

                  </h4>
                  <div className="text-xs text-gray-500 space-y-1">
                    {/* Add-on Items */}
                    {(item.add_on_items || item.addons)?.length > 0 && (
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Add-ons:</span>{" "}
                        {(item.add_on_items || item.addons).map((addOn) => `${addOn.name || addOn.addon_name} (${formatPrice(addOn.addon_price) || formatPrice(addOn.price)})`).join(", ")}
                      </p>
                    )}

                    {/* Description Fallback */}
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
                   onClick={() => handleUpdateLocalQuantity(item.menu_item_id, item.quantity - 1)}
                    className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="px-2 py-1 text-xs md:text-sm font-medium text-gray-800 bg-gray-100 rounded-md border border-gray-300">
                    {item.qty || item.quantity}
                  </span>
                  <button
                   onClick={() => handleUpdateLocalQuantity(item.menu_item_id, item.quantity + 1)}
                    className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
</div>

  <div className="bg-white rounded-lg shadow p-4 mt-4 md:mt-6">
    <h2 className="text-sm md:text-lg font-semibold mb-4">Order Summary</h2>
    <div className="flex justify-between text-xs md:text-sm mb-2">
      <span>Item Total</span>
      <span>{formatPrice(displayedTaxableAmount) || 0}</span>
      </div>
    <div className="flex justify-between text-xs md:text-sm mb-4">
      <span>Service Fee</span>
      <span>{formatPrice(displayedTaxAmount) || 0} </span>
    </div>
    <div className="flex justify-between text-sm md:text-lg font-bold">
      <span>TO PAY</span>
      <span>{formatPrice(displayedTotalAmount)}</span>
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
        onConfirm={popupConfig.onConfirm}
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
