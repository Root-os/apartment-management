import React, { useState } from "react";
import axios from "axios";

const AddBillPayment = () => {
  const [tenantId, setTenantId] = useState("");
  const [billPaymentTypeId, setBillPaymentTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      tenantId: parseInt(tenantId),
      billPaymentTypeId: parseInt(billPaymentTypeId),
      amount: parseFloat(amount),
      startDate: startDate,
      endDate: endDate,
      status: status,
    };

    try {
      const response = await axios.post("https://apartment.houseethiopia.com/api/tenant-payments", payload);
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
          <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">Tenant ID</label>
          <input
            type="number"
            id="tenantId"
            className="w-full p-2 border border-gray-300 rounded"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
          />
        </div>

        {/* Bill Payment Type ID */}
        <div>
          <label htmlFor="billPaymentTypeId" className="block text-sm font-medium text-gray-700">Bill Payment Type ID</label>
          <input
            type="number"
            id="billPaymentTypeId"
            className="w-full p-2 border border-gray-300 rounded"
            value={billPaymentTypeId}
            onChange={(e) => setBillPaymentTypeId(e.target.value)}
            required
          />
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
