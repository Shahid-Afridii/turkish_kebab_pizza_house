import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddresses, setSelectedAddressId ,addAddress} from "../../redux/slices/userAddressSlice";
import { FaCalendarAlt,FaPlus, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import CustomPopup from "../../components/CustomPopup";

const DeliveryPickupSection = ({ mode, setMode }) => {
  const dispatch = useDispatch();
  const { addresses, selectedAddressId,isLoading } = useSelector((state) => state.userAddress);
  const [showAddForm, setShowAddForm] = useState(false);
// State for custom popup
   const [isPopupOpen, setPopupOpen] = useState(false);
   const [popupConfig, setPopupConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
     const [customType, setCustomType] = useState(""); // State for custom address type
  
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressType, setAddressType] = useState("");
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    phone: "",
    address_type: "home",
  });
  const handleTypeChange = (e) => {
    const value = e.target.value;
    
    // Reset customType when switching back from 'Others'
    if (value !== "others") {
      setCustomType("");
    }
  
    // Update newAddress state correctly
    setNewAddress({ ...newAddress, address_type: value });
  };
  
  
  const handleCustomTypeChange = (e) => {
    setCustomType(e.target.value);
    setNewAddress({ ...newAddress, address_type: e.target.value });
  };
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
  const [errors, setErrors] = useState({});
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);
  const validateForm = () => {
    let newErrors = {};
    if (!newAddress.name.trim()) newErrors.name = "Name is required.";
    if (!newAddress.address.trim()) newErrors.address = "Address is required.";
    if (!newAddress.city.trim()) newErrors.city = "City is required.";
    if (!newAddress.country.trim()) newErrors.country = "Country is required.";
    if (!newAddress.phone.trim() || !/^\d{10}$/.test(newAddress.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
    const postcodeRegex = /^BT(1[0-7]|[1-9])\s?\d[ABDEFGHJLNPQRSTUWXYZ]{2}$/i;
if (!newAddress.pincode.trim() || !postcodeRegex.test(newAddress.pincode.trim())) {
  newErrors.pincode = "Sorry we don't deliver outside Belfast.";
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Limit all address fields to max 30 characters
    const limitedValue = value.slice(0, 30);
  
    setNewAddress({ ...newAddress, [name]: limitedValue });
  
    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
      if (limitedValue.trim()) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };
  

  useEffect(() => {
    if (selectedAddressId) {
      const address = addresses.find((addr) => addr.address_id === selectedAddressId);
      setSelectedAddress(address ? address.address : "");
      setAddressType(address ? address.address_type : "");
    }
  }, [selectedAddressId, addresses]);
  useEffect(() => {
    if (addresses.length > 0) {
      const primaryAddress = addresses.find((addr) => addr.is_primary === 1);
      if (primaryAddress) {
        dispatch(setSelectedAddressId(primaryAddress.address_id));
        setSelectedAddress(primaryAddress.address);
        setAddressType(primaryAddress.address_type);
      }
    }
  }, [addresses, dispatch]);
  

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
      const payload = {
        ...newAddress,
        address_type: newAddress.address_type === "others" ? customType : newAddress.address_type, // ✅ Replace "others" with customType
      };
      dispatch(addAddress(payload))
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

    const handleSelectAddress = (addressId, addressText, type = "") => {
      dispatch(setSelectedAddressId(addressId));
      setSelectedAddress(addressText);  
      setAddressType(type);                
      setIsModalOpen(false);
    };
    

  return (
    <div className="bg-white p-4 sm:p-6">
      {/* Header Section */}
      <div className="text-center mb-4">
        {mode === "delivery" && (
          <span className="text-xs sm:text-sm text-gray-500">
            Minimum order of £10 for delivery.
          </span>
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode("delivery")}
          aria-label="Select delivery mode"
          className={`w-28 py-2 text-xs sm:text-sm font-medium rounded-md transition ${
            mode === "delivery"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Delivery
        </button>
        <button
          aria-label="Select pickup mode"

          onClick={() => setMode("pickup")}
          className={`w-28 py-2 text-xs sm:text-sm font-medium rounded-md transition ${
            mode === "pickup"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Pick-up
        </button>
      </div>

      {/* Delivery Form */}
      {mode === "delivery" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              aria-label="House number and street name"
              type="text"
              placeholder="House Number & Street Name"
              value={selectedAddress}
              readOnly
              className="w-full border capitalize rounded-md px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            <input
              type="text"
              aria-label="Save address as (e.g., Home, Office, etc.)"
              readOnly
              onClick={() => setIsModalOpen(true)}
              value={addressType}
              placeholder="Save address as (Home, Office, etc.)"
              className="w-full border capitalize rounded-md px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {/* <div className="flex items-center space-x-2">
            <button
              className="text-primary text-xs sm:text-sm font-medium flex items-center gap-1 hover:underline"
              onClick={() => alert("Locating address...")}
            >
              <FaMapMarkerAlt />
              Locate me
            </button>
          </div> */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-500" />
              <input
                type="time"
                className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div> */}
          <div className="flex justify-between mt-4">
            <button   aria-label="Add delivery instructions"
 className="text-primary text-xs sm:text-sm font-medium hover:underline">
              Delivery Instructions
            </button>
            <button 
              aria-label="Select delivery address"
              className="text-primary text-xs sm:text-sm font-medium hover:underline"
              onClick={() => setIsModalOpen(true)}
            >
              Select Address
            </button>
          </div>
          {/* <div className="flex justify-center mt-4">
            <button className="bg-primary text-white w-40 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-primary/90">
              Save & Continue
            </button>
          </div> */}
        </div>
      )}

      {/* Address Selection Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] px-4">
    <div className={`bg-white rounded-lg p-6 w-full max-w-[520px] ${addresses.length > 0 ? "h-auto max-h-[650px]" : "h-auto"} shadow-lg flex flex-col`}>
      <h1 className="text-lg font-semibold mb-4 text-center md:text-xl">Select Address</h1>

      {/* Address List with Custom Scrollbar */}
      {addresses.length > 0 ? (
        <div className="overflow-y-auto custom-scrollbar space-y-3 px-2 max-h-[350px]">
          {[...addresses]
  .sort((a, b) => (b.is_primary - a.is_primary)) // Sort to place primary first
  .map((address) => (
            <div
              key={address.address_id}
              className={`flex items-center justify-between w-full p-4 rounded-lg shadow-sm text-sm cursor-pointer transition-all duration-200 
                ${
                  selectedAddressId === address.address_id
                    ? "bg-primary text-white border border-red-700"
                    : "bg-white hover:bg-gray-100 border border-gray-300"
                }`}
                onClick={() => handleSelectAddress(address.address_id, address.address, address.address_type)}
                >
              <div className="flex flex-col">
                <p className={`font-semibold text-sm md:text-base ${selectedAddressId === address.address_id ? "text-white" : "text-gray-900"}`}>
                  {address.name} - {address.phone}
                </p>
                <p className={`text-xs md:text-sm ${selectedAddressId === address.address_id ? "text-white/90" : "text-gray-700"}`}>
                  {address.address}
                </p>
                <p className={`text-xs ${selectedAddressId === address.address_id ? "text-white/80" : "text-gray-600"}`}>
                  {address.pincode} - {address.country}
                </p>
              </div>
              <input
                type="radio"
                name="selectedAddress"
                checked={selectedAddressId === address.address_id}
                readOnly
                aria-label="Select this address"
                className="h-4 w-4 md:h-5 md:w-5 text-red-600 border-gray-400 focus:ring-0 cursor-pointer"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No saved addresses.</p>
        </div>
      )}

      {/* Add Address Button (No Extra Space Above) */}
      <div className="flex justify-center mt-3">
        <button
          aria-label="Add a new delivery address"
          onClick={() => {
            setShowAddForm(true);
            setNewAddress({ name: "", address: "", city: "", country: "", pincode: "", phone: "" });
          }}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm md:text-base font-semibold hover:bg-primary flex items-center justify-center w-full max-w-[220px]"
        >
          <FaPlus className="mr-2" /> Add Address
        </button>
      </div>

      {/* Add Address Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 border rounded-lg  max-h-[220px] overflow-y-auto custom-scrollbar"
          >
            <h2 className="text-lg font-semibold mb-2 text-center">New Address</h2>
            <form onSubmit={handleSubmit} className="grid gap-3">

{/* Address Type Selection */}


{/* Other Form Fields */}
{Object.keys(newAddress).map((field) =>
  field !== "type" && field !== "address_type" ? ( // Exclude 'type' and 'address_type'
    <div key={field}>
      <input
        type="text"
        name={field}
        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
        value={newAddress[field]}
        maxLength={30} 
        onChange={handleChange}
        aria-label={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
        className="w-full px-3 py-2 border rounded-md"
      />
      {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
    </div>
  ) : null
)}

<div>
  <label className="font-semibold text-gray-700">Address Type:</label>
  <div className="flex gap-4 mt-2">
    {["home", "work", "others"].map((option) => (
      <label key={option} className="flex items-center space-x-2">
        <input
          type="radio"
          name="address_type"
          value={option}
          checked={newAddress.address_type === option}
          aria-label={`Select address type ${option}`}
          onChange={handleTypeChange}
          className="form-radio text-red-500"
        />
        <span className="text-sm capitalize">{option}</span>
      </label>
    ))}
  </div>

  {/* Show custom input ONLY if "Others" is selected */}
  {newAddress.address_type === "others" && (
    <div className="mt-2">
      <input
        type="text"
        maxLength={30} 
        placeholder="Enter custom type"
        value={customType}
        aria-label="Enter custom address type"
        onChange={(e) => setCustomType(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
  )}
</div>

<button
  type="submit"
  aria-label={isLoading ? "Saving address, please wait" : "Save new address"}
  disabled={
    isLoading || 
    Object.keys(errors).length > 0 ||  
    Object.values(newAddress).some(value => value.trim() === "") 
  }
  className={`w-full px-4 py-2 rounded-md font-semibold transition 
    ${isLoading || Object.keys(errors).length > 0 || Object.values(newAddress).some(value => value.trim() === "")
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-primary text-white hover:bg-primary"}
  `}
>
  {isLoading ? "Saving..." : "Save Address"}
</button>

</form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Button */}
      <div className="mt-4 flex justify-end">
        <button
          aria-label="Cancel and close address form"
          className="text-red-600 text-sm font-medium hover:underline"
          onClick={() => {
            setIsModalOpen(false);
            setShowAddForm(false); // Hide form when modal is closed
            setNewAddress({ name: "", address: "", city: "", country: "", pincode: "", phone: "" }); // Reset form
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}







      {/* Pick-up Form */}
      {/* {mode === "pickup" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-500" />
              <input
                type="time"
                className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-primary text-white w-40 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-primary/90">
              Payment
            </button>
          </div>

        </div>
      )} */}
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
    </div>
  );
};

export default DeliveryPickupSection;
