"use client";
import React, { useState } from "react";
import AdminLayout from "../components/adminLayouts";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";

export const initialMenuItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar, lettuce, tomato, and pickles",
    category: "Burgers",
    price: 9.99,
    image: "/images/classic-cheeseburger.jpg",
    status: "Available",
    addOns: [
      { name: "Extra Cheese", price: 1.0 },
      { name: "Bacon", price: 1.5 },
    ],
    sizes: [
      { label: "Single", priceModifier: 0 },
      { label: "Double", priceModifier: 2 },
    ],
  },
];

const menuValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").positive(),
  status: Yup.string().required(),
  image: Yup.string().url("Must be a valid URL"),
  addOns: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Addon name is required"),
      price: Yup.number().required("Addon price is required").min(0),
    })
  ),
  sizes: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required("Size label is required"),
      priceModifier: Yup.number().required("Modifier is required").min(0),
    })
  ),
});

const Menus = () => {
  const [menus, setMenus] = useState(initialMenuItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const openModal = (item = null) => {
    setCurrentItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentItem(null);
    setModalOpen(false);
  };

  const handleSave = (values) => {
    const updatedItem = {
      ...values,
      id: currentItem?.id || Date.now(),
    };

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
                <tr key={item.id} className="">
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

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
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
                  addOns: currentItem?.addOns || [],
                  sizes: currentItem?.sizes || [],
                }}
                validationSchema={menuValidationSchema}
                onSubmit={handleSave}
              >
                {({ values, errors, touched }) => (
                  <Form className="space-y-3">
                    <Field
                      name="name"
                      placeholder="Name"
                      className="w-full border px-3 py-2 rounded"
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-xs">{errors.name}</p>
                    )}

                    <Field
                      as="textarea"
                      name="description"
                      placeholder="Description"
                      className="w-full border px-3 py-2 rounded"
                    />

                    <Field
                      name="category"
                      placeholder="Category"
                      className="w-full border px-3 py-2 rounded"
                    />
                    {errors.category && touched.category && (
                      <p className="text-red-500 text-xs">{errors.category}</p>
                    )}

                    <Field
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      className="w-full border px-3 py-2 rounded"
                    />
                    {errors.price && touched.price && (
                      <p className="text-red-500 text-xs">{errors.price}</p>
                    )}

                    <Field
                      name="image"
                      placeholder="Image URL"
                      className="w-full border px-3 py-2 rounded"
                    />
                    {errors.image && touched.image && (
                      <p className="text-red-500 text-xs">{errors.image}</p>
                    )}

                    <Field
                      as="select"
                      name="status"
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </Field>

                    {/* Add-ons */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold">Add-ons</h4>
                        <FieldArray name="addOns">
                          {({ push }) => (
                            <button
                              type="button"
                              onClick={() => push({ name: "", price: 0 })}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                            >
                              + Add
                            </button>
                          )}
                        </FieldArray>
                      </div>
                      <FieldArray name="addOns">
                        {({ remove, form }) =>
                          form.values.addOns.map((addon, index) => (
                            <div key={index} className="flex gap-2 mb-1">
                              <Field
                                name={`addOns[${index}].name`}
                                placeholder="Name"
                                className="flex-1 border px-2 py-1 rounded"
                              />
                              <Field
                                name={`addOns[${index}].price`}
                                type="number"
                                step="0.01"
                                placeholder="Price"
                                className="w-20 border px-2 py-1 rounded"
                              />
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500"
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        }
                      </FieldArray>
                    </div>

                    {/* Sizes */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold">Sizes</h4>
                        <FieldArray name="sizes">
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
                      <FieldArray name="sizes">
                        {({ remove, form }) =>
                          form.values.sizes.map((size, index) => (
                            <div key={index} className="flex gap-2 mb-1">
                              <Field
                                name={`sizes[${index}].label`}
                                placeholder="Label"
                                className="flex-1 border px-2 py-1 rounded"
                              />
                              <Field
                                name={`sizes[${index}].priceModifier`}
                                type="number"
                                step="0.01"
                                placeholder="Modifier"
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
                          ))
                        }
                      </FieldArray>
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
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Menus;
