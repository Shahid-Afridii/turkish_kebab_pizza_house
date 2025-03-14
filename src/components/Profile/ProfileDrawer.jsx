import React, { useState,useEffect,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEdit, FaSignOutAlt,FaPlus, } from "react-icons/fa";
import { FiUser,FiShoppingBag, FiMail, FiPhone, FiMapPin,FiMoreVertical,FiEdit,FiTrash2  } from "react-icons/fi";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAddresses, deleteAddress,addAddress } from "../../redux/slices/userAddressSlice";
import CustomPopup from "../../components/CustomPopup";

const drawerVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 15 },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3 } },
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

const ProfileDrawer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("orders");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    phone: "",
  });
   // ✅ State for validation errors
   const [errors, setErrors] = useState({});
   const [selectedAddressId, setSelectedAddressId] = useState(null);

  // State for custom popup
   const [isPopupOpen, setPopupOpen] = useState(false);
   const [popupConfig, setPopupConfig] = useState({});
  const dispatch = useDispatch();

  const openPopup = (config) => {
    setPopupConfig(config);
    setPopupOpen(true);
  };
  
  // Update the closePopup function to handle redirection
  const closePopup = () => {
    setPopupOpen(false);
    if (popupConfig.redirectOnClose) {
      router.push(popupConfig.redirectOnClose);
    }
  };
  // **Get user data from Redux store**
  const { user } = useSelector((state) => state.auth);
  // ✅ Static User Data
//   const user = {
//     name: "Suresh",
//     email: "mail@gmail.com",
//     phone: "+44 117 2345678",
//   };
  // const addresses = [
  //   { id: 1, title: "Home", address: "1111 Brookvale Ave, BT15 3AR", isPrimary: true },
  //   { id: 2, title: "Office", address: "2534 Brookvale Ave, BT15 3AR" },
  //   { id: 3, title: "Friends Home", address: "3321 Brookvale Ave, BT15 3AR" },
  // ];
  const { addresses, isLoading } = useSelector((state) => state.userAddress);
   // ✅ Validation Function
   const validateForm = () => {
    let newErrors = {};
  
    if (!newAddress.name.trim()) newErrors.name = "Name is required.";
    if (!newAddress.address.trim()) newErrors.address = "Address is required.";
    if (!newAddress.city.trim()) newErrors.city = "City is required.";
    if (!newAddress.country.trim()) newErrors.country = "Country is required.";
  
    // ✅ Phone Validation (Ensure Exactly 10 Digits)
    if (!newAddress.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(newAddress.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
  
    // ✅ Pincode Validation (Ensure Exactly 6 Digits)
    if (!newAddress.pincode.trim()) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(newAddress.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit pincode.";
    }
  
    setErrors(newErrors);
  
    // ✅ Only return TRUE if no errors exist
    return Object.keys(newErrors).length === 0;
  };
  
console.log("errors", errors);  
const handleChange = (e) => {
  const { name, value } = e.target;
  setNewAddress({ ...newAddress, [name]: value });

  setErrors((prevErrors) => {
    let newErrors = { ...prevErrors };

    // ✅ Remove error dynamically when corrected
    if (name === "phone" && /^\d{10}$/.test(value.trim())) {
      delete newErrors.phone;
    }
    if (name === "pincode" && /^\d{6}$/.test(value.trim())) {
      delete newErrors.pincode;
    }
    if (value.trim()) {
      delete newErrors[name]; // ✅ Remove other errors if input is valid
    }

    return newErrors;
  });
};


   // ✅ Handle Submit with Validation
   const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      openPopup({
        type: "error",
        title: "Error",
        subText: "Please correct the errors before submitting.",
        onClose: closePopup,
        autoClose: 2,
        showConfirmButton: false,
        showCancelButton: false,
      });
      return;
    }

    dispatch(addAddress(newAddress))
      .unwrap()
      .then(() => {
        openPopup({
          type: "success",
          title: "Success",
          subText: "Address added successfully!",
          onClose: closePopup,
          autoClose: 2,
          showConfirmButton: false,
          showCancelButton: false,
        });
        setNewAddress({
          name: "",
          address: "",
          city: "",
          country: "",
          pincode: "",
          phone: "",
        });
        setShowAddForm(false);
      })
      .catch((error) => {
        openPopup({
          type: "error",
          title: "Error",
          subText: error || "Failed to add address.",
          onClose: closePopup,
          autoClose: 2,
          showConfirmButton: false,
          showCancelButton: false,
        });
      });
  };
 
  const handleDeleteAddress = (addressId) => {
    setSelectedAddressId(addressId); // ✅ Store selected address ID
  
    openPopup({
      type: "warning",
      title: "Delete Address",
      subText: "Are you sure you want to delete this address?",
      confirmLabel: "Yes, Delete",
      cancelLabel: "Cancel",
      showConfirmButton: true,
      showCancelButton: true,
      showCloseIcon: false, // Prevent accidental closure
  
      onConfirm: async () => {
        try {
          // ✅ Ensure the API call runs and is awaited
          const response = await dispatch(deleteAddress(addressId)).unwrap();
  
          if (response) {
            openPopup({
              type: "success",
              title: "Deleted!",
              subText: "Address has been deleted successfully.",
              showConfirmButton: false,
              showCancelButton: false,
              autoClose: 2,
              onClose: closePopup, // Ensure popup closes properly after success
            });
          } else {
            throw new Error("Failed to delete address.");
          }
        } catch (error) {
          openPopup({
            type: "error",
            title: "Error!",
            subText: error.message || "Failed to delete address.",
            onClose: closePopup, // Ensure popup closes properly on failure
            autoClose: 3,
          });
        }
      },
      onClose: closePopup, // Ensure proper handling of closing
    });
  };
  
  

  

  
  
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);
  // ✅ Static Order History (Precise Fix)
  // const orders = [
  //   {
  //     id: 1,
  //     title: "Pizza Meal For 2 (12”)",
  //     toppings: "Ham, Pineapple",
  //     dip: "Curry",
  //     drinks: "1 Coca Cola, 1 Diet Coke",
  //     date: "5th Nov 2024",
  //     time: "18:45 PM",
  //     status: "Home",
  //     image: "/static/pizza1.jpg",
  //     trackOrder: true,
  //     deliveryDate: "5th Nov, 18:45 PM",
  //   },
  //   {
  //     id: 2,
  //     title: "Pizza Meal For 2 (12”)",
  //     toppings: "Ham, Pineapple",
  //     dip: "Curry",
  //     drinks: "1 Coca Cola, 1 Diet Coke",
  //     date: "31st Oct 2024",
  //     image: "/static/pizza2.jpg",
  //     reorder: true,
  //     rateOrder: true,
  //   },
  // ];
  const orders=[];
  const [showOptions, setShowOptions] = useState(null);
  const dropdownRef = useRef(null);
