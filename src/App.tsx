import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('pantry');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      // fetch inventory data from firebase
      // for now, just mock data
      setInventory([
        { name: 'Item 1', quantity: 10 },
        { name: 'Item 2', quantity: 20 },
        { name: 'Item 3', quantity: 30 },
      ]);
    };
    fetchInventory();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { name: newItem, quantity: newQuantity }]);
    setIsModalOpen(false);
    setNewItem('');
    setNewQuantity(0);
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((item, i) => i !== index));
  };

  const handleEditItem = (index) => {
    const item = items[index];
    setNewItem(item.name);
    setNewQuantity(item.quantity);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-200 p-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
          onClick={() => setActiveTab('pantry')}
        >
          <i className="fas fa-warehouse" /> Pantry
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded mt-4"
          onClick={() => setActiveTab('inventory')}
        >
          <i className="fas fa-boxes" /> Inventory
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded mt-4"
          onClick={() => setActiveTab('recipes')}
        >
          <i className="fas fa-book" /> Recipes
        </button>
      </div>
      <div className="w-4/5 p-4">
        {activeTab === 'pantry' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Pantry Management</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Add new item
            </button>
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2 className="text-2xl font-bold">Add new item</h2>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Item name"
                      className="block w-full p-2 mb-4"
                    />
                    <input
                      type="number"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.valueAsNumber)}
                      placeholder="Quantity"
                      className="block w-full p-2 mb-4"
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleAddItem}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleEditItem(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
        {activeTab === 'inventory' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Inventory</h2>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search inventory"
              className="block w-full p-2 mb-4"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => console.log('Download PDF')}
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
                {filteredInventory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'recipes' && <div>Recipes</div>}
      </div>
    </div>
  );
};

export default App;