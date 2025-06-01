"use client";
import React, { useState } from "react";
import AdminLayout from "../components/adminLayouts";
import Lottie from "lottie-react";
import OrderAnimation from "../../../Assets/Preparing.json";
import PackagingAnimation from "../../../Assets/Packaging.json";

const pizzaOrders = [
  {
    orderId: "A001",
    customerName: "John Doe",
    contact: "+1 (614) 555-1111",
    address: "123 Elm Street, Columbus, OH",
    status: "Pending",
    orderTime: "2025-06-01T13:20:00Z",
    pizza: {
      productId: 222,
      productName: "Pepperoni",
      size: "Medium",
      crust: "Thin Crust",
      baseSauce: "Tomato Basil",
      cheese: "Regular Mozzarella",
      toppings: ["Pepperoni", "Cheese"],
      addOns: [{ name: "Garlic Sauce", quantity: 1 }],
      extras: {
        cutIntoSlices: true,
        wellDone: false,
        glutenFree: false,
        spicyLevel: "Mild",
      },
      specialInstructions: "No onions please.",
    },
    payment: {
      method: "Cash",
      amountPaid: 24.0,
      tip: 2.0,
    },
    estimatedDelivery: "2025-06-01T13:50:00Z",
  },
  {
    orderId: "A002",
    customerName: "Jane Smith",
    contact: "+1 (614) 555-2222",
    address: "456 Oak Avenue, Dublin, OH",
    status: "Completed",
    orderTime: "2025-06-01T12:10:00Z",
    pizza: {
      productId: 223,
      productName: "Veggie Delight",
      size: "Small",
      crust: "Cheese Burst",
      baseSauce: "Garlic Alfredo",
      cheese: "Extra Cheese",
      toppings: ["Tomatoes", "Olives", "Bell Peppers", "Mushrooms"],
      addOns: [],
      extras: {
        cutIntoSlices: true,
        wellDone: false,
        glutenFree: true,
        spicyLevel: "None",
      },
      specialInstructions: "Gluten-free crust only.",
    },
    payment: {
      method: "Online (UPI)",
      amountPaid: 12.0,
      tip: 1.0,
    },
    estimatedDelivery: "2025-06-01T12:45:00Z",
  },
  {
    orderId: "A003",
    customerName: "Mike Johnson",
    contact: "+1 (614) 555-3333",
    address: "789 Maple Road, Hilliard, OH",
    status: "Cancelled",
    orderTime: "2025-06-01T11:30:00Z",
    pizza: {
      productId: 224,
      productName: "BBQ Chicken",
      size: "Large",
      crust: "Hand Tossed",
      baseSauce: "BBQ Sauce",
      cheese: "Regular Cheese",
      toppings: ["BBQ Chicken", "Red Onions", "Corn"],
      addOns: [],
      extras: {
        cutIntoSlices: false,
        wellDone: false,
        glutenFree: false,
        spicyLevel: "Hot",
      },
      specialInstructions: "Cancelled due to address error.",
    },
    payment: {
      method: "Online (Card)",
      amountPaid: 36.0,
      tip: 0.0,
    },
    estimatedDelivery: "2025-06-01T12:00:00Z",
  },
  {
    orderId: "A004",
    customerName: "Emily Davis",
    contact: "+1 (614) 555-4444",
    address: "321 Pine Lane, Westerville, OH",
    status: "Processing",
    orderTime: "2025-06-01T14:00:00Z",
    pizza: {
      productId: 225,
      productName: "Margherita",
      size: "Medium",
      crust: "Cheese Burst",
      baseSauce: "Tomato Sauce",
      cheese: "Extra Cheese",
      toppings: ["Basil", "Tomatoes"],
      addOns: [{ name: "Chili Flakes", quantity: 1 }],
      extras: {
        cutIntoSlices: true,
        wellDone: true,
        glutenFree: false,
        spicyLevel: "Medium",
      },
      specialInstructions: "Add extra basil on top.",
    },
    payment: {
      method: "Cash",
      amountPaid: 22.0,
      tip: 2.0,
    },
    estimatedDelivery: "2025-06-01T14:35:00Z",
  },
  {
    orderId: "A005",
    customerName: "Chris Lee",
    contact: "+1 (614) 555-5555",
    address: "654 Cedar Court, Gahanna, OH",
    status: "Pending",
    orderTime: "2025-06-01T14:15:00Z",
    pizza: {
      productId: 225,
      productName: "Meat Lovers",
      size: "Large",
      crust: "Stuffed Crust",
      baseSauce: "Tomato Garlic",
      cheese: "Mozzarella + Cheddar",
      toppings: ["Pepperoni", "Sausage", "Bacon", "Ham"],
      addOns: [
        { name: "Ranch Dip", quantity: 2 },
        { name: "Choco Lava Cake", quantity: 1 },
      ],
      extras: {
        cutIntoSlices: true,
        wellDone: true,
        glutenFree: false,
        spicyLevel: "Hot",
      },
      specialInstructions: "Box separately with addons.",
    },
    payment: {
      method: "Online (PayPal)",
      amountPaid: 48.0,
      tip: 5.0,
    },
    estimatedDelivery: "2025-06-01T14:50:00Z",
  },
  {
    orderId: "A006",
    customerName: "Alex Carter",
    contact: "+1 (614) 555-9012",
    address: "999 River Bend Drive, Columbus, OH 43215",
    status: "Making",
    orderTime: "2025-06-01T14:12:00Z",
    pizza: {
      productId: 301,
      productName: "BBQ Chicken",
      size: "Large",
      crust: "Hand Tossed",
      baseSauce: "BBQ Sauce",
      cheese: "Extra Mozzarella",
      toppings: ["Grilled Chicken", "Red Onions", "Green Peppers", "Cilantro"],
      addOns: [
        { name: "Ranch Dip", quantity: 2 },
        { name: "Garlic Bread", quantity: 1 },
      ],
      extras: {
        cutIntoSlices: true,
        wellDone: true,
        glutenFree: false,
        spicyLevel: "Medium",
      },
      specialInstructions:
        "Make sure it's extra crispy and packed separately from addons.",
    },
    payment: {
      method: "Online (Card)",
      amountPaid: 28.99,
      tip: 3.0,
    },
    estimatedDelivery: "2025-06-01T14:45:00Z",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-200 text-yellow-800";
    case "Processing":
      return "bg-blue-200 text-blue-800";
    case "Completed":
      return "bg-green-200 text-green-800";
    case "Cancelled":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState(pizzaOrders); // previously static array

  const handleRowClick = (order) => {
    if (order.status !== "Pending") return;
    const confirmed = window.confirm(
      `Are you sure you want to proceed with Order ${order.orderId}? Note : Once accepted, you won't be able to accept other orders before completing this one.`
    );
    if (confirmed) {
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const markAsCompleted = () => {
    const updatedOrders = orders.map((order) =>
      order.orderId === selectedOrder.orderId
        ? { ...order, status: "Completed" }
        : order
    );
    setOrders(updatedOrders);
    setSelectedOrder({ ...selectedOrder, status: "Completed" }); // update modal content
  };

  const markForDelivery = () => {
    const updatedOrders = orders.map((order) =>
      order.orderId === selectedOrder.orderId
        ? { ...order, status: "Out for Delivery" }
        : order
    );
    setOrders(updatedOrders);
    setSelectedOrder({ ...selectedOrder, status: "Completed" }); // update modal content
    setShowModal(false)
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className="container p-2 mx-auto sm:p-4 text-white">
        {/* Filters Grid */}
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
              <option value="Pepperoni">Pepperoni</option>
              <option value="Veggie Delight">Veggie Delight</option>
              <option value="BBQ Chicken">BBQ Chicken</option>
              <option value="Margherita">Margherita</option>
              <option value="Meat Lovers">Meat Lovers</option>
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
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <h2 className="mb-4 text-2xl font-semibold leading-tight text-black">
          Pizza Orders
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full p-6 text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="dark:bg-red-600">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Product ID</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Size</th>
                <th className="p-3">Qty (Add-ons)</th>
                <th className="p-3">Price ($)</th>
                <th className="p-3">Delivery Address</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="border-b dark:bg-gray-50 text-black dark:border-gray-300">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(order)}
                  className={`${
                    order.status === "Pending"
                      ? "cursor-pointer hover:bg-gray-200"
                      : "cursor-not-allowed opacity-70"
                  }`}
                >
                  <td className="px-3 py-2 font-medium text-md">
                    {order.orderId}
                  </td>
                  <td className="px-3 py-2">{order.customerName}</td>
                  <td className="px-3 py-2">{order.pizza.productId}</td>
                  <td className="px-3 py-2">{order.pizza.productName}</td>
                  <td className="px-3 py-2">{order.pizza.size}</td>
                  <td className="px-3 py-2">
                    {order.pizza.addOns.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </td>
                  <td className="px-3 py-2">
                    ${order.payment.amountPaid.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">{order.address}</td>
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
            {selectedOrder.status === "Pending" ? (
              <div className="bg-white text-black rounded-lg w-[90%] max-w-xl p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
                <div className="w-100 ">
                  {selectedOrder.status === "Pending" && (
                    <button
                      onClick={markAsCompleted}
                      className="absolute top-3 left-3 text-md font-bold bg-red-600 p-2 rounded-md text-white cursor-pointer"
                    >
                      Mark as completed
                    </button>
                  )}

                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-3 text-2xl font-bold text-gray-700 hover:text-black"
                  >
                    &times;
                  </button>
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-3 text-2xl font-bold text-gray-700 hover:text-black"
                  >
                    &times;
                  </button>
                </div>

                <div className="flex justify-center mt-5">
                  <Lottie
                    animationData={OrderAnimation}
                    loop={true}
                    style={{ height: 200 }}
                  />
                </div>

                <h2 className="text-2xl font-semibold text-center mb-4">
                  Preparing order {selectedOrder.orderId}!
                </h2>

                <div className="space-y-4 text-sm sm:text-base">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-red-600">
                      Customer Details
                    </h3>
                    <p>
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.contact}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedOrder.address}
                    </p>
                  </div>

                  {/* Pizza Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-red-600">
                      Pizza Details
                    </h3>
                    <p>
                      <strong>Pizza:</strong> {selectedOrder.pizza.productName}
                    </p>
                    <p>
                      <strong>Size:</strong> {selectedOrder.pizza.size}
                    </p>
                    <p>
                      <strong>Crust:</strong> {selectedOrder.pizza.crust}
                    </p>
                    <p>
                      <strong>Base Sauce:</strong>{" "}
                      {selectedOrder.pizza.baseSauce}
                    </p>
                    <p>
                      <strong>Cheese:</strong> {selectedOrder.pizza.cheese}
                    </p>
                    <p>
                      <strong>Toppings:</strong>{" "}
                      {selectedOrder.pizza.toppings.join(", ")}
                    </p>
                  </div>

                  {/* Addons & Extras */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-red-600">
                      Add-ons
                    </h3>
                    <ul className="list-disc ml-6">
                      {selectedOrder.pizza.addOns.map((addon, i) => (
                        <li key={i}>
                          {addon.name} ×{addon.quantity}
                        </li>
                      ))}
                    </ul>

                    <h3 className="font-semibold text-lg mt-3 mb-1 text-red-600">
                      Extras
                    </h3>
                    <p>
                      <strong>Sliced:</strong>{" "}
                      {selectedOrder.pizza.extras.cutIntoSlices ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Well Done:</strong>{" "}
                      {selectedOrder.pizza.extras.wellDone ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Gluten-Free:</strong>{" "}
                      {selectedOrder.pizza.extras.glutenFree ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Spicy Level:</strong>{" "}
                      {selectedOrder.pizza.extras.spicyLevel}
                    </p>
                    <p>
                      <strong>Note:</strong>{" "}
                      {selectedOrder.pizza.specialInstructions}
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-red-600">
                      Payment Summary
                    </h3>
                    <p>
                      <strong>Method:</strong> {selectedOrder.payment.method}
                    </p>
                    <p>
                      <strong>Amount Paid:</strong> $
                      {selectedOrder.payment.amountPaid.toFixed(2)}
                    </p>
                    <p>
                      <strong>Tip:</strong> $
                      {selectedOrder.payment.tip.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-center text-sm text-gray-600 mt-4 text-red-600">
                    Order ID: <strong>{selectedOrder.orderId}</strong>
                    <br />
                    Estimated Delivery:{" "}
                    <strong>
                      {new Date(
                        selectedOrder.estimatedDelivery
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white text-black rounded-lg w-[90%] max-w-xl p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
                <div className="flex flex-col items-center justify-center mt-5">
                  <Lottie
                    animationData={PackagingAnimation}
                    loop={true}
                    style={{ height: 200 }}
                  />

                  <strong className="text-lg text-bold text-gray-600 mt-4 text-red-600">
                    The box is being prepared ....
                  </strong>
                  <button
                    onClick={markForDelivery}
                    className="text-md mt-3 font-bold bg-red-600 p-2 rounded-md text-white cursor-pointer"
                  >
                    Set it out for delivery
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
