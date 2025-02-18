import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleVegOnly, fetchMenuItems } from "../../redux/slices/menuSlice";
const Search = () => {
  const dispatch = useDispatch();
  const vegOnly = useSelector((state) => state.menu.vegOnly); // ✅ Get Redux `vegOnly`

  const handleToggle = () => {
    dispatch(toggleVegOnly()); // ✅ Toggle Redux state
    dispatch(fetchMenuItems()); // ✅ Re-fetch menu items
  };


  return (
    <div className="flex flex-row items-center justify-between lg:shadow-sm rounded-lg p-3 w-full mx-0 max-w-full lg:max-w-5xl lg:mx-auto">
      {/* Search Bar */}
      <div className="relative flex-grow w-full md:w-auto">
        <input
          type="text"
          placeholder="Search Our Regular Menu"
          className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-500 text-sm sm:text-base py-2 pr-10 pl-4 rounded-lg"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-2 flex items-center justify-center text-primary hover:text-white hover:bg-primary rounded-lg p-2 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.45 11.25a5.2 5.2 0 11-10.4 0 5.2 5.2 0 0110.4 0z"
            />
          </svg>
        </button>
      </div>

      {/* Veg Only Toggle */}
      <div className="flex items-center space-x-2 w-auto">
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          Veg
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={vegOnly}
            onChange={handleToggle}
          />
          <div className="w-8 h-4 sm:w-9 sm:h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600"></div>
          <div className="absolute left-[2px] top-[1px] w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 sm:peer-checked:translate-x-5 outline-none"></div>
        </label>
      </div>
    </div>
  );
};

export default Search;
