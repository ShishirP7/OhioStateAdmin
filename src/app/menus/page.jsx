"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/adminLayouts";
import { Formik, Form, Field, FieldArray, getIn } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FiDelete, FiEdit } from "react-icons/fi";

const API_URL = "https://api.ohiostatepizzas.com/api/menuitems/";
const STORES_URL = "https://api.ohiostatepizzas.com/api/stores";
const CATEGORIES_URL = "https://api.ohiostatepizzas.com/api/category";

const menuValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").positive(),
  status: Yup.string().required(),
  options: Yup.object(),
  availabilityByStore: Yup.object(),
});

const NestedOptionFieldArray = ({ name, label }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <h4 className="font-semibold">{label}</h4>
      <label className="text-sm ml-2">
        <Field name={`${name}.isMultiple`} type="checkbox" className="ml-2" />{" "}
        Multiple
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
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => push({ label: "", priceModifier: 0 })}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs mt-1"
            >
              + Add {label}
            </button>
          </>
        );
      }}
    </FieldArray>
  </div>
);

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState("all");
  const [newCategory, setNewCategory] = useState({ name: "", addons: [] });
  const [newAddon, setNewAddon] = useState({
    name: "",
    priceModifier: 0,
    isMultiple: false,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORIES_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchStores();
    fetchCategories();
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

  const getFilteredMenus = () => {
    if (selectedStore === "all") return menus;
    return menus.map((item) => ({
      ...item,
      status: item.availabilityByStore?.[selectedStore] || "Unavailable",
    }));
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

  const handleCreateCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        alert("Category name cannot be empty");
        return;
      }
      await axios.post(CATEGORIES_URL, newCategory);
      setNewCategory({ name: "", addons: [] });
      setCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error creating category. Please try again.");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      addons: category.addons || []
    });
    setCategoryModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        alert("Category name cannot be empty");
        return;
      }
      await axios.patch(`${CATEGORIES_URL}/${editingCategory._id}`, newCategory);
      setEditingCategory(null);
      setNewCategory({ name: "", addons: [] });
      setCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error updating category. Please try again.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      // Check if any menu items are using this category
      const categoryToDelete = categories.find(c => c._id === deleteCategoryId);
      const itemsInCategory = menus.filter(
        item => item.category === categoryToDelete?.name
      );
      
      
      await axios.delete(`${CATEGORIES_URL}/${deleteCategoryId}`);
      fetchCategories();
      setConfirmDeleteOpen(false);
      setDeleteCategoryId(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category. Please try again.");
    }
  };

  const addAddonToCategory = () => {
    if (!newAddon.name.trim()) {
      alert("Addon name cannot be empty");
      return;
    }
    setNewCategory((prev) => ({
      ...prev,
      addons: [...prev.addons, newAddon],
    }));
    setNewAddon({ name: "", priceModifier: 0, isMultiple: false });
  };

  const removeAddonFromCategory = (index) => {
    setNewCategory((prev) => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index),
    }));
  };

  const getFieldsForCategory = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.addons?.map((addon) => addon.name.toLowerCase()) || [];
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

        <div className="w-100">
          <form className="w-full p-4 ml-[-15px]">
            <fieldset>
              <div className="relative border border-gray-300 text-gray-800 bg-white shadow-lg">
                <select
                  className="appearance-none w-full py-1 px-2 bg-white"
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                >
                  <option value="all">All stores</option>
                  {stores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 border-l">
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </fieldset>
          </form>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                {selectedStore !== "all" && (
                  <th className="p-3 text-left">Status</th>
                )}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredMenus().map((item) => (
                <tr key={item._id}>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">${item.price}</td>
                  {selectedStore !== "all" && (
                    <td className="p-3">{item.status}</td>
                  )}
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
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
                  availabilityByStore:
                    currentItem?.availabilityByStore ||
                    stores.reduce((acc, store) => {
                      acc[store._id] = "Unavailable";
                      return acc;
                    }, {}),
                }}
                validationSchema={menuValidationSchema}
                onSubmit={handleSave}
              >
                {({ values, setFieldValue }) => (
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

                    <div className="flex items-center gap-2">
                      <Field
                        name="category"
                        as="select"
                        className="w-full border px-3 py-2 rounded flex-1"
                        onChange={(e) => {
                          if (e.target.value === "add_category") {
                            setCategoryModalOpen(true);
                            setFieldValue("category", "");
                          } else {
                            setFieldValue("category", e.target.value);
                          }
                        }}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option
                            key={cat._id}
                            value={cat.name}
                            className="flex justify-between items-center"
                          >
                            {cat.name}
                          </option>
                        ))}
                        <option
                          value="add_category"
                          className="text-blue-600 font-semibold"
                        >
                          + Add New Category
                        </option>
                      </Field>
                      <button
                        type="button"
                        onClick={() => {
                          const selectedCategory = categories.find(
                            cat => cat.name === values.category
                          );
                          if (selectedCategory) {
                            handleEditCategory(selectedCategory);
                          }
                        }}
                        disabled={!values.category}
                        className={`p-2 rounded ${!values.category ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-50'}`}
                        title="Edit Category"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const selectedCategory = categories.find(
                            cat => cat.name === values.category
                          );
                          if (selectedCategory) {
                            setDeleteCategoryId(selectedCategory._id);
                            setConfirmDeleteOpen(true);
                          }
                        }}
                        disabled={!values.category}
                        className={`p-2 rounded ${!values.category ? 'text-gray-400' : 'text-red-500 hover:bg-red-50'}`}
                        title="Delete Category"
                      >
                        <FiDelete size={16} />
                      </button>
                    </div>

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
                      <h3 className="text-lg font-bold">
                        Availability By Store
                      </h3>
                      {stores.map((store) => (
                        <div
                          key={store._id}
                          className="flex justify-between items-center mb-1"
                        >
                          <label className="flex-1 text-sm text-gray-700">
                            {store.name}
                          </label>
                          <Field
                            as="select"
                            name={`availabilityByStore.${store._id}`}
                            className="border rounded px-2 py-1"
                          >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                          </Field>
                        </div>
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

        {categoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Addons</h3>
                  {newCategory.addons.map((addon, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 mb-2 p-2 bg-gray-100 rounded"
                    >
                      <span className="flex-1">
                        {addon.name} (${addon.priceModifier})
                      </span>
                      <span>{addon.isMultiple ? "Multiple" : "Single"}</span>
                      <button
                        onClick={() => removeAddonFromCategory(index)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-medium mb-2">Add New Addon</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newAddon.name}
                        onChange={(e) =>
                          setNewAddon({ ...newAddon, name: e.target.value })
                        }
                        placeholder="Addon Name"
                        className="border px-2 py-1 rounded col-span-2"
                      />
                      <input
                        type="number"
                        value={newAddon.priceModifier}
                        onChange={(e) =>
                          setNewAddon({ 
                            ...newAddon, 
                            priceModifier: parseFloat(e.target.value) || 0 
                          })
                        }
                        placeholder="Price"
                        className="border px-2 py-1 rounded"
                      />
                    </div>
                    <div className="flex items-center mt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAddon.isMultiple}
                          onChange={(e) =>
                            setNewAddon({ ...newAddon, isMultiple: e.target.checked })
                          }
                          className="mr-2"
                        />
                        Allow multiple selections
                      </label>
                      <button
                        onClick={addAddonToCategory}
                        className="ml-auto bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        + Add Addon
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setCategoryModalOpen(false);
                      setEditingCategory(null);
                      setNewCategory({ name: "", addons: [] });
                    }}
                    className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingCategory ? "Update" : "Save"} Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
              <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">Are you sure you want to delete this category? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmDeleteOpen(false)}
                  className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Menus;