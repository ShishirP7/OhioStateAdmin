import React from "react";
import AdminLayout from "../components/adminLayouts";

const pizzaOrders = [
  {
    orderId: "A001",
    customerName: "John Doe",
    pizzaType: "Pepperoni",
    quantity: 2,
    price: 24,
    address: "123 Elm Street, Columbus, OH",
  },
  {
    orderId: "A002",
    customerName: "Jane Smith",
    pizzaType: "Veggie Delight",
    quantity: 1,
    price: 12,
    address: "456 Oak Avenue, Dublin, OH",
  },
  {
    orderId: "A003",
    customerName: "Mike Johnson",
    pizzaType: "BBQ Chicken",
    quantity: 3,
    price: 36,
    address: "789 Maple Road, Hilliard, OH",
  },
  {
    orderId: "A004",
    customerName: "Emily Davis",
    pizzaType: "Margherita",
    quantity: 2,
    price: 22,
    address: "321 Pine Lane, Westerville, OH",
  },
  {
    orderId: "A005",
    customerName: "Chris Lee",
    pizzaType: "Meat Lovers",
    quantity: 4,
    price: 48,
    address: "654 Cedar Court, Gahanna, OH",
  },
];

const Orders = () => {
  return (
    <AdminLayout>
      <div className="container p-2 mx-auto sm:p-4 text-white">
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
          {/* Filter Dropdown */}
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
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-semibold leading-tight text-black">
          Pizza Orders
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full p-6 text-xs text-left whitespace-nowrap">
            <thead>
              <tr className="dark:bg-red-600">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Pizza Type</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price ($)</th>
                <th className="p-3">Delivery Address</th>
                <th className="p-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="border-b dark:bg-gray-50 text-black dark:border-gray-300">
              {pizzaOrders.map((order, index) => (
                <tr key={index}>
                  <td className="px-3 text-sm font-medium dark:text-gray-600">
                    {order.orderId}
                  </td>
                  <td className="px-3 py-2">{order.customerName}</td>
                  <td className="px-3 py-2">{order.pizzaType}</td>
                  <td className="px-3 py-2">{order.quantity}</td>
                  <td className="px-3 py-2">${order.price}</td>
                  <td className="px-3 py-2">{order.address}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      title="Edit Order"
                      className="p-1 rounded-full dark:text-gray-400 hover:dark:bg-gray-300 focus:dark:bg-gray-300"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
