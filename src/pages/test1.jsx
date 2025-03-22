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

const Orders = () => {
  const dispatch = useDispatch();
  const { orderList, isLoading, error } = useSelector((state) => state.order);
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [tempStatusFilter, setTempStatusFilter] = useState(statusFilter);
  const [tempPaymentFilter, setTempPaymentFilter] = useState(paymentFilter);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const topRef = useRef(null);

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

  const filteredOrders = orderList.filter((order) => {
    const statusMatch = statusFilter === "All" || order.order_status.toLowerCase() === statusFilter.toLowerCase();
    const paymentMatch = paymentFilter === "All" || order.mode.toLowerCase() === paymentFilter.toLowerCase();
    const orderDate = new Date(order.updatedAt);
    const startMatch = startDate ? orderDate >= new Date(startDate) : true;
    const endMatch = endDate ? orderDate <= new Date(endDate) : true;
    return statusMatch && paymentMatch && startMatch && endMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

const orders = orderList?.data || [];

const statusOptions = ["All", ...new Set(orders.map(order => order.order_status).filter(Boolean))];
const paymentOptions = ["All", ...new Set(orders.map(order => order.mode).filter(Boolean))];

  

  const PaginationControls = () => (
    <div className="flex justify-center gap-3 items-center mt-6 text-xs sm:text-sm">
      <button
        disabled={currentPage === 1}
        onClick={() => {
          setCurrentPage((prev) => prev - 1);
          scrollToTop();
        }}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Prev
      </button>
      <span className="font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => {
          setCurrentPage((prev) => prev + 1);
          scrollToTop();
        }}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-gray-600 text-xs sm:text-sm mb-4">
        <Link to="/" className="flex items-center hover:text-primary">
          <FaHome className="mr-1" /> Home
        </Link>
        <MdNavigateNext className="mx-2" />
        <span className="text-primary font-semibold">Order History</span>
      </nav>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row justify-between items-start md:items-center mb-4">
        {/* Status */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium border transition ${
                statusFilter === status
                  ? "bg-red-600 text-white border-red-600"
                  : "text-gray-600 hover:bg-gray-100 border-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Payment */}
        <div className="flex flex-wrap gap-2">
          {paymentOptions.map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setPaymentFilter(mode);
                setCurrentPage(1);
              }}
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
      </div>

      {/* Count & Date Filters */}
      <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 text-sm text-gray-700">
        <span className="font-medium text-base">
          Showing {filteredOrders.length} of {orderList.length} Orders
        </span>
        <div className="flex gap-2 sm:gap-3 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1.5 w-[130px] rounded border border-gray-300 text-sm"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1.5 w-[130px] rounded border border-gray-300 text-sm"
          />
        </div>
      </div>

      {/* Pagination Top */}
      {filteredOrders.length > 0 && <PaginationControls />}

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
                      {item.addOn?.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Add-ons:{" "}
                          <span className="text-gray-700">{item.addOn.map((a) => a.name).join(", ")}</span>
                        </p>
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

      {/* Pagination Bottom */}
      {filteredOrders.length > 0 && <PaginationControls />}
    </div>
  );
};

export default Orders;
