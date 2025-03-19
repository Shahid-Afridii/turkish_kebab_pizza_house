import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrivacyPolicy } from "../redux/slices/policySlice"; // ✅ Import API action
import { FaHome } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { Link } from "react-router-dom"; // ✅ Ensure React Router is used for navigation

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  
  // ✅ Fetch policy details from Redux store
  const { isLoading, error, policyDetails } = useSelector((state) => state.policy);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchPrivacyPolicy("pp")); // ✅ Pass "pp" dynamically when calling API
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      {/* ✅ Breadcrumbs */}
      <nav className="flex items-center text-gray-600 text-sm mb-4">
        <Link to="/" className="flex items-center hover:text-primary">
          <FaHome className="mr-1" /> Home
        </Link>
        <MdNavigateNext className="mx-2" />
        <span className="text-primary font-semibold">Privacy Policy</span>
      </nav>

      {isLoading ? (
        <p className="text-gray-600 text-center">Loading policy...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error: {error}</p>
      ) : policyDetails ? (
        <div className="prose max-w-none bg-gray-50 p-6 rounded-md shadow-md border border-gray-200">
          {/* ✅ Render the actual HTML content from API response */}
          <div 
            className="text-gray-700 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: policyDetails.privacy_policy }} 
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No privacy policy available.</p>
      )}
    </div>
  );
};

export default PrivacyPolicy;
