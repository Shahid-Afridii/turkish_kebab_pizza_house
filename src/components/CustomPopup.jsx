import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineWarning, AiOutlineInfoCircle } from 'react-icons/ai';

/**
 * CustomPopup component to display a customizable popup with optional auto-close functionality.
 * 
 * @param {boolean} isOpen - Indicates if the popup is open.
 * @param {string} type - Type of the popup ('success', 'error', 'warning', 'info').
 * @param {string} title - Title of the popup.
 * @param {string} subText - Subtitle or additional text for the popup.
 * @param {function} onConfirm - Callback function for the confirm button.
 * @param {function} onClose - Callback function for closing the popup.
 * @param {number} autoClose - Time in seconds to auto-close the popup.
 * @param {string} confirmLabel - Label for the confirm button.
 * @param {string} cancelLabel - Label for the cancel button.
 * @param {boolean} showConfirmButton - Whether to show the confirm button.
 * @param {boolean} showCancelButton - Whether to show the cancel button.
 * @param {boolean} showCloseIcon - Whether to show the close icon.
 */
const CustomPopup = ({
  isOpen,
  type,
  title,
  subText,
  onConfirm,
  onClose,
  autoClose,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  showConfirmButton = true,
  showCancelButton = true,
  showCloseIcon = true,
}) => {
  const popupRef = useRef();
  const [buttonsVisible, setButtonsVisible] = useState(true);

  // Handle auto-close functionality
  useEffect(() => {
    let timer;
    if (isOpen && autoClose) {
      timer = setTimeout(onClose, autoClose * 1000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, autoClose, onClose]);

  // Handle click outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Reset button visibility when popup is opened
  useEffect(() => {
    if (isOpen) {
      setButtonsVisible(true);
    }
  }, [isOpen]);

  // Get the appropriate icon based on the type
  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return <AiOutlineCheckCircle className="text-green-600 h-10 w-10" />;
      case 'error':
        return <AiOutlineCloseCircle className="text-red-600 h-10 w-10" />;
      case 'warning':
        return <AiOutlineWarning className="text-yellow-600 h-10 w-10" />;
      case 'info':
        return <AiOutlineInfoCircle className="text-blue-600 h-10 w-10" />;
      default:
        return null;
    }
  };

  // Handle the confirm action
  const handleConfirm = async () => {
    await onConfirm();
    setButtonsVisible(false);  // Hide buttons after onConfirm completes
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] px-4 py-6 sm:px-0 ">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      <motion.div
        ref={popupRef}
        className="bg-white p-6 rounded-xl font-primary shadow-2xl relative z-10 w-full max-w-md "
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute inset-x-0 -top-8 flex justify-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center">
            {getTypeIcon()}
          </div>
        </motion.div>
        {showCloseIcon && (
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            <AiOutlineCloseCircle className="h-6 w-6" />
          </button>
        )}
        <div className="text-center mt-10">
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
          <p className="text-gray-600 mt-2">{subText}</p>
        </div>
        {buttonsVisible && (showCancelButton || showConfirmButton) && (
          <div className="flex justify-center space-x-4 mt-6">
            {showCancelButton && (
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition-all duration-200 ease-in-out"
                onClick={onClose}
              >
                {cancelLabel}
              </button>
            )}
            {showConfirmButton && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all duration-200 ease-in-out"
                onClick={handleConfirm}
              >
                {confirmLabel}
              </button>
            )}
          </div>
        )}
        {/* progress goes in the direction of left to right */}
        {autoClose && (
          <div className="mt-6 h-1 w-full bg-gray-100 rounded overflow-hidden relative">
            <motion.div
                    className="h-full bg-primary absolute left-0 top-0"
                    initial={{ width: '0%' }} // Start from the left
                    animate={{ width: '100%' }} // Expand to the right
                    transition={{ ease: 'linear', duration: autoClose }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CustomPopup;
