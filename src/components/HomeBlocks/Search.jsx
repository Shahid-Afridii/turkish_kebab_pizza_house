import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleVegOnly, fetchMenuItems } from "../../redux/slices/menuSlice";
import { searchItems, setSearchKeyword, clearSearchResults } from "../../redux/slices/searchSlice";
import { RxCross2 } from "react-icons/rx";

const Search = () => {
  const dispatch = useDispatch();
  const vegOnly = useSelector((state) => state.menu.vegOnly);
  const { menu } = useSelector((state) => state.menu);
  const { keyword, loading, results } = useSelector((state) => state.search);
  const [hasSearched, setHasSearched] = useState(false); // ✅ Flag to control search result display

  const [placeholder, setPlaceholder] = useState("Search Our Regular Menu");
  const indexRef = useRef(0);

  const handleToggle = () => {
    dispatch(toggleVegOnly());
    dispatch(fetchMenuItems());
  };
  // Reset search flag when keyword is updated manually
  useEffect(() => {
    setHasSearched(false);
  }, [keyword]);

  // Animate placeholder from active categories
  useEffect(() => {
    if (!menu || menu.length === 0) return;
    const activeCategories = menu.filter((cat) => cat.status === "active");
    if (activeCategories.length === 0) return;

    const interval = setInterval(() => {
      const category = activeCategories[indexRef.current % activeCategories.length];
      setPlaceholder(`Search ${category.name}`);
      indexRef.current++;
    }, 2500);

    return () => clearInterval(interval);
  }, [menu]);

  const handleSearch = () => {
    if (keyword.trim().length > 0) {
      const payload = vegOnly ? { keyword, vegOnly } : { keyword };
      dispatch(searchItems(payload)); // ✅ send vegOnly only if true
      setHasSearched(true);
    }
  };
  
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setHasSearched(false);
    dispatch(clearSearchResults());
  };

  return (
    <div className="flex flex-col w-full mx-0 max-w-full lg:max-w-5xl lg:mx-auto">
      <div className="flex flex-row items-center justify-between lg:shadow-sm rounded-lg p-3 w-full">
        {/* Search Bar */}
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            value={keyword}
            onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-500 text-sm sm:text-base py-2 pr-24 pl-4 rounded-lg transition-all duration-300"
          />

          {keyword.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition"
              title="Clear"
            >
              <RxCross2 className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-white hover:bg-primary rounded-lg p-2 transition"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
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
            )}
          </button>
        </div>

        {/* Veg Toggle */}
        <div className="flex items-center space-x-2 w-auto ml-3">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Veg</span>
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

      {/* No Results Message */}
      {hasSearched && !loading && keyword.trim().length > 0 && results.length === 0 && (
        <div className="w-full text-center mt-3 text-red-500 text-sm">
          No results found for "<strong>{keyword}</strong>"
        </div>
      )}
    </div>
  );
};

export default Search;
