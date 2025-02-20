import React, { useState, useEffect } from "react";
import axios from "axios";

const ParkingList = () => {
  const [parkingData, setParkingData] = useState([]);

  useEffect(() => {
    axios
      .get("https://apartment.houseethiopia.com/api/parking")
      .then((response) => {
        setParkingData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching parking data:", error);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Parking Information</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-6 text-sm font-medium text-gray-600">Car Plate</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-600">Car Name</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-600">Driver Name</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-600">Driver Phone</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-600">Tenant Name</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-600">Time In</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-600">Time Out</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {parkingData.map((parking) => (
              <tr key={parking.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-800">{parking.carPlate}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{parking.carName}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{parking.driverName}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{parking.driverPhone}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{parking.Tenant.fullName}</td>
                <td className="py-3 px-6 text-sm text-gray-800">
                  {new Date(parking.timeIn).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-sm text-gray-800">
                  {new Date(parking.timeOut).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-sm text-gray-800">{parking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParkingList;
