import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table'

const LowStockItems = () => {
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Columns definition for TableComponent
  const columns = [
    { label: 'Item Name', key: 'itemName' },
    { label: 'Expiration Date', key: 'expirationDate' },
    { label: 'Amount', key: 'itemAmount' },
    { label: 'Unit', key: 'unit' },
    { label: 'Item Details', key: 'itemDetails' },
    { label: 'Item Type', key: 'itemType' },
    { label: 'Min Amount', key: 'min_amount' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => handleAction(row)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Action
        </button>
      ),
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    const fetchLowStockItems = async () => {
      const token = localStorage.getItem('token');
        
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/stockout/low-stock/check', {
          
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        setItemsData(response.data.items);
      } catch (error) {
        setError('An error occurred while fetching the low stock items.');
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  // Handle action for each item (e.g., sending alert, etc.)
  const handleAction = (item) => {
    alert(`Action for: ${item.itemName}`);
  };

  return (
    <div className="p-6">
      {/* Loading State */}
      {loading ? (
        <div className="text-center">
          <p>Loading low stock items...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <TableComponent
          title="Low Stock Items"
          data={itemsData}
          columns={columns}
        />
      )}
    </div>
  );
};

export default LowStockItems;
