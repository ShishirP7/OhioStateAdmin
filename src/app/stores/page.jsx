"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/adminLayouts";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Lottie from "lottie-react";
import NotAuth from "../../../Assets/NotAuth.json";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiClock,
  FiMail,
  FiLock,
} from "react-icons/fi";
import RouteGuard from "../RouteGuard";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});

  const initialStoreData = {
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      formatted: "",
    },
    phone: "",
    website: "",
    openTime: "",
    status: "Open",
    email: "",
    password: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  };

  const [storeData, setStoreData] = useState(initialStoreData);

  const validate = () => {
    const newErrors = {};

    if (!storeData.name.trim()) newErrors.name = "Name is required";
    if (!storeData.address.street.trim())
      newErrors.street = "Street address is required";
    if (!storeData.address.city.trim()) newErrors.city = "City is required";
    if (!storeData.address.state.trim()) newErrors.state = "State is required";
    if (!/^\d{5}(-\d{4})?$/.test(storeData.address.zipCode))
      newErrors.zipCode = "Invalid ZIP code";
    if (!/^(\()?\d{3}(\))?[- ]?\d{3}[- ]?\d{4}$/.test(storeData.phone))
      newErrors.phone = "Invalid phone number";
    if (
      !storeData.website ||
      !/^(http|https):\/\/[^ "]+$/.test(storeData.website)
    )
      newErrors.website = "Invalid URL";
    if (!storeData.openTime.trim())
      newErrors.openTime = "Open time is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeData.email))
      newErrors.email = "Invalid email";

    if (
      (!editingStore && !storeData.password) ||
      (editingStore && storeData.password && storeData.password.length < 6)
    ) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setStoreData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setStoreData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getAllStores = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("https://api.ohiostatepizzas.com/api/stores");
      setStores(res.data);
    } catch (err) {
      toast.error("Failed to fetch stores");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDetail = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.get(
        "https://api.ohiostatepizzas.com/api/employees/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserDetail();
    getAllStores();
  }, []);

  const handleSaveStore = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (editingStore) {
        await axios.put(
          `https://api.ohiostatepizzas.com/api/stores/${storeData._id}`,
          storeData
        );
        toast.success("Store updated successfully");
      } else {
        await axios.post(
          "https://api.ohiostatepizzas.com/api/stores",
          storeData
        );
        toast.success("Store added successfully");
      }
      getAllStores();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setStoreData({
      ...initialStoreData,
      ...store,
      password: "", // Don't show existing password
    });
    setIsModalOpen(true);
  };

  const handleDeleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    setIsLoading(true);
    try {
      await axios.delete(`https://api.ohiostatepizzas.com/api/stores/${id}`);
      toast.success("Store deleted successfully");
      getAllStores();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete store");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setEditingStore(null);
    setStoreData(initialStoreData);
    setErrors({});
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <RouteGuard requiredPermissions={["admin"]}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Store Management
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
            >
              <FiPlus /> Add Store
            </button>
          </div>

          {isLoading && !stores.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <div
                  key={store._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-bold text-lg text-gray-800">
                        {store.name}
                      </h2>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          store.status === "Open"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {store.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <FiMapPin className="mt-1 flex-shrink-0" />
                        <div>
                          <p>{store.address?.street}</p>
                          <p>
                            {store.address?.city}, {store.address?.state}{" "}
                            {store.address?.zipCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone />
                        <p>{store.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiGlobe />
                        <a
                          href={store.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {store.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock />
                        <p>{store.openTime}</p>
                      </div>
                      {store.email && (
                        <div className="flex items-center gap-2">
                          <FiMail />
                          <p>{store.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2">
                    <button
                      onClick={() => handleEditStore(store)}
                      className="flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store._id)}
                      className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
                  <h2 className="text-lg font-bold">
                    {editingStore ? "Edit Store" : "Add New Store"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Pizza Palace"
                      value={storeData.name}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address*
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        placeholder="123 Main St"
                        value={storeData.address.street}
                        onChange={handleInputChange}
                        className={`w-full border rounded px-3 py-2 ${
                          errors.street ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.street && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.street}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        placeholder="Columbus"
                        value={storeData.address.city}
                        onChange={handleInputChange}
                        className={`w-full border rounded px-3 py-2 ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State*
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        placeholder="OH"
                        maxLength="2"
                        value={storeData.address.state}
                        onChange={handleInputChange}
                        className={`w-full border rounded px-3 py-2 ${
                          errors.state ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code*
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        placeholder="43215"
                        value={storeData.address.zipCode}
                        onChange={handleInputChange}
                        className={`w-full border rounded px-3 py-2 ${
                          errors.zipCode ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone*
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="(614) 555-1234"
                      value={storeData.phone}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website*
                    </label>
                    <input
                      type="text"
                      name="website"
                      placeholder="https://yourstore.com"
                      value={storeData.website}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 ${
                        errors.website ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.website && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.website}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Hours*
                    </label>
                    <input
                      type="text"
                      name="openTime"
                      placeholder="10:00 AM - 9:00 PM"
                      value={storeData.openTime}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 ${
                        errors.openTime ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.openTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.openTime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={storeData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Temporarily Closed">
                        Temporarily Closed
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="manager@store.com"
                      value={storeData.email}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editingStore ? "New Password" : "Password*"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder={
                        editingStore
                          ? "Leave blank to keep current"
                          : "At least 6 characters"
                      }
                      value={storeData.password}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveStore}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editingStore ? "Updating..." : "Creating..."}
                      </span>
                    ) : editingStore ? (
                      "Update Store"
                    ) : (
                      "Create Store"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </RouteGuard>
    </AdminLayout>
  );
};

export default Stores;
