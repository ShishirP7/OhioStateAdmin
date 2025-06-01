"use client";
import React, { useState } from "react";
import AdminLayout from "../components/adminLayouts";

export const initialMenuItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar, lettuce, tomato, and pickles",
    category: "Burgers",
    price: 9.99,
    image: "",
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
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, tomatoes, basil, and olive oil",
    category: "Pizzas",
    price: 12.99,
    image: "",
    status: "Available",
    addOns: [],
    sizes: [
      { label: "Small", priceModifier: 0 },
      { label: "Medium", priceModifier: 2 },
      { label: "Large", priceModifier: 4 },
    ],
  },
  {
    id: 3,
    name: "French Fries",
    description: "Crispy golden fries",
    category: "Sides",
    price: 3.99,
    image: "",
    status: "Available",
    addOns: [],
    sizes: [],
  },
  {
    id: 4,
    name: "Cola",
    description: "Refreshing cold drink",
    category: "Drinks",
    price: 2.5,
    image: "",
    status: "Available",
    addOns: [],
    sizes: [],
  },
];

const Combos = () => {
  const [combos, setCombos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const openModal = (combo = null) => {
    setCurrentCombo(combo);
    setPreviewImage(combo?.image || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCombo(null);
    setModalOpen(false);
    setPreviewImage(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const items = [
      formData.get("item1"),
      formData.get("item2"),
      formData.get("item3"),
      formData.get("item4"),
    ].filter(Boolean);

    const newCombo = {
      id: currentCombo?.id || Date.now(),
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      image: previewImage || "",
      items: items.map((itemId) => {
        return initialMenuItems.find((m) => m.id === parseInt(itemId));
      }),
    };

    if (currentCombo) {
      setCombos((prev) =>
        prev.map((c) => (c.id === currentCombo.id ? newCombo : c))
      );
    } else {
      setCombos((prev) => [...prev, newCombo]);
    }

    closeModal();
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Combos</h2>
          <button
            onClick={() => openModal()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Add New Combo
          </button>
        </div>

        {/* Combo list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white p-4 rounded shadow">
              {combo.image && (
                <img
                  src={combo.image}
                  alt={combo.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-lg font-semibold">{combo.name}</h3>
              <p className="text-sm text-gray-500 italic mb-1">
                {combo.description}
              </p>
              <p className="text-sm text-gray-600">
                Items: {combo.items.map((item) => item.name).join(", ")}
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                Price: ${combo.price}
              </p>
              <button
                onClick={() => openModal(combo)}
                className="mt-2 text-blue-500 hover:underline"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
              onSubmit={handleSave}
              className="bg-white p-6 w-[500px] rounded shadow-lg max-h-[90vh] overflow-y-auto space-y-4"
            >
              <h2 className="text-lg font-bold">
                {currentCombo ? "Edit Combo" : "Add New Combo"}
              </h2>

              <input
                name="name"
                placeholder="Combo Name"
                defaultValue={currentCombo?.name || ""}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <textarea
                name="description"
                placeholder="Combo Description"
                defaultValue={currentCombo?.description || ""}
                className="w-full border px-3 py-2 rounded"
              />

              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                defaultValue={currentCombo?.price || ""}
                className="w-full border px-3 py-2 rounded"
                required
              />

              {/* Dropdowns for selecting items */}
              {[1, 2, 3, 4].map((num) => (
                <select
                  key={num}
                  name={`item${num}`}
                  defaultValue={currentCombo?.items?.[num - 1]?.id || ""}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Item {num} (optional)</option>
                  {initialMenuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (${item.price}) - {item.category}
                    </option>
                  ))}
                </select>
              ))}

              {/* Image upload */}
              <div>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded mb-2 cursor-pointer"
                    onClick={() => window.open(previewImage, "_blank")}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block border px-3 py-2 rounded w-full"
                />
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
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Combos;
