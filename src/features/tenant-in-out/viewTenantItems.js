import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const TenantItems = () => {
  const { id: phoneNumber } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        const response = await api.get(`/tenant-items/tenant/${phoneNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setItems(response.data.tenants[0]?.items || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch tenant items:', err);
        setError('Failed to load items. Please try again later.');
        setLoading(false);
      }
    };

    fetchItems();
  }, [phoneNumber]);

  const columns = [
    { label: 'Item Name', key: 'itemName' },
    { label: 'Quantity', key: 'quantity' },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenant Items</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items found for this tenant.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="min-w-full text-sm text-gray-800">
            <thead>
              <tr className="bg-indigo-600 text-white">
                {columns.map((col) => (
                  <th key={col.key} className="py-4 px-6 text-left font-semibold tracking-wide">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => (
                <tr
                  key={`${row.itemName}-${index}`}
                  className={`transition hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-6 border-t border-gray-200">
                      {row[col.key]}
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

export default TenantItems;
