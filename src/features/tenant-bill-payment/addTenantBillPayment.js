import React, { useState, useEffect } from "react";
import axios from "axios";

const AddBillPayment = () => {
  const [tenantId, setTenantId] = useState("");
  const [billPaymentTypeId, setBillPaymentTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [tenants, setTenants] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Fetch tenants
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`);
        setTenants(response.data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    // Fetch bill types
    const fetchBillTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-type`);
        setBillTypes(response.data);
      } catch (error) {
        console.error("Error fetching bill types:", error);
      }
    };

    fetchTenants();
    fetchBillTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenantId || !billPaymentTypeId) {
      setError("Please select a tenant and a bill payment type.");
      return;
    }

    const payload = {
      tenantId: parseInt(tenantId),
      billPaymentTypeId: parseInt(billPaymentTypeId),
      amount: parseFloat(amount),
      startDate: startDate,
      endDate: endDate,
      status: status,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}tenant-payments`, payload);
      setSuccessMessage("Payment added successfully!");
      setError(null);
      console.log(response.data);  // Log the response for debugging
    } catch (error) {
      setError("Error adding payment. Please try again.");
      setSuccessMessage(null);
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Add Bill Payment</h2>

      {/* Success or Error Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-2 mb-4 rounded">{successMessage}</div>
      )}
      {error && (
        <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tenant ID */}
        <div>
          <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">Tenant</label>
          <select
            id="tenantId"
            className="w-full p-2 border border-gray-300 rounded hover:cursor-pointer"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
          >
            <option value="">Select Tenant</option>
            {tenants.length > 0 ? (
              tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))
            ) : (
              <option disabled>No tenants available</option>
            )}
          </select>
        </div>

        {/* Bill Payment Type ID */}
        <div>
          <label htmlFor="billPaymentTypeId" className="block text-sm font-medium text-gray-700">Bill Payment Type</label>
          <select
            id="billPaymentTypeId"
            className="w-full p-2 border border-gray-300 rounded hover:cursor-pointer "
            value={billPaymentTypeId}
            onChange={(e) => setBillPaymentTypeId(e.target.value)}
            required
          >
            <option value="">Select Bill Payment Type</option>
            {billTypes.length > 0 ? (
              billTypes.map((billType) => (
                <option key={billType.id} value={billType.id}>{billType.typeName}</option>
              ))
            ) : (
              <option disabled>No bill payment types available</option>
            )}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            className="w-full p-2 border border-gray-300 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            className="w-full p-2 border border-gray-300 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            className="w-full p-2 border border-gray-300 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            className="w-full p-2 border border-gray-300 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBillPayment;