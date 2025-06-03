"use client";
import React, { useState } from "react";
import AdminLayout from "../components/adminLayouts";
import { Formik, Form, Field, FieldArray, getIn } from "formik";
import * as Yup from "yup";
import { menuItems } from "../datas/menuData";

const menuValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").positive(),
  status: Yup.string().required(),
  options: Yup.object(),
});

const NestedOptionFieldArray = ({ name, label }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <h4 className="font-semibold">{label}</h4>
      <FieldArray name={name}>
        {({ push }) => (
          <button
            type="button"
            onClick={() => push({ label: "", priceModifier: 0 })}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
          >
            + Add
          </button>
        )}
      </FieldArray>
    </div>
    <FieldArray name={name}>
      {({ remove, form }) => {
        const items = getIn(form.values, name) || [];
        return items.map((opt, index) => (
          <div key={index} className="flex gap-2 mb-1">
            <Field
              name={`${name}[${index}].label`}
              placeholder="Label"
              className="flex-1 border px-2 py-1 rounded"
            />
            <Field
              name={`${name}[${index}].priceModifier`}
              type="number"
              placeholder="Price"
              className="w-24 border px-2 py-1 rounded"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ));
      }}
    </FieldArray>
  </div>
);

// Helper to decide which nested option fields to show based on category
const getFieldsForCategory = (category) => {
  const common = ["sizes", "addOns"];
  const pizza = ["base.sizes", "base.crusts", "base.sauces", "cut", "bake", "cheese", "meats", "veggies", "extras"];
  const drinks = ["sizes", "flavors"];
  const sides = ["sizes", "dips"];
  const burgers = ["sizes", "addOns", "sauces"];
  switch (category) {
    case "Pizzas":
      return pizza;
    case "Drinks":
      return drinks;
    case "Sides":
      return sides;
    case "Burgers":
      return burgers;
    default:
      return common;
  }
};

const Menus = () => {
  const [menus, setMenus] = useState(menuItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

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

  const handleSave = (values) => {
    const updatedItem = { ...values, id: currentItem?.id || Date.now() };
    if (currentItem) {
      setMenus((prev) =>
        prev.map((item) => (item.id === currentItem.id ? updatedItem : item))
      );
    } else {
      setMenus((prev) => [...prev, updatedItem]);
    }
    closeModal();
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Menu Items</h2>
          <button
            onClick={() => openModal()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Add New Item
          </button>
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
                <tr key={item.id}>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">${item.price}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
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
                  options: currentItem?.options || {},
                }}
                validationSchema={menuValidationSchema}
                onSubmit={handleSave}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="space-y-3">
                    <Field
                      name="name"
                      placeholder="Name"
                      className="w-full border px-3 py-2 rounded"
                    />
                    <Field
                      as="textarea"
                      name="description"
                      placeholder="Description"
                      className="w-full border px-3 py-2 rounded"
                    />
                    <Field
                      name="category"
                      as="select"
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Select Category</option>
                      <option value="Pizzas">Pizzas</option>
                      <option value="Burgers">Burgers</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Sides">Sides</option>
                    </Field>
                    <Field
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      className="w-full border px-3 py-2 rounded"
                    />
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
                    <Field
                      as="select"
                      name="status"
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </Field>

                    {/* Conditionally render nested option fields */}
                    <div className="mt-4 border-t pt-2">
                      <h3 className="text-lg font-bold">Options</h3>
                      {getFieldsForCategory(values.category).map((opt) => (
                        <NestedOptionFieldArray
                          key={opt}
                          name={`options.${opt}`}
                          label={opt.split(".").pop()}
                        />
                      ))}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            {showImageModal && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                onClick={() => setShowImageModal(false)}
              >
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
