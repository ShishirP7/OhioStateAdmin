"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/adminLayouts";
import axios from "axios";

const API_URL = "https://api.ohiostatepizzas.com/api/specials";
const MENU_API_URL = "https://api.ohiostatepizzas.com/api/menuitems";

const Combos = () => {
  const [combos, setCombos] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(null);
  const [comboItems, setComboItems] = useState([{ item: null, options: {} }]);
  const [imageBase64, setImageBase64] = useState("");

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
    if (combo) {
      const mappedItems = combo.items.map((ci) => ({
        item: ci.item || null,
        options: ci.options || {},
      }));
      setComboItems(mappedItems);
      setImageBase64(combo.image || "");
    } else {
      setComboItems([{ item: null, options: {} }]);
      setImageBase64("");
    }
    setCurrentCombo(combo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCombo(null);
    setModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newCombo = {
      name: form.name.value,
      description: form.description.value,
      price: parseFloat(form.price.value),
      isSpecial: true,
      image: imageBase64,
      items: comboItems.map((ci) => ({
        item: ci.item,
        options: ci.options || {},
      })),
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
            <div
              key={combo._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
            >
              {combo.image && (
                <img
                  src={combo.image.startsWith("data") ? combo.image : `data:image/jpeg;base64,${combo.image}`}
                  alt="combo"
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                {combo.name}
              </h3>
              {combo.description && (
                <p className="text-sm italic text-gray-500 mb-2">
                  {combo.description}
                </p>
              )}
              <div className="text-sm text-gray-700">
                <p className="font-medium">Items:</p>
                <ul className="list-disc ml-6 space-y-1">
                  {combo.items.map((ci, i) => (
                    <li key={i}>
                      <span className="font-semibold">
                        {ci.item?.name || "Unknown Item"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-sm text-gray-800 font-semibold">
                Price: ${combo.price.toFixed(2)}
              </p>
              <div className="flex justify-between mt-3 text-sm">
                <button
                  onClick={() => openModal(combo)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(combo._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
              onSubmit={handleSave}
              className="bg-white p-6 w-[600px] rounded shadow-lg max-h-[90vh] overflow-y-auto space-y-4"
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

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border px-3 py-2 rounded"
              />

              <div className="space-y-4">
                {comboItems.map((ci, index) => (
                  <div key={index} className="border p-3 rounded">
                    <select
                      value={ci.item?._id || ""}
                      onChange={(e) => {
                        const selectedItem = menuItems.find(
                          (mi) => mi._id === e.target.value
                        );
                        const updated = [...comboItems];
                        updated[index].item = selectedItem || null;
                        setComboItems(updated);
                      }}
                      className="w-full border px-3 py-2 rounded mb-2"
                    >
                      <option value="">Select Menu Item</option>
                      {menuItems.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name} (${item.price})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...comboItems];
                        updated.splice(index, 1);
                        setComboItems(updated);
                      }}
                      className="text-red-600 text-sm mt-2 block"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setComboItems([...comboItems, { item: null, options: {} }])
                  }
                  className="text-green-600 text-sm"
                >
                  + Add Another Item
                </button>
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
