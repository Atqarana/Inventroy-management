// src/App.tsx
// src/App.tsx
import React, { useState, useEffect } from "react";
import { db, storage } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

interface Item {
  name: string;
  quantity: number;
}

const App = () => {
  const [activeTab, setActiveTab] = useState("pantry");
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const itemsCollection = collection(db, "items");
      const querySnapshot = await getDocs(itemsCollection);
      const itemsData = querySnapshot.docs.map((doc) => doc.data() as Item);
      setItems(itemsData);
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    const itemsCollection = collection(db, "items");
    await addDoc(itemsCollection, newItem);
    setItems([...items, newItem]);
    setNewItem({ name: "", quantity: 0 });
    setIsModalOpen(false);
  };

  const handleDeleteItem = async (index: number) => {
    const item = items[index];
    const itemsCollection = collection(db, "items");
    const q = query(itemsCollection, where("name", "==", item.name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(itemsCollection, docId));
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleEditItem = async (index: number) => {
    const item = items[index];
    setNewItem(item);
    setIsModalOpen(true);
  };

  const handleUpdateQuantity = async (index: number, quantity: number) => {
    const item = items[index];
    const itemsCollection = collection(db, "items");
    const q = query(itemsCollection, where("name", "==", item.name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      const itemDoc = doc(itemsCollection, docId);
      await updateDoc(itemDoc, { quantity });
      setItems(
        items.map((item, i) => (i === index ? { ...item, quantity } : item))
      );
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-200 p-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
          onClick={() => setActiveTab("pantry")}
        >
          <i className="fas fa-warehouse" /> Pantry
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded mt-4"
          onClick={() => setActiveTab("inventory")}
        >
          <i className="fas fa-boxes" /> Inventory
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded mt-4"
          onClick={() => setActiveTab("recipes")}
        >
          <i className="fas fa-book" /> Recipes
        </button>
      </div>
      <div className="w-4/5 p-4">
        {activeTab === "pantry" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Pantry Management</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Add new item
            </button>
            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded shadow-md">
                  <h2 className="text-xl font-bold mb-4">Add new item</h2>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    placeholder="Item name"
                    className="block w-full p-2 mb-4 border border-gray-400"
                  />
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        quantity: parseInt(e.target.value, 10),
                      })
                    }
                    placeholder="Quantity"
                    className="block w-full p-2 mb-4 border border-gray-400"
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    onClick={handleAddItem}
                  >
                    Add
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded ml-4"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th className="text-left">Item name</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                        onClick={() =>
                          handleUpdateQuantity(index, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded ml-2"
                        onClick={() =>
                          handleUpdateQuantity(index, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <button
                        className="bg-gray-300 hover:bg-gray-400 py-1 px-2 rounded ml-2"
                        onClick={() => handleEditItem(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ml-2"
                        onClick={() => handleDeleteItem(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "inventory" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Inventory</h2>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory"
              className="block w-full p-2 mb-4 border border-gray-400"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={() => console.log("Download PDF")}
            >
              Download PDF
            </button>
            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "recipes" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recipes</h2>
            {/* Recipes content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
