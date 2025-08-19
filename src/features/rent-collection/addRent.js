import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import Modal from "../../components/Modal";
import { useSearchParams } from "react-router-dom";

const AddCollectedRent = () => {
  const [searchParams] = useSearchParams();
  const tenantIdFromUrl = searchParams.get("tenantId");

  const [tenantId, setTenantId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [nextDueDate, setNextDueDate] = useState("");
  const [status, setStatus] = useState("paid");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [tenants, setTenants] = useState([]);
  const [rentCollections, setRentCollections] = useState([]);
  const [amount, setAmount] = useState("");
  const [paidDays, setPaidDays] = useState("");
  const [leaseEndDate, setLeaseEndDate] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState("");


  const calculatePaidDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    if (paymentDate && nextDueDate) {
      const days = calculatePaidDays(paymentDate, nextDueDate);
      setPaidDays(days);
    } else {
      setPaidDays("");
    }
  }, [paymentDate, nextDueDate]);

  useEffect(() => {
  if (amount && paidDays) {
    const numericAmount = parseFloat(amount);
    const numericDays = parseInt(paidDays);
    if (!isNaN(numericAmount) && !isNaN(numericDays)) {
      const result = ((numericAmount / 30) * numericDays).toFixed(2);
      setCalculatedAmount(result);
    } else {
      setCalculatedAmount("");
    }
  } else {
    setCalculatedAmount("");
  }
}, [amount, paidDays]);


  // Fetch tenant list
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}tenant`
        );
        setTenants(response.data);
      } catch (err) {
        setError(
          "Failed to fetch tenant data. Please check your connection or try again later."
        );
      }
    };
    fetchTenants();
  }, []);

  // Fetch rent collection data to extract tenant amounts
  useEffect(() => {
    const fetchRentCollections = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}rent-collection`
        );
        setRentCollections(response.data);
      } catch (err) {
        console.error("Failed to fetch rent collection data:", err);
        setError("Failed to load rent information. Try refreshing the page.");
      }
    };

    fetchRentCollections();
  }, []);

  // Autofill based on tenantId from URL (only once after tenants are loaded)
  useEffect(() => {
    if (tenants.length && tenantIdFromUrl) {
      setTenantId(tenantIdFromUrl);

      const matchedTenant = tenants.find(
        (t) => t.id.toString() === tenantIdFromUrl
      );

      setAmount(matchedTenant?.amount || "");
      setLeaseEndDate(matchedTenant?.leaseEndDate || "");

      if (matchedTenant) {
        const resolvedAmount =
          matchedTenant?.Tenant?.amount ?? matchedTenant.amount ?? "";
        setAmount(resolvedAmount);
        setLeaseEndDate(matchedTenant.leaseEndDate || "");

       if (matchedTenant.leaseEndDate) {
        const nextDay = new Date(matchedTenant.leaseEndDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setPaymentDate(nextDay.toISOString().split("T")[0]);
      }
      }
    }
  }, [tenants, rentCollections, tenantIdFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (
      !tenantId ||
      !paymentDate ||
      !paymentMethod ||
      !nextDueDate ||
      !status
    ) {
      setError("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    const payload = {
      tenantId: parseInt(tenantId),
      paymentDate,
      paymentMethod,
      nextDueDate,
      status,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}rent-collection`,
        payload
      );

      setLoading(false);
      setModalOpen(true);
      setMessageType("success");
      setMessage("The collected rent has been added successfully");

      // Clear form
      setTenantId("");
      setPaymentDate("");
      setPaymentMethod("Cash");
      setNextDueDate("");
      setStatus("paid");
      setAmount("");
    } catch (err) {
      console.error("Error while submitting:", err);

      let errorMsg = "Something went wrong. Please try again.";

      if (err.response) {
        if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data?.error) {
          errorMsg = err.response.data.error;
        } else {
          errorMsg = `Server returned status code ${err.response.status}`;
        }
      } else if (err.request) {
        errorMsg = "No response from the server. Please check your connection.";
      } else {
        errorMsg = `Unexpected error: ${err.message}`;
      }

      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title={"Add Collected Rent"} topMargin={"mt-1"}>
        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Rent Collection Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tenant Dropdown */}
          <div>
            <label
              htmlFor="tenantId"
              className="block text-sm font-medium text-white-700"
            >
              Tenant
            </label>
            <select
              id="tenantId"
              value={tenantId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setTenantId(selectedId);

                  const matched = tenants.find(
                    (tenant) => tenant.id.toString() === selectedId
                  );

                  if (matched) {
                    setAmount(matched?.amount || "");
                    setLeaseEndDate(matched?.leaseEndDate || "");

                    if (matched.leaseEndDate) {
                      const nextDay = new Date(matched.leaseEndDate);
                      nextDay.setDate(nextDay.getDate() + 1);
                      setPaymentDate(nextDay.toISOString().split("T")[0]);
                    }
                  }
                }}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={Boolean(tenantIdFromUrl)} // Disable only if tenantId came from parent
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
          {tenantId && (
            <div className="mb-4 p-3 rounded-lg text-gray-800 shadow flex space-x-6">
              {leaseEndDate && (
                <div>
                  Lease End Date:{" "}
                  <span className="font-medium">
                    {new Date(leaseEndDate).toISOString().split("T")[0]}
                  </span>
                </div>
              )}
              {amount && (
                <div>
                  Monthly Rent:{" "}
                  <span className="font-semibold">ETB {amount}</span>
                </div>
              )}
            </div>
          )}
          {/* Paid Amount Display */}
           <div className="flex space-x-4 items-end">
          <div>
            <label className="block text-sm font-medium text-white-700">
              Rent Amount
            </label>
            <input
              type="text"
              value={calculatedAmount}
              readOnly
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-white-700">
              Paid Days
            </label>
            <input
              type="text"
              value={paidDays}
              readOnly
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
           </div>
          {/* Read-only Amount Field */}
          <div>
            <input
              type="hidden"
              id="amount"
              value={amount}
              readOnly
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
          {/* Payment Date Field */}
          <div>
            <label
              htmlFor="paymentDate"
              className="block text-sm font-medium text-white-700"
            >
              Rent from Date:
            </label>
            <input
              type="date"
              id="paymentDate"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

            {/* Next Due Date Field */}
          <div>
            <label
              htmlFor="nextDueDate"
              className="block text-sm font-medium text-white-700"
            >
              Next Due Date:
            </label>
            <input
              type="date"
              id="nextDueDate"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Payment Method Dropdown */}
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-white-700"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-white-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Rent Payment"}
          </button>
        </form>
      </TitleCard>

      {/* Success and Error Modals */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default AddCollectedRent;
