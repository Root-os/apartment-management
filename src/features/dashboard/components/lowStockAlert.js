import React, { useEffect, useState } from "react";
import axios from "axios";

const LowStockAlert = () => {
  const [items, setItems] = useState([]);

  const token=localStorage.getItem('token')

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}stockout/low-stock/check`,{
            headers:{
                Authorization:`Bearer ${token}` 
            }
        });
        if (response.data && response.data.items) {
          setItems(response.data.items);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLowStockItems();
  }, []);

  return (
    <div >
      <h1 className="text-2xl font-bold mb-4">Low Stock Alerts</h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 ">
        {items.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <li key={item.id} className="py-4">
                <div className="text-lg font-medium">{item.itemName}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                Amount: {Math.round(item.itemAmount)} {item.unit} (Min: {Math.round(item.min_amount)})
              </div>

              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-300">No low stock items found.</div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;