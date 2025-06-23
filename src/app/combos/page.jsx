"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/adminLayouts";
import axios from "axios";

const API_URL = "http://localhost:4001/api/specials";
const MENU_API_URL = "http://localhost:4001/api/menuitems"; // Assuming this exists

const Combos = () => {
  const [combos, setCombos] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(null);

  // Fetch combos and menu items
  useEffect(() => {
    fetchCombos();
    fetchMenuItems();
  }, []);

  const fetchCombos = async () => {
    const res = await axios.get(API_URL);
    setCombos(res.data);
  };

  const fetchMenuItems = async () => {
    const res = await axios.get(MENU_API_URL);
    setMenuItems(res.data);
  };

  const openModal = (combo = null) => {
    setCurrentCombo(combo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCombo(null);
    setModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newCombo = {
      name: form.name.value,
      description: form.description.value,
      price: parseFloat(form.price.value),
      isSpecial: true,
      items: [
        form.item1.value,
        form.item2.value,
        form.item3.value,
        form.item4.value,
      ].filter(Boolean),
    };

    try {
      if (currentCombo?._id) {
        await axios.put(`${API_URL}/${currentCombo._id}`, newCombo);
      } else {
        await axios.post(API_URL, newCombo);
      }
      fetchCombos();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this combo?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchCombos();
    }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {combos.map((combo) => (
            <div key={combo._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{combo.name}</h3>
              <p className="text-sm text-gray-500 italic mb-1">{combo.description}</p>
              <p className="text-sm text-gray-600">
                Items:{" "}
                {combo.items?.length > 0
                  ? combo.items.map((item) => item.name).join(", ")
                  : "None"}
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                Price: ${combo.price.toFixed(2)}
              </p>
              <div className="flex justify-between mt-2 text-sm">
                <button
                  onClick={() => openModal(combo)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(combo._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
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

              {[1, 2, 3, 4].map((num) => (
                <select
                  key={num}
                  name={`item${num}`}
                  defaultValue={currentCombo?.items?.[num - 1]?._id || ""}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Item {num} (optional)</option>
                  {menuItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} (${item.price}) - {item.category}
                    </option>
                  ))}
                </select>
              ))}

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
