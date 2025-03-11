import React from "react";
import { FiMapPin } from "react-icons/fi";

const Orders = () => {
  const orders = [
    {
      id: 1,
      title: "Pizza Meal For 2 (12”)",
      toppings: "Ham, Pineapple",
      dip: "Curry",
      drinks: "1 Coca Cola, 1 Diet Coke",
      date: "5th Nov 2024",
      time: "18:45 PM",
      status: "Home",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg",
      trackOrder: true,
      deliveryDate: "5th Nov, 18:45 PM",
    },
    {
      id: 2,
      title: "Pizza Meal For 2 (12”)",
      toppings: "Ham, Pineapple",
      dip: "Curry",
      drinks: "1 Coca Cola, 1 Diet Coke",
      date: "31st Oct 2024",
      image: "https://www.vegrecipesofindia.com/wp-content/uploads/2018/05/paneer-pizza-recipe-1.jpg",
      reorder: true,
      rateOrder: true,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
        Your Orders
      </h2>

      <div className="space-y-4 md:space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg p-4 md:p-5 border border-gray-200 transition hover:shadow-lg"
          >
            {/* Order Container */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              
              {/* Order Image */}
              <img
                src={order.image}
                alt={order.title}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover shadow-sm"
              />
              
              {/* Order Details */}
              <div className="flex-1">
                {/* Title & Date */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <h4 className="text-md md:text-lg font-semibold text-gray-900">
                    {order.title}
                  </h4>
                  <span className="text-xs md:text-sm font-medium text-gray-500">
                    {order.date}
                  </span>
                </div>

                {/* Order Description */}
                <p className="text-xs md:text-sm text-gray-700 leading-tight mt-1 md:mt-2">
                  <strong className="text-gray-900">Toppings:</strong> {order.toppings} |{" "}
                  <strong className="text-gray-900">Dip:</strong> {order.dip} <br />
                  <strong className="text-gray-900">Drinks:</strong> {order.drinks}
                </p>

                {/* Track Order & Delivery Info */}
                {order.trackOrder && (
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mt-3 space-y-2 md:space-y-0">
                    <button className="text-xs md:text-sm border px-3 py-1 md:px-4 md:py-2 rounded-lg text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition font-medium">
                      Track Order
                    </button>
                    <div className="flex items-center text-xs md:text-sm font-medium text-gray-800">
                      <span className="mr-1">Delivery:</span> {order.deliveryDate}
                      <FiMapPin className="ml-2 text-red-500" />
                      <span className="ml-1 text-red-500 font-semibold">
                        {order.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Reorder & Rate Order Buttons */}
                {(order.reorder || order.rateOrder) && (
                  <div className="flex flex-row justify-start space-x-2 mt-3 md:mt-4">
                    {order.reorder && (
                      <button className="text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 border rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-medium">
                        REORDER
                      </button>
                    )}
                    {order.rateOrder && (
                      <button className="text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 border rounded-lg text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition font-medium">
                        RATE ORDER
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
