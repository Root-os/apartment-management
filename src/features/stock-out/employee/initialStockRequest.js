import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddStockOutRequestPage = () => {
  const [items, setItems] = useState([]); // List of items from API
  const [selectedItemId, setSelectedItemId] = useState(''); // Selected item ID
  const [source, setSource] = useState('store'); // Source (store, warehouse, supplier)
  const [reason, setReason] = useState(''); // Reason for stockout
  const [requestedQuantity, setRequestedQuantity] = useState(0); // Requested Quantity
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://apartment.houseethiopia.com/api/items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data); // Set items data from API
      } catch (error) {
        setError('Error fetching items.');
        console.error('Error fetching items', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId || !reason || !requestedQuantity) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        itemId: selectedItemId,
        source: source,
        reason: reason,
        requestedQuantity: requestedQuantity,
      };

      const response = await axios.post(
        'https://apartment.houseethiopia.com/api/stockout/request',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        alert('Stockout request added successfully');
      }
    } catch (error) {
      setError('Failed to add stockout request');
      console.error('Error adding stockout request', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Add Stockout Request</h2>

      {loading ? (
        <div className="text-center">Loading items...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* Item Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Item</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </div>

          {/* Source Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="store">Store</option>
              <option value="warehouse">Warehouse</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          {/* Reason Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Requested Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Requested Quantity</label>
            <input
              type="number"
              value={requestedQuantity}
              onChange={(e) => setRequestedQuantity(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default AddStockOutRequestPage;
