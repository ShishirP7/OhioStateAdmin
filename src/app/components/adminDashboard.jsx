"use client";
import React, { useState } from "react";

const AdminRoles = () => {
  const [stores, setStores] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
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

  const handleAddStore = () => {
    if (
      !storeData.name ||
      !storeData.address ||
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
      // Update existing store
      setStores(
        stores.map((s) => (s.id === editingStore.id ? { ...storeData, id: s.id } : s))
      );
      setEditingStore(null);
    } else {
      // Add new store
      const newBranch = { ...storeData, id: Date.now() };
      setStores([...stores, newBranch]);
    }

    // Reset form and close
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
    setIsAdding(false);
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setStoreData({ ...store });
    setIsAdding(true);
  };

  const handleDeleteStore = (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      setStores(stores.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Owner Panel - Manage Stores</h1>

      {/* Add Store Button */}
      {!isAdding && (
        <button
          onClick={() => {
            setEditingStore(null);
            setIsAdding(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Store
        </button>
      )}

      {/* Add/Edit Store Form */}
      {isAdding && (
        <div className="bg-gray-100 p-4 rounded mb-4 space-y-2">
          <h2 className="text-lg font-semibold">
            {editingStore ? "Edit Store Details" : "New Store Details"}
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Store Name"
            value={storeData.name}
            onChange={handleInputChange}
            className="border p-1 w-full"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={storeData.address}
            onChange={handleInputChange}
            className="border p-1 w-full"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={storeData.phone}
            onChange={handleInputChange}
            className="border p-1 w-full"
          />

          <input
            type="text"
            name="website"
            placeholder="Website Link"
            value={storeData.website}
            onChange={handleInputChange}
            className="border p-1 w-full"
          />

          <input
            type="text"
            name="openTime"
            placeholder="Open Time (e.g. 10:00 AM - 9:00 PM)"
            value={storeData.openTime}
            onChange={handleInputChange}
            className="border p-1 w-full"
          />

          <select
            name="status"
            value={storeData.status}
            onChange={handleInputChange}
            className="border p-1 w-full"
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
            className="border p-1 w-full"
          />

          <input
            type="password"
            name="password"
            placeholder="Login Password"
            value={storeData.password}
            onChange={handleInputChange}
            className="border p-1 w-full"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddStore}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              {editingStore ? "Update" : "Add"}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
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
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Store List */}
      <div>
        {stores.map((store) => (
          <div
            key={store.id}
            className="border p-3 mb-2 rounded bg-white shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{store.name}</p>
              <p className="text-sm text-gray-600">{store.address}</p>
              <p className="text-sm">Phone: {store.phone}</p>
              <p className="text-sm">Website: {store.website}</p>
              <p className="text-sm">Open Time: {store.openTime}</p>
              <p className="text-sm">Status: {store.status}</p>
              <p className="text-sm">Login Email: {store.email}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditStore(store)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteStore(store.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRoles;
