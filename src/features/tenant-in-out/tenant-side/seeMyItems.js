import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MyTenantItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || []; // get items from navigation state

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition mb-4"
        >
          Back
        </button>
        <p className="text-center text-gray-500">No items found for this inventory.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Items</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Back
        </button>
      </div>

      <div className="overflow-x-auto shadow-xl rounded-lg bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="py-4 px-6 text-left font-semibold">Item Name</th>
              <th className="py-4 px-6 text-left font-semibold">Quantity</th>
              {/* <th className="py-4 px-6 text-left font-semibold">Status</th> */}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={idx}
                className={`transition duration-150 ease-in-out hover:bg-indigo-50 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                }`}
              >
                <td className="py-4 px-6 border-t border-gray-200">{item.itemName}</td>
                <td className="py-4 px-6 border-t border-gray-200">{item.quantity}</td>
                {/* <td className="py-4 px-6 border-t border-gray-200">{item.status}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTenantItems;
