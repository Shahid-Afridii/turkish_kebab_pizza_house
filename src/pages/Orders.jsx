// src/pages/Orders.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../redux/slices/orderSlice";
import { FiMapPin, FiTruck, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { motion } from "framer-motion";
import { IoFilter } from "react-icons/io5";
import withErrorBoundary from "../components/ErrorBoundary/withErrorBoundary"; // Import HOC
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AiOutlineFilePdf, AiOutlineFileExcel } from "react-icons/ai"; // Add at the top
import { MdNavigateBefore } from "react-icons/md";

const Orders = () => {
  const dispatch = useDispatch();
  
  const { orderList, isLoading, error } = useSelector((state) => state.order);
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
  const [sortBy, setSortBy] = useState("latest");
  const [tempSortBy, setTempSortBy] = useState(sortBy);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const topRef = useRef(null);

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [tempStatusFilter, setTempStatusFilter] = useState(statusFilter);
  const [tempPaymentFilter, setTempPaymentFilter] = useState(paymentFilter);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const itemsPerPage = 4;
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const filteredOrders = orderList
  .filter((order) => {
    const statusMatch = statusFilter === "All" || order.order_status.toLowerCase() === statusFilter.toLowerCase();
    const paymentMatch = paymentFilter === "All" || order.mode.toLowerCase() === paymentFilter.toLowerCase();
    const orderDate = new Date(order.updatedAt);
    const startMatch = startDate ? orderDate >= new Date(startDate) : true;
    const endMatch = endDate ? orderDate <= new Date(endDate) : true;
    return statusMatch && paymentMatch && startMatch && endMatch;
  })
  .sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else {
      return 0; // keep original order
    }
  });

 
  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

 // If orderList itself is an array, use it directly:
const orders = Array.isArray(orderList) ? orderList : [];

const statusOptions = ["All", ...new Set(orders.map(order => order.order_status?.toLowerCase()).filter(Boolean))];
const paymentOptions = ["All", ...new Set(orders.map(order => order.mode).filter(Boolean))];


const PaginationControls = () => {
  const MAX_VISIBLE = 5;

  const getDisplayedPages = () => {
    if (totalPages <= MAX_VISIBLE) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  };

  const pagesToShow = getDisplayedPages();

  return (
    <div className="flex flex-wrap justify-center gap-2 items-center mt-6 text-xs sm:text-sm">
      <button
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => {
          setCurrentPage((prev) => prev - 1);
          scrollToTop();
        }}
        className="px-2 py-1 border rounded disabled:opacity-30"
      >
        <MdNavigateBefore />
      </button>

      {pagesToShow.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-3 py-1 text-gray-400 select-none">...</span>
        ) : (
          <button
            key={page}
            aria-label={`Go to page ${page}`}
            onClick={() => {
              setCurrentPage(page);
              scrollToTop();
            }}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-primary text-white border-red-600"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        aria-label="Next page"

        disabled={currentPage === totalPages}
        onClick={() => {
          setCurrentPage((prev) => prev + 1);
          scrollToTop();
        }}
        className="px-2 py-1 border rounded disabled:opacity-30"
      >
        <MdNavigateNext aria-hidden="true" />
      </button>
    </div>
  );
};


  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Order Invoice", 14, 15);
  
    const tableData = filteredOrders.map((order) => [
      order.order_id,
      formatDate(order.updatedAt),
      order.order_status,
      order.mode,
      order.total_amount.toFixed(2),
      order.address?.name || "-",
    ]);
  
    autoTable(doc, {
      startY: 25,
      head: [["Order ID", "Date", "Status", "Payment", "Amount", "Customer"]],
      body: tableData,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 99, 132] },
    });
    doc.setFontSize(10);
   
    
    doc.save("orders_invoice.pdf");
  };
  const statusCountMap = orders.reduce((acc, order) => {
    const key = order.order_status?.toLowerCase();
    if (key) {
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  
  const downloadExcel = () => {
    const excelData = filteredOrders.map((order) => ({
      "Order ID": order.order_id,
      "Date": formatDate(order.updatedAt),
      "Status": order.order_status,
      "Payment": order.mode,
      "Amount (£)": order.total_amount,
      "Customer": order.address?.name || "-",
      "Phone": order.address?.phone || "-",
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "orders_invoice.xlsx");
  };
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredOrders, totalPages, currentPage]);
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-gray-600 text-xs sm:text-sm mb-4">
        <Link to="/"   aria-label="Go to homepage"
 className="flex items-center hover:text-primary">
          <FaHome className="mr-1" /> Home
        </Link>
        <MdNavigateNext className="mx-2" />
        <span className="text-primary font-semibold">Order History</span>
      </nav>
      <div className="flex flex-row justify-end items-center gap-2 sm:gap-3 mb-4">
  <button
    onClick={downloadPDF}
      aria-label="Download invoice as PDF"
    className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-red-700 transition"
  >
    <AiOutlineFilePdf className="text-base sm:text-lg" aria-hidden="true" />Invoice
    <span className="hidden xs:inline">PDF</span>
  </button>

  <button
    onClick={downloadExcel}
    aria-label="Download invoice as Excel"
    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-green-700 transition"
  >
    <AiOutlineFileExcel className="text-base sm:text-lg" /> Invoice
    <span className="hidden xs:inline" aria-hidden="true">Excel</span>
  </button>
</div>
      {/* Mobile Filter Button */}
      <div className="flex sm:hidden justify-end mb-3">
        <button
          aria-label="Apply filters"

          onClick={() => {
            setTempStatusFilter(statusFilter);
            setTempPaymentFilter(paymentFilter);
            setTempStartDate(startDate);
            setTempEndDate(endDate);
            setShowMobileFilter(true);
            
          }}
          className="flex items-center gap-1 px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
        >
          <IoFilter /> Filter
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden  sm:flex flex-col gap-3 sm:gap-4 md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => {
  const count = status === "All"
    ? orders.length
    : statusCountMap[status.toLowerCase()] || 0;

  return (
    <div className="relative inline-block" key={status}>
      <button
        onClick={() => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
        aria-label={`Filter by ${status}`}
        className={`px-4 pr-6 py-1 capitalize text-xs sm:text-sm rounded-full font-medium border transition relative ${
          statusFilter === status
            ? "bg-primary text-white border-red-600"
            : "text-gray-700 hover:bg-gray-100 border-gray-300"
        }`}
      >
        {status}
      </button>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
          {count}
        </span>
      )}
    </div>
  );
})}


        </div>

        <div className="flex flex-wrap gap-2">
          {paymentOptions.map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setPaymentFilter(mode);
                setCurrentPage(1);
              }}
              aria-label={`Filter by ${mode} payment method`}

              className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium border transition ${
                paymentFilter === mode
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "text-gray-600 hover:bg-gray-100 border-gray-300"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
  {["latest", "default"].map((option) => (
    <button
      key={option}
      onClick={() => {
        setSortBy(option);
        setCurrentPage(1);
      }}
      aria-label={`Sort by ${option === "latest" ? "latest" : "default"}`}

      className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium border transition ${
        sortBy === option
          ? "bg-black text-white border-black"
          : "text-gray-600 hover:bg-gray-100 border-gray-300"
      }`}
    >
      {option === "latest" ? "Latest" : "Default"}
    </button>
  ))}
</div>

      </div>
      

      {/* Count & Date Filters */}
      <div className="hidden lg:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 text-sm text-gray-700">
        <span className="font-medium text-base">
          Showing {filteredOrders.length} of {orderList.length} Orders
        </span>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
  {/* Start Date */}
  <label className="flex items-center gap-2 text-sm text-gray-600">
   
    <input
      type="date"
      value={startDate}
      aria-label="Select start date"
      onChange={(e) => setStartDate(e.target.value)}
      className="appearance-none outline-none text-sm bg-transparent"
    />
  </label>

  <span className="text-gray-400 font-medium text-sm">to</span>

  {/* End Date */}
  <label className="flex items-center gap-2 text-sm text-gray-600">
  
    <input
      type="date"
      value={endDate}
      aria-label="Select end date"
      onChange={(e) => setEndDate(e.target.value)}
      className="appearance-none outline-none text-sm bg-transparent"
    />
  </label>
</div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end">
          <div className="bg-white w-full p-5 rounded-t-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">Filter Orders</h1>
              <button   aria-label="Close the filter"
 onClick={() => setShowMobileFilter(false)} className="text-gray-500 text-sm">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Order Status</p>
                <div className="flex flex-wrap gap-2 capitalize">
              
                       {statusOptions.map((status) => {
  const count = status === "All"
    ? orders.length
    : statusCountMap[status.toLowerCase()] || 0;

  return (
    <div className="relative inline-block" key={status}>
      <button
                             onClick={() => setTempStatusFilter(status)}

        key={status}
        aria-label={`Filter by ${status}`}
        className={`px-3 py-1 capitalize text-xs rounded-full font-medium border transition ${
          tempStatusFilter === status
            ? "bg-primary text-white border-red-600"
            : "text-gray-600 hover:bg-gray-100 border-gray-300"
        }`}
      >
        {status}
      </button>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
          {count}
        </span>
      )}
    </div>
  );
})}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Payment Mode</p>
                <div className="flex flex-wrap gap-2">
                  {paymentOptions.map((mode) => (
                    <button
                      key={mode}
                      aria-label={`Filter by ${mode} payment method`}
                      onClick={() => setTempPaymentFilter(mode)}
                      className={`px-3 py-1 text-xs capitalize rounded-full font-medium border transition ${
                        tempPaymentFilter === mode
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "text-gray-600 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
  <p className="text-sm font-medium mb-2">Sort By</p>
  <div className="flex flex-wrap gap-2">
    {["latest", "default"].map((option) => (
      <button
        key={option}
        aria-label={`Sort by ${option === "latest" ? "latest" : "default"}`}
        onClick={() => setTempSortBy(option)}
        className={`px-3 py-1 text-xs rounded-full font-medium border transition ${
          tempSortBy === option
            ? "bg-black text-white border-black"
            : "text-gray-600 hover:bg-gray-100 border-gray-300"
        }`}
      >
        {option === "latest" ? "Latest" : "Default"}
      </button>
    ))}
  </div>
</div>



              <div className="text-sm">
                <p className="font-medium mb-2">Date Range</p>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={tempStartDate}
                    aria-label="Select temporary start date"
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-1/2 px-2 py-1.5 border rounded border-gray-300"
                  />
                  <input
                    type="date"
                    value={tempEndDate}
                    aria-label="Select temporary end date"
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-1/2 px-2 py-1.5 border rounded border-gray-300"
                  />
                </div>
              </div>

              <button
                aria-label="Apply the selected filters"

                onClick={() => {
                  setStatusFilter(tempStatusFilter);
                  setPaymentFilter(tempPaymentFilter);
                  setStartDate(tempStartDate);
                  setEndDate(tempEndDate);
                  setSortBy(tempSortBy);
                  setCurrentPage(1);
                  setShowMobileFilter(false);
                }}
                className="w-full mt-4 bg-primary text-white py-2 rounded text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Top */}
      {/* {filteredOrders.length > 0 && <PaginationControls />} */}
 {/* Loader */}
      {isLoading ? (
        <div className="space-y-6 mt-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white p-5 rounded-lg border border-gray-200 animate-pulse">
              <div className="h-5 w-1/3 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[1, 2].map((key) => (
                  <div key={key} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div ref={topRef} className="space-y-6 mt-4">
          {paginatedOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border-l-4 border-red-500 rounded-lg p-5 shadow hover:shadow-lg transition"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-800">
                    Order <span className="text-red-600">#{order.order_id}</span>
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FiClock className="text-gray-400" />
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
                <span
                  className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold uppercase ${
                    order.order_status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.order_status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.order_status}
                </span>
              </div>

              {/* Items */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <img
                      src={item.image ? `${IMAGE_URL}${item.image}` : "/assets/noimage.png"}
                      alt={item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover border rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      {item.addon?.length > 0 && (
  <div className="text-xs text-gray-600 mt-1 space-y-1">
    {item.addon.map((addon, i) => (
      <div key={i}>
        <span className="font-medium text-gray-700">{addon.addon_name}:</span>{" "}
        {addon.addon_item.map((ai, j) => (
          <span key={j} className="inline-block ml-1">
            {ai.addon_item_name}
            {ai.amount ? ` (£${ai.amount})` : ""}
            {j < addon.addon_item.length - 1 && ","}
          </span>
        ))}
      </div>
    ))}
  </div>
)}

                    </div>
                  </div>
                ))}
              </div>

              {/* Address & Payment */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs sm:text-sm text-gray-700 border-t pt-3">
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    <FiMapPin /> Delivered To:
                  </p>
                  <p>{order.address.name}, {order.address.phone}</p>
                  <p>{order.address.address}, {order.address.city}, {order.address.pincode}</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="font-semibold text-base text-gray-900 mb-1">£{order.total_amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    <FiTruck className="inline mr-1" />
                    Payment: {order.mode}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
            {filteredOrders.length > 0 && <PaginationControls />}

    </div>
  );
};

export default withErrorBoundary(Orders);
