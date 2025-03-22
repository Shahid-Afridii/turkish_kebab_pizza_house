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
import { FaRegCalendarAlt } from "react-icons/fa"; // Add this import

const Orders = () => {
  const dispatch = useDispatch();
  const { orderList, isLoading, error } = useSelector((state) => state.order);
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

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

 // If orderList itself is an array, use it directly:
const orders = Array.isArray(orderList) ? orderList : [];

const statusOptions = ["All", ...new Set(orders.map(order => order.order_status?.toLowerCase()).filter(Boolean))];
const paymentOptions = ["All", ...new Set(orders.map(order => order.mode).filter(Boolean))];

console.log("orders", orders);
console.log("statusOptions", statusOptions);
console.log("paymentOptions", paymentOptions);

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
  
    doc.save("orders_invoice.pdf");
  };
  
  
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
      <div className="flex flex-row justify-end items-center gap-2 sm:gap-3 mb-4">
  <button
    onClick={downloadPDF}
    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-red-700 transition"
  >
    <AiOutlineFilePdf className="text-base sm:text-lg" />Invoice
    <span className="hidden xs:inline">PDF</span>
  </button>

  <button
    onClick={downloadExcel}
    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium hover:bg-green-700 transition"
  >
    <AiOutlineFileExcel className="text-base sm:text-lg" /> Invoice
    <span className="hidden xs:inline">Excel</span>
  </button>
</div>
      {/* Mobile Filter Button */}
      <div className="flex sm:hidden justify-end mb-3">
        <button
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
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 capitalize text-xs sm:text-sm rounded-full font-medium border transition ${
                statusFilter === status
                  ? "bg-red-600 text-white border-red-600"
                  : "text-gray-600 hover:bg-gray-100 border-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

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
              <h3 className="text-lg font-semibold">Filter Orders</h3>
              <button onClick={() => setShowMobileFilter(false)} className="text-gray-500 text-sm">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Order Status</p>
                <div className="flex flex-wrap gap-2 capitalize">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setTempStatusFilter(status)}
                      className={`px-3 py-1 capitalize text-xs rounded-full font-medium border transition ${
                        tempStatusFilter === status
                          ? "bg-red-600 text-white border-red-600"
                          : "text-gray-600 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Payment Mode</p>
                <div className="flex flex-wrap gap-2">
                  {paymentOptions.map((mode) => (
                    <button
                      key={mode}
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

              <div className="text-sm">
                <p className="font-medium mb-2">Date Range</p>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-1/2 px-2 py-1.5 border rounded border-gray-300"
                  />
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-1/2 px-2 py-1.5 border rounded border-gray-300"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setStatusFilter(tempStatusFilter);
                  setPaymentFilter(tempPaymentFilter);
                  setStartDate(tempStartDate);
                  setEndDate(tempEndDate);
                  setCurrentPage(1);
                  setShowMobileFilter(false);
                }}
                className="w-full mt-4 bg-red-600 text-white py-2 rounded text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

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
            {filteredOrders.length > 0 && <PaginationControls />}

    </div>
  );
};

export default withErrorBoundary(Orders);