const handleLogout = () => {
  dispatch(logout());  // ✅ Clear authentication state
  dispatch(clearCart()); // ✅ Clear cart data
  onClose(); 
  navigate("/"); // ✅ Redirect to home page
};
const toggleOptions = (addressId) => {
  setShowOptions(showOptions === addressId ? null : addressId);
};
// ✅ Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-[9998] backdrop-blur-md"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 w-full max-w-lg h-full bg-white z-[9999] shadow-lg flex flex-col overflow-hidden rounded-lg"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
           {/* ✅ Header with Background Pattern */}
             {/* **Header with Background Pattern** */}
              {/* **Header with Background (FIXED HEIGHT)** */}
              <div className="relative w-full rounded-lg overflow-hidden">
      {/* **Header Section with Background** */}
      <div className="relative h-[130px] bg-gray-100">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/profilebg.png')" }}
        ></div>

        {/* **Close Button** */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
        >
          <FaTimes size={16} />
        </button>
      </div>

      {/* **User Profile Section** */}
      <div className="relative flex flex-col items-center -mt-12">
        {/* **Profile Image** */}
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
          <FiUser size={36} className="text-gray-600" />
        </div>

        {/* **User Details** */}
        <h2 className="text-xl font-bold text-gray-800 mt-2">{user.name}</h2>
        <div className="p-2 flex flex-wrap justify-center text-gray-600 text-sm mt-2 gap-x-6 gap-y-2 w-full">
  {/* Phone Number */}
  <div className="flex items-center space-x-2 w-full md:w-auto">
    <FiPhone className="text-gray-600 text-lg" />
    <span className="break-all">{user.mobile}</span>
  </div>

  {/* Email */}
  <div className="flex items-center space-x-2 w-full md:w-auto">
    <FiMail className="text-gray-600 text-lg" />
    <span className="break-all">{user.email}</span>
  </div>
</div>


      </div>

      {/* **Buttons Section** */}
      <div className="mt-4 flex justify-center space-x-4 px-6 pb-4">
        <button onClick={handleLogout} className="flex items-center bg-red-500 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-600 shadow-md">
          <FaSignOutAlt className="mr-2" /> Sign-out
        </button>
        <button className="flex items-center border border-red-500 text-red-500 px-5 py-2 rounded-md text-sm font-semibold bg-red-100 hover:bg-red-200 shadow-md">
          <FaEdit className="mr-2" /> Edit
        </button>
      </div>
    </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-1/2 py-3 text-center text-sm font-medium ${
                  activeTab === "orders" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-1/2 py-3 text-center text-sm font-medium ${
                  activeTab === "addresses" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600"
                }`}
              >
                Address
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === "orders" ? (
               <div className="flex flex-col space-y-4">
               {orders.length === 0 ? (
  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
    <FiShoppingBag className="text-3xl text-gray-400 mb-2" />
    <p className="text-sm">No orders available</p>
  </div>
) : (
  orders.map((order) => (
    <div key={order.id} className="border-b pb-4">
      {/* **Order Container (Responsive Flex)** */}
      <div className="flex flex-col md:flex-row items-start md:items-center">
        
        {/* Order Image (Ensures it stays properly aligned) */}
        <img src={order.image} alt={order.title} className="w-16 h-16 md:w-20 md:h-20 rounded-md object-cover" />
        
        {/* Order Details */}
        <div className="mt-2 md:mt-0 md:ml-4 flex-1">
          {/* Title & Date in Same Row on Desktop, Stacked on Mobile */}
          <div className="flex flex-col md:flex-row justify-between">
            <h4 className="text-sm font-semibold">{order.title}</h4>
            <span className="text-xs font-semibold text-gray-600">{order.date}</span>
          </div>

          {/* Order Description */}
          <p className="text-xs text-gray-600 leading-tight mt-1">
            <strong>Toppings:</strong> {order.toppings} | <strong>Dip:</strong> {order.dip} <br />
            <strong>Drinks:</strong> {order.drinks}
          </p>

          {/* **Track Order & Delivery Date (Responsive Alignment)** */}
          {order.trackOrder && (
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mt-2 space-y-2 md:space-y-0">
              
              {/* Track Order Button */}
              <button className="text-xs border px-3 py-1 rounded-md text-red-500 border-red-500">
                Track Order
              </button>

              {/* Delivery Info */}
              <div className="flex items-center text-xs font-medium text-gray-800">
                <span className="mr-1">Delivery:</span> {order.deliveryDate}
                <FiMapPin className="ml-2 text-red-500" />
                <span className="ml-1 text-red-500 font-medium">{order.status}</span>
              </div>
            </div>
          )}

          {/* **Reorder & Rate Order (Proper Spacing on Mobile)** */}
          {order.reorder && (
            <div className="flex flex-row md:flex-row md:justify-start space-x-2 mt-2">
              <button className="text-xs md:text-xs px-3 py-1 border rounded-md bg-gray-200 text-gray-800 w-1/2 md:w-auto">
                REORDER
              </button>
              <button className="text-xs md:text-xs px-3 py-1 border rounded-md text-red-500 border-red-500 w-1/2 md:w-auto">
                RATE ORDER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  ))
)}
             </div>
             
              ) : (
                <div className="">
 {addresses.length > 0 ? (
  addresses.map((item) => (
    <div key={item.address_id} className="flex justify-between items-center border-b pb-4 mb-4">
      
      {/* **Address Details (Single Line Layout) ** */}
      <div className="flex flex-wrap items-center space-x-2 text-sm md:text-base text-gray-700 w-full">
        <span className="font-semibold">{item.name},</span>
        <span>{item.phone},</span>
        <span>{item.address},</span>
        <span>{item.city},</span>
      
        <span>{item.country},</span>
        <span className="font-semibold">{item.pincode}</span>

        {/* **Primary Address Badge** */}
        {item.isPrimary && (
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-md ml-2">
            Primary
          </span>
        )}
      </div>

   {/* Dropdown Menu Button */}
   <button onClick={() => toggleOptions(item.address_id)} className="relative z-20">
        <FiMoreVertical className="text-gray-500 text-lg" />
      </button>

      {/* Dropdown Menu (Appears Next to Each Address) */}
      {showOptions === item.address_id && (
        <div ref={dropdownRef} className=" bg-white shadow-md rounded-md py-2 w-36 md:w-48 border z-30">
          <button className="flex items-center px-3 py-1 text-xs md:text-sm hover:bg-gray-100 w-full">
            <FiEdit className="mr-2 text-gray-600" /> Edit
          </button>
          <button   onClick={() => handleDeleteAddress(item.address_id)}
 className="flex items-center px-3 py-1 text-xs md:text-sm text-red-500 hover:bg-gray-100 w-full">
            <FiTrash2 className="mr-2" /> Delete
          </button>
          {!item.isPrimary && (
            <button className="flex items-center px-3 py-1 text-xs md:text-sm text-blue-600 font-semibold hover:bg-gray-100 w-full">
              Set as Primary
            </button>
          )}
        </div>
      )}
 
    </div>
  ))
) : (
  // No addresses available UI
  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
    <FiMapPin className="text-3xl text-gray-400 mb-2" />
    <p className="text-sm">No addresses available</p>
  </div>
)}


  {/* **Add Address Button (Smaller on Mobile)** */}
  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600 flex items-center"
                    >
                      <FaPlus className="mr-2" /> Add Address
                    </button>
                  </div>

     {/* Address Form (Hidden until clicked) */}
     <AnimatePresence>
                {showAddForm && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-4 p-4 border rounded-lg bg-gray-100">
                    <h3 className="text-lg font-semibold mb-2">New Address</h3>
                    <form onSubmit={handleSubmit} className="grid gap-3">
                      {Object.keys(newAddress).map((field) => (
                        <div key={field}>
                          <input
                            type="text"
                            name={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={newAddress[field]}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                          {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
                        </div>
                      ))}
                   <button
  type="submit"
  disabled={
    isLoading || 
    Object.keys(errors).length > 0 ||  // ✅ Ensure no validation errors
    Object.values(newAddress).some(value => value.trim() === "") // ✅ Ensure all fields are filled
  }
  className={`w-full px-4 py-2 rounded-md font-semibold transition 
    ${isLoading || Object.keys(errors).length > 0 || Object.values(newAddress).some(value => value.trim() === "")
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-red-500 text-white hover:bg-red-600"}
  `}
>
  {isLoading ? "Saving..." : "Save Address"}
</button>


                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
 
</div>

              )}
            </div>
          </motion.div>
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
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDrawer;
