import React, { useState, useEffect } from "react";
import axios from "axios";

const AddParking = () => {
  const [carPlate, setCarPlate] = useState("");
  const [carName, setCarName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [isTenant, setIsTenant] = useState(true);
  const [parkingSpaceId, setParkingSpaceId] = useState("1"); // Assuming parking space id is 1
  const [tenants, setTenants] = useState([]);
  const [status, setStatus] = useState("onparking"); // Assuming default parking status is "onparking"

  // Fetch tenants for the dropdown list
  useEffect(() => {
    axios
      .get("https://apartment.houseethiopia.com/api/tenant")
      .then((response) => {
        setTenants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tenants:", error);
      });
  }, []);

  // Handle submit of the parking form
  const handleSubmit = (e) => {
    e.preventDefault();

    const parkingData = {
      carPlate,
      carName,
      driverName,
      driverPhone,
      tenantId,
      timeIn,
      timeOut,
      isTenant,
      status,
      parkingSpaceId,
    };

    axios
      .post("https://apartment.houseethiopia.com/api/parking", parkingData)
      .then((response) => {
        alert("Parking data added successfully!");
        console.log(response.data);
        // Optionally reset form fields after successful submit
        setCarPlate("");
        setCarName("");
        setDriverName("");
        setDriverPhone("");
        setTenantId("");
        setTimeIn("");
        setTimeOut("");
      })
      .catch((error) => {
        console.error("Error adding parking data:", error);
        alert("Error adding parking data.");
      });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add Parking Data</h1>

      <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-lg shadow-md">
        {/* Car Plate */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Car Plate</label>
          <input
            type="text"
            value={carPlate}
            onChange={(e) => setCarPlate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Car Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Car Name</label>
          <input
            type="text"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Driver Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Driver Name</label>
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Driver Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Driver Phone</label>
          <input
            type="text"
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Tenant Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tenant</label>
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Tenant</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Time In */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Time In</label>
          <input
            type="datetime-local"
            value={timeIn}
            onChange={(e) => setTimeIn(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Time Out */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Time Out</label>
          <input
            type="datetime-local"
            value={timeOut}
            onChange={(e) => setTimeOut(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Parking Space */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Parking Space ID</label>
          <input
            type="text"
            value={parkingSpaceId}
            onChange={(e) => setParkingSpaceId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Parking
        </button>
      </form>
    </div>
  );
};

export default AddParking;
