import React, { useEffect, useState } from "react";
import axios from "axios";

const RemainingTenants = () => {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}tenant/10days/remaining`);
        if (response.data) {
          setTenants(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTenants();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tenants Approaching Lease End</h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-3 dark:bg-gray-800">
        {tenants.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {tenants.map((tenant) => (
              <li key={tenant.id} className="py-4 flex items-center justify-between">
                <div className="text-lg font-medium">{tenant.fullName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{tenant.remainingDays} days remaining</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-300">No tenants found.</div>
        )}
      </div>
    </div>
  );
};

export default RemainingTenants;