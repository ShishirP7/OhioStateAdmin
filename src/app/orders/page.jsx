"use client";
import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../components/adminLayouts";
import Receipt from "../components/Recipt";
import axios from "axios";
import useSound from "use-sound";

const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-200 text-yellow-800";
    case "processing":
    case "cooking":
      return "bg-blue-200 text-blue-800";
    case "completed":
      return "bg-green-200 text-green-800";
    case "cancelled":
      return "bg-red-200 text-red-800";
    case "delivery":
      return "bg-orange-200 text-orange-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const orderIdsRef = useRef(new Set());
  const printRef = useRef();

  const [playNotification] = useSound(
    "https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3",
    { volume: 0.5 }
  );

  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!alarmActive) return;
    const alarmInterval = setInterval(() => {
      playNotification();
    }, 3000);
    return () => clearInterval(alarmInterval);
  }, [alarmActive, playNotification]);

  useEffect(() => {
    if (!isPageVisible) return;

    const POLL_INTERVAL = 30000;

    const fetchOrders = () => {
      const token = localStorage.getItem("authToken");
      axios
        .get("https://api.ohiostatepizzas.com/api/orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const fetchedOrders = res.data.data;
          const newIds = new Set(fetchedOrders.map((o) => o._id));
          const isNewOrder = [...newIds].some(
            (id) => !orderIdsRef.current.has(id)
          );
          setOrders(fetchedOrders);
          orderIdsRef.current = newIds;

          const hasPending = fetchedOrders.some(
            (order) => order.status.toLowerCase() === "pending"
          );
          setAlarmActive(hasPending);

          if (isNewOrder && hasPending) {
            playNotification();
          }
        })
        .catch((err) => {
          console.error("Error polling orders:", err);
        });
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isPageVisible, playNotification]);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=380,height=600");
    win.document.write(`
     <html>
  <head>
    <title>Print Receipt</title>
    <style>
      @media print {
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          width: 80mm;
          background: #fff;
          font-family: monospace;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
        }

        body {
          margin: 0 auto;
        }

        #invoice-POS {
          width: 80mm;
          margin: 0 auto;
        }

        h2,
        h3 {
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          margin: 4px 0;
        }

        p {
          font-size: 12px;
          text-align: center;
          margin: 2px 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }

        th, td {
          font-size: 12px;
          padding: 4px 0;
          text-align: left;
        }

        th {
          border-bottom: 1px solid #000;
        }

        .right {
          text-align: right;
        }

        .center {
          text-align: center;
        }

        .legal {
          font-size: 10px;
          text-align: center;
          margin-top: 10px;
        }

        @page {
          size: 80mm auto;
          margin: 0;
        }

        .logo {
          display: block;
          margin: 0 auto 6px;
          height: 60px;
          width: 60px;
        }
      }
    </style>
  </head>

  <body onload="window.print(); window.close();">
    ${printContents}
  </body>
</html>

    `);
    win.document.close();
  };

  const handleChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://api.ohiostatepizzas.com/api/orders/${selectedOrder._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrders = orders.map((order) =>
        order._id === selectedOrder._id
          ? { ...order, status: newStatus }
          : order
      );
      setOrders(updatedOrders);
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));

      const hasPending = updatedOrders.some(
        (order) => order.status.toLowerCase() === "pending"
      );
      setAlarmActive(hasPending);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setIsOpen(false);
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const statusMessage = () => {
    if (!selectedOrder) return "";
    switch (selectedOrder.status.toLowerCase()) {
      case "pending":
        return "New order received. Awaiting action.";
      case "cooking":
        return "The kitchen is preparing the order.";
      case "delivery":
        return "The order has left the restaurant for delivery.";
      case "completed":
        return "Order has been delivered successfully!";
      case "cancelled":
        return "Order has been cancelled.";
      default:
        return "Unknown order status.";
    }
  };

  return (
    <AdminLayout>
      <div className="container p-2 mx-auto sm:p-4 text-white">
        {/* Filter section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="max-w pt-6">
            <div className="relative flex items-center border border-black w-full h-full rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                type="text"
                id="search"
                placeholder="Search something.."
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="pizzaType"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-700"
            >
              Filter by Pizza Type
            </label>
            <select
              id="pizzaType"
              className="w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-100 dark:text-black"
            >
              <option value="">All</option>
              {Array.from(
                new Set(
                  orders?.flatMap((order) =>
                    order.cartItems.map((item) => item.name)
                  )
                )
              ).map((pizzaName, index) => (
                <option key={index} value={pizzaName}>
                  {pizzaName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-700"
            >
              Order Status
            </label>
            <select
              id="status"
              className="w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-100 dark:text-black"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="cooking">Making</option>
              <option value="packaging">Packaging</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        {/* Orders Table */}
        <h2 className="mb-4 text-2xl font-semibold leading-tight text-black">
          Pizza Orders
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full p-6 text-sm text-left whitespace-nowrap ">
            <thead>
              <tr className="bg-red-600 text-red-700 text-white">
                <th className="p-3 ">Order ID</th>
                <th className="p-3 ">Customer</th>
                <th className="p-3 ">Product Name</th>
                <th className="p-3 ">Quantity</th>
                <th className="p-3 ">Price ($)</th>
                <th className="p-3 ">Pickup/Delivery</th>
                <th className="p-3 ">Status</th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-100 text-black">
              {orders?.map((order, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(order)}
                  className={`cursor-pointer hover:bg-gray-100 ${
                    order.status.toLowerCase() === "pending"
                      ? "animate-pulse bg-yellow-100 font-bold"
                      : ""
                  }`}
                >
                  <td className="px-3 py-2 font-medium text-md">
                    {order._id?.substring(0, 8)}
                  </td>
                  <td className="px-3 py-2">
                    {order.billingInfo?.firstName} {order.billingInfo?.lastName}
                  </td>
                  <td className="px-3 py-2">
                    {order.cartItems.map((item) => item.name).join(", ")}
                  </td>
                  <td className="px-3 py-2">
                    {order.cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </td>
                  <td className="px-3 py-2">${order.orderTotal?.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    {order.serviceType === "Carryout" ? "Carryout" : "Delivery"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white text-black rounded-lg w-[90%] max-w-xl p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
              <div className="w-100 ">
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      type="button"
                      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 transition duration-200"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      {selectedOrder.status}
                      <svg
                        className={`-mr-1 size-5 text-gray-400 transform transition-transform duration-200 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div
                    className={`absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition-all duration-200 ${
                      isOpen
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible"
                    }`}
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="py-1" role="none">
                      {[
                        "pending",
                        "cooking",
                        "delivery",
                        "completed",
                        "cancelled",
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => handleChange(item)}
                          className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                            item === selectedOrder.status
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                          role="menuitem"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="absolute top-5 right-3 text-2xl font-bold text-gray-700 hover:text-black"
                >
                  &times;
                </button>
              </div>

              <h2 className="text-2xl mt-5 font-semibold text-center mb-4">
                {statusMessage()} {selectedOrder?._id?.substring(0, 8)}!
              </h2>

              <div className="space-y-4 text-sm sm:text-base">
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-red-600">
                    Customer Details
                  </h3>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.billingInfo?.firstName}{" "}
                    {selectedOrder?.billingInfo?.lastName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder?.billingInfo?.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder?.billingInfo?.email}
                  </p>
                  <p>
                    <strong>Service Type:</strong> {selectedOrder?.serviceType}
                  </p>
                  {selectedOrder?.carryoutInfo?.address && (
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedOrder?.carryoutInfo?.address}
                    </p>
                  )}
                  {selectedOrder?.carryoutInfo?.scheduledTime && (
                    <p>
                      <strong>Scheduled Time:</strong>{" "}
                      {selectedOrder?.carryoutInfo?.scheduledTime}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-1 text-red-600">
                    Order Items
                  </h3>
                  {selectedOrder.cartItems.map((item, index) => (
                    <div key={index} className="mb-4">
                      <p>
                        <strong>Item:</strong> {item.name} ×{item?.quantity}
                      </p>
                      <p>
                        <strong>Price:</strong> ${item.totalPrice?.toFixed(2)}
                      </p>
                      {item.selectedOptions &&
                        Object.keys(item.selectedOptions).length > 0 && (
                          <>
                            {Object.entries(item.selectedOptions).map(
                              ([key, value]) => {
                                if (
                                  !value ||
                                  (Array.isArray(value) && value.length === 0)
                                )
                                  return null;

                                return (
                                  <p key={key}>
                                    <strong>
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                      :
                                    </strong>{" "}
                                    {Array.isArray(value)
                                      ? value.join(", ")
                                      : value}
                                  </p>
                                );
                              }
                            )}
                          </>
                        )}
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-1 text-red-600">
                    Payment Summary
                  </h3>
                  <p>
                    <strong>Method:</strong> {selectedOrder.paymentInfo?.method}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> $
                    {selectedOrder.orderTotal?.toFixed(2)}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600 mt-4 text-red-600">
                  Order ID:{" "}
                  <strong>{selectedOrder?._id?.substring(0, 8)}</strong>
                  <br />
                  Order Time:{" "}
                  <strong>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </strong>
                </div>
                <div>
                  <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4"
                  >
                    🖨️ Print Receipt
                  </button>
                  <div
                    ref={printRef}
                    className="p-4 bg-white text-black rounded shadow hidden"
                  >
                    <Receipt order={selectedOrder} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
