import React from 'react';
import AdminLayout from '../components/adminLayouts';

const pizzaOrders = [
  {
    orderId: 'A001',
    customerName: 'John Doe',
    pizzaType: 'Pepperoni',
    quantity: 2,
    price: 24,
    address: '123 Elm Street, Columbus, OH'
  },
  {
    orderId: 'A002',
    customerName: 'Jane Smith',
    pizzaType: 'Veggie Delight',
    quantity: 1,
    price: 12,
    address: '456 Oak Avenue, Dublin, OH'
  },
  {
    orderId: 'A003',
    customerName: 'Mike Johnson',
    pizzaType: 'BBQ Chicken',
    quantity: 3,
    price: 36,
    address: '789 Maple Road, Hilliard, OH'
  },
  {
    orderId: 'A004',
    customerName: 'Emily Davis',
    pizzaType: 'Margherita',
    quantity: 2,
    price: 22,
    address: '321 Pine Lane, Westerville, OH'
  },
  {
    orderId: 'A005',
    customerName: 'Chris Lee',
    pizzaType: 'Meat Lovers',
    quantity: 4,
    price: 48,
    address: '654 Cedar Court, Gahanna, OH'
  }
];

const Orders = () => {
  return (
    <AdminLayout>
      <div className="container p-2 mx-auto sm:p-4 text-white">
        
        <h2 className="mb-4 text-2xl font-semibold leading-tight text-black">Pizza Orders</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full p-6 text-xs text-left whitespace-nowrap">
            <thead>
              <tr className="dark:bg-gray-800">
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
                  <td className="px-3 text-sm font-medium dark:text-gray-600">{order.orderId}</td>
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
