import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyTenantItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant-items/my-items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch tenant items:', err);
        setError('Failed to load items. Please try again later.');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const columns = [
    { label: 'Item Name', key: 'itemName' },
    { label: 'Quantity', key: 'quantity' },
    {
      label: 'Registered At',
      key: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    { label: 'Status', key: 'status'},
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Inventory Items</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Back
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items found for your account.</p>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg bg-white">
          <table className="min-w-full text-sm text-gray-800">
            <thead>
              <tr className="bg-indigo-600 text-white">
                {columns.map((col) => (
                  <th key={col.key} className="py-4 px-6 text-left font-semibold">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => (
                <tr
                  key={row.id}
                  className={`transition duration-150 ease-in-out hover:bg-indigo-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-6 border-t border-gray-200">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTenantItems;
