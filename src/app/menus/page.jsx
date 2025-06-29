"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/adminLayouts";
import { Formik, Form, Field, FieldArray, getIn } from "formik";
import * as Yup from "yup";
import axios from "axios";

<<<<<<< HEAD
const API_URL = "api.ohiostatepizzas.com/api/menuitems/";
const STORES_URL = "api.ohiostatepizzas.com/api/stores";
=======
const API_URL = "https://api.ohiostatepizzas.com/api/menuitems/";
const STORES_URL = "https://api.ohiostatepizzas.com/api/stores";
<<<<<<< HEAD
>>>>>>> 6d3012232e0d127f706414a91ccfae66ea0d74e3

=======
>>>>>>> e791644b54e112a46da0ce3b972bcd1f0d32cb63
const 
defaultOptions = {
  sizes: { isMultiple: false, values: [] },
  addOns: { isMultiple: false, values: [] },
  crusts: { isMultiple: false, values: [] },
  sauces: { isMultiple: false, values: [] },
  meats: { isMultiple: false, values: [] },
  veggies: { isMultiple: false, values: [] },
  dips: { isMultiple: false, values: [] },
  flavors: { isMultiple: false, values: [] },
  extras: { isMultiple: false, values: [] }
};

const menuValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").positive(),
  status: Yup.string().required(),
  options: Yup.object(),
  availabilityByStore: Yup.object()
});

const NestedOptionFieldArray = ({ name, label }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <h4 className="font-semibold">{label}</h4>
      <label className="text-sm ml-2">
        <Field name={`${name}.isMultiple`} type="checkbox" className="ml-2" /> Multiple
      </label>
    </div>
    <FieldArray name={`${name}.values`}>
      {({ push, remove, form }) => {
        const items = getIn(form.values, `${name}.values`) || [];
        return (
          <>
            {items.map((_, index) => (
              <div key={index} className="flex gap-2 mb-1">
                <Field
                  name={`${name}.values[${index}].label`}
                  placeholder="Label"
                  className="flex-1 border px-2 py-1 rounded"
                />
                <Field
                  name={`${name}.values[${index}].priceModifier`}
                  type="number"
                  placeholder="Price"
                  className="w-24 border px-2 py-1 rounded"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500"
                >✕</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => push({ label: "", priceModifier: 0 })}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs mt-1"
            >+ Add {label}</button>
          </>
        );
      }}
    </FieldArray>
  </div>
);

const getFieldsForCategory = (category) => {
  const pizza = ["sizes", "crusts", "sauces", "meats", "veggies", "extras"];
  const drinks = ["sizes", "flavors"];
  const sides = ["sizes", "dips"];
  const burgers = ["sizes", "addOns", "sauces"];
  switch (category) {
    case "Pizzas": return pizza;
    case "Drinks": return drinks;
    case "Sides": return sides;
    case "Burgers": return burgers;
    default: return ["sizes", "addOns"];
  }
};

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [stores, setStores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchMenus = async () => {
    try {
      const res = await axios.get(API_URL);
      setMenus(res.data);
    } catch (err) {
      console.error("Failed to fetch menu items", err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get(STORES_URL);
      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores", err);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchStores();
  }, []);

  const openModal = (item = null) => {
    setCurrentItem(item);
    setPreviewImage(item?.image || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentItem(null);
    setModalOpen(false);
    setPreviewImage(null);
  };

  const handleSave = async (values) => {
    try {
      if (currentItem?._id) {
        await axios.put(`${API_URL}${currentItem._id}`, values);
      } else {
        await axios.post(API_URL, values);
      }
      fetchMenus();
      closeModal();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Menu Items</h2>
          <button
            onClick={() => openModal()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >Add New Item</button>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((item) => (
                <tr key={item._id}>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">${item.price}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-500 hover:underline"
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:underline"
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">
                {currentItem ? "Edit Item" : "Add New Item"}
              </h2>
              <Formik
                initialValues={{
                  name: currentItem?.name || "",
                  description: currentItem?.description || "",
                  category: currentItem?.category || "",
                  price: currentItem?.price || "",
                  status: currentItem?.status || "Available",
                  image: currentItem?.image || "",
                  options: currentItem?.options || defaultOptions,
                  availabilityByStore: stores.reduce((acc, store) => {
                    acc[store._id] = currentItem?.availabilityByStore?.[store._id] || "Unavailable";
                    return acc;
                  }, {})
                }}
                validationSchema={menuValidationSchema}
                onSubmit={handleSave}
              >
                {({ values, setFieldValue }) => (
                  <Form className="space-y-3">
                    <Field name="name" placeholder="Name" className="w-full border px-3 py-2 rounded" />
                    <Field as="textarea" name="description" placeholder="Description" className="w-full border px-3 py-2 rounded" />
                    <Field name="category" as="select" className="w-full border px-3 py-2 rounded">
                      <option value="">Select Category</option>
                      <option value="Pizzas">Pizzas</option>
                      <option value="Burgers">Burgers</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Sides">Sides</option>
                    </Field>
                    <Field name="price" type="number" step="0.01" placeholder="Price" className="w-full border px-3 py-2 rounded" />

                    {previewImage && (
                      <div className="mb-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => setShowImageModal(true)}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewImage(reader.result);
                            setFieldValue("image", reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block border px-3 py-2 rounded w-full"
                    />
                    <Field as="select" name="status" className="w-full border px-3 py-2 rounded">
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </Field>

                    <div className="mt-4 border-t pt-2">
                      <h3 className="text-lg font-bold">Options</h3>
                      {getFieldsForCategory(values.category).map((opt) => (
                        <NestedOptionFieldArray
                          key={opt}
                          name={`options.${opt}`}
                          label={opt.charAt(0).toUpperCase() + opt.slice(1)}
                        />
                      ))}
                    </div>

                    <div className="mt-4 border-t pt-2">
                      <h3 className="text-lg font-bold">Availability By Store</h3>
                      {stores.map((store) => (
                        <div key={store._id} className="flex justify-between items-center mb-1">
                          <label className="flex-1 text-sm text-gray-700">{store.name}</label>
                          <Field as="select" name={`availabilityByStore.${store._id}`} className="border rounded px-2 py-1">
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                          </Field>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={closeModal} className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                      <button type="submit" className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Save</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            {showImageModal && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
                <img
                  src={previewImage}
                  alt="Large preview"
                  className="max-w-full max-h-full rounded shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Menus;
