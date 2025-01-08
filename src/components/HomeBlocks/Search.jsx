import React, { useState } from "react";

const Search = () => {
  const [vegOnly, setVegOnly] = useState(false);

  const handleToggle = () => {
    setVegOnly(!vegOnly);
  };

  return (
    <div className="flex flex-col mt-4 md:flex-row items-center justify-between bg-white shadow-xl rounded-lg p-4 w-full max-w-5xl mx-auto space-y-4 md:space-y-0 md:space-x-4 px-5">
      {/* Search Bar */}
      <div className="flex items-center flex-grow w-full md:w-auto">
        <span className="text-primary text-lg pr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.45 11.25a5.2 5.2 0 11-10.4 0 5.2 5.2 0 0110.4 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder='Search "Our Regular Menu"'
          className="flex-grow outline-none bg-transparent text-gray-700 placeholder-gray-500 text-base w-full"
        />
      </div>

      {/* Veg Only Toggle */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <span className="text-sm font-medium text-gray-700 pr-2 no-underline">
          Veg only
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={vegOnly}
            onChange={handleToggle}
          />
          <div className="w-9 h-5 bg-gray-300 rounded-full peer  peer-checked:bg-primary"></div>
          <div className="absolute left-1 top-[2px] w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 outline-none"></div>
        </label>
      </div>
    </div>
  );
};

export default Search;
