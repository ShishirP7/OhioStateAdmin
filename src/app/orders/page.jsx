"use client";
import React, { useRef, useState } from "react";
import AdminLayout from "../components/adminLayouts";
import Lottie from "lottie-react";
import OrderAnimation from "../../../Assets/Preparing.json";
import PackagingAnimation from "../../../Assets/Packaging.json";
import Receipt from "../components/Recipt";

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
    case "Making":
      return "bg-blue-200 text-blue-800";
    case "Completed":
      return "bg-green-200 text-green-800";
    case "Cancelled":
      return "bg-red-200 text-red-800";
    case "Packaging":
      return "bg-purple-200 text-purple-800";
    case "Out for Delivery":
      return "bg-orange-200 text-orange-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState(pizzaOrders);
  const [isOpen, setIsOpen] = useState(false);
  const printRef = useRef();

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

    body {
      width: 80mm;
      font-family: monospace;
      font-size: 12px;
      background: #fff;
    }

    #invoice-POS {
      width: 80mm;
      padding: 0;
      margin: 0 auto;
      margin-top:-20px;
    }

    #invoice-POS #top {
      padding-top: 0;
    }

    .logo {
      width: 60px;
      height: 60px;
      background-size: contain;
      margin: 0 auto;
    }

    h2, h3, p {
      margin: 0;
      padding: 2px 0;
      text-align: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    td {
      padding: 4px 0;
      text-align: left;
    }

    .legal {
      font-size: 10px;
      margin-top: 8px;
      text-align: center;
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

  const handleChange = (newStatus) => {
    // Update the orders state
    const updatedOrders = orders.map((order) =>
      order.orderId === selectedOrder.orderId
        ? { ...order, status: newStatus }
        : order
    );
    setOrders(updatedOrders);

    // Update the selectedOrder in the modal
    setSelectedOrder((prev) => ({ ...prev, status: newStatus }));

    setIsOpen(false);
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const markAsCompleted = () => {
    const updatedOrders = orders.map((order) =>
      order.orderId === selectedOrder.orderId
        ? { ...order, status: "Completed" }
        : order
    );
    setOrders(updatedOrders);
    setSelectedOrder({ ...selectedOrder, status: "Completed" });
  };

  const markForDelivery = () => {
    const updatedOrders = orders.map((order) =>
      order.orderId === selectedOrder.orderId
        ? { ...order, status: "Out for Delivery" }
        : order
    );
    setOrders(updatedOrders);
    setSelectedOrder({ ...selectedOrder, status: "Out for Delivery" });
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const statusMessage = () => {
    if (!selectedOrder) return "";

    switch (selectedOrder.status) {
      case "Pending":
        return "New order received. Awaiting action.";
      case "Making":
        return "The kitchen is preparing the order.";
      case "Packaging":
        return "The order is ready and being packaged.";
      case "Out for Delivery":
        return "The order has left the restaurant for delivery.";
      case "Completed":
        return "Order has been delivered successfully!";
      case "Cancelled":
        return "Order has been cancelled.";
      default:
        return "Unknown order status.";
    }
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
              <option value="Making">Making</option>
              <option value="Packaging">Packaging</option>
              <option value="Out for Delivery">Out for Delivery</option>
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
                  className="cursor-pointer hover:bg-gray-100"
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

                  {/* Dropdown Menu */}
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
                        "Pending",
                        "Making",
                        "Packaging",
                        "Out for Delivery",
                        "Completed",
                        "Cancelled",
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
                {statusMessage()} {selectedOrder.orderId}!
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
                    <strong>Base Sauce:</strong> {selectedOrder.pizza.baseSauce}
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
                <div>
                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4"
                  >
                    🖨️ Print Receipt
                  </button>

                  {/* Printable Area */}
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
