"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/adminLayouts";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
    zipCode: "",
    phone: "",
    website: "",
    openTime: "",
    status: "Open",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  const getAllStores = () => {
    axios
      .get("https://66.94.97.165:4001/api/stores")
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllStores();
  }, []);

  console.log(storeData);
  const handleSaveStore = () => {
    if (
      !storeData.name ||
      !storeData.address ||
      !storeData.zipCode ||
      !storeData.phone ||
      !storeData.website ||
      !storeData.openTime ||
      !storeData.email ||
      !storeData.password
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingStore) {
      console.log(stores);
      axios
        .put(`https://66.94.97.165:4001/api/stores/${storeData._id}`, storeData)
        .then((res) => {
          toast.success("Store updated sucessfully.");
          getAllStores();
          closeModal();
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    } else {
      axios
        .post("https://66.94.97.165:4001/api/stores", storeData)
        .then((res) => {
          toast.success("Store added sucessfully.");
          getAllStores();
          closeModal();
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    }
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setStoreData(store);
    setIsModalOpen(true);
  };

  const handleDeleteStore = (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      axios
        .delete(`https://66.94.97.165:4001/api/stores/${id}`)
        .then((res) => {
          toast.success("Store has been removed.");
          getAllStores();
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    }
  };

  const closeModal = () => {
    setEditingStore(null);
    setStoreData({
      name: "",
      address: "",
      phone: "",
      website: "",
      openTime: "",
      status: "Open",
      email: "",
      password: "",
    });
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Owner Panel - Stores
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Add Store
          </button>
        </div>

        {/* Store List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <div
              key={store._id}
              className="bg-white rounded shadow p-4 flex flex-col justify-between border border-gray-200"
            >
              <div>
                <h2 className="font-bold text-lg text-gray-800 mb-1">
                  {store.name}
                </h2>
                <p className="text-gray-600 text-sm">{store.address}</p>
                <p className="text-gray-600 text-sm">Phone: {store.phone}</p>
                <p className="text-gray-600 text-sm">
                  Website: {store.website}
                </p>
                <p className="text-gray-600 text-sm">
                  Open Time: {store.openTime}
                </p>
                <p
                  className={`text-sm font-medium ${
                    store.status === "Open" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {store.status}
                </p>
                {store.email && (
                  <p className="text-gray-600 text-sm">Login: {store.email}</p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditStore(store)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStore(store._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 mx-4 relative">
              <h2 className="text-lg font-bold mb-4">
                {editingStore ? "Edit Store" : "Add Store"}
              </h2>
              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Store Name"
                  value={storeData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={storeData.address}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={storeData.zipCode || 0}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={storeData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                />
                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={storeData.website}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                />
                <input
                  type="text"
                  name="openTime"
                  placeholder="Open Time (e.g. 10:00 AM - 9:00 PM)"
                  value={storeData.openTime}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                />
                <select
                  name="status"
                  value={storeData.status}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
                <input
                  type="email"
                  name="email"
                  placeholder="Login Email"
                  value={storeData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Login Password"
                  value={storeData.password}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStore}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  {editingStore ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Stores;
