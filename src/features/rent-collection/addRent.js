import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import Modal from "../../components/Modal";
import { useSearchParams } from "react-router-dom";
import SmartDateInput from "../../components/Common/smartDatePicker";
import { CalendarContext } from "../../context/calendarContext";
import api from '../../utils/api';

const AddCollectedRent = () => {
  const [searchParams] = useSearchParams();
  const tenantIdFromUrl = searchParams.get("tenantId");

  const {
    isGregorian,
    convertToGregorian,
    formatDateForDisplay
  } = useContext(CalendarContext);

  const [tenantId, setTenantId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [monthsCount, setMonthsCount] = useState("");
  const [daysCount, setDaysCount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [status, setStatus] = useState("Paid");
  const [amount, setAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paidDays, setPaidDays] = useState("");
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [leaseEndDate, setLeaseEndDate] = useState("");
  const [punishmentAmount, setPunishmentAmount] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");

  // Fetch tenants
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await api.get(`tenant`);
        setTenants(res.data);
      } catch {
        setError("Failed to fetch tenants.");
      }
    };
    fetchTenants();
  }, []);

  // Fetch punishment info
  const fetchPunishmentByTenant = async (tenantId) => {
    try {
      const res = await api.get(`punishments/${tenantId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const latestUnpaid = res.data.find((p) => p.status !== "paid");
        if (latestUnpaid) {
          setPunishmentAmount(latestUnpaid.amount || "");
          setIsPaid(false);
        } else {
          setPunishmentAmount("");
          setIsPaid(true);
        }
      } else {
        setPunishmentAmount("");
        setIsPaid(false);
      }
    } catch (error) {
      console.error("Error fetching punishment:", error);
      setPunishmentAmount("");
      setIsPaid(false);
    }
  };

 
useEffect(() => {
  if (tenants.length && tenantIdFromUrl) {
    const tenant = tenants.find((t) => t.id.toString() === tenantIdFromUrl);
    if (tenant) {
      setTenantId(tenantIdFromUrl);
      setAmount(tenant.amount || "");
      setLeaseStartDate(tenant.leaseStartDate || "");
      setLeaseEndDate(tenant.leaseEndDate || "");

      // Same logic as in handleTenantSelect
      let start = tenant.leaseEndDate
        ? new Date(tenant.leaseEndDate)
        : new Date(tenant.leaseStartDate);

     
      if (tenant.leaseEndDate) {
        start.setDate(start.getDate() + 1);
      }

      const iso = start.toISOString().split("T")[0];
      setPaymentDate(iso);

      fetchPunishmentByTenant(tenantIdFromUrl);
    }
  }
}, [tenants, tenantIdFromUrl]);

  // Helper function to add months with proper date handling
  const addMonths = (date, months) => {
    const result = new Date(date);
    const dayOfMonth = result.getDate();
    result.setMonth(result.getMonth() + months);
    
  
    if (result.getDate() !== dayOfMonth) {
      result.setDate(0); 
    }
    
    return result;
  };

  // Auto-calculate nextDueDate
useEffect(() => {
  if (paymentDate && (monthsCount || daysCount)) {
    let result = new Date(paymentDate);

    if (monthsCount) {
      result.setDate(result.getDate() + (parseInt(monthsCount) * 30));
    }

    if (daysCount) {
      result.setDate(result.getDate() + parseInt(daysCount));
    }

    result.setDate(result.getDate() - 1);
    setNextDueDate(result.toISOString().split("T")[0]);
  }
}, [paymentDate, monthsCount, daysCount]);


  // Calculate paidDays
useEffect(() => { 
  if (paymentDate && nextDueDate) {
    const start = new Date(paymentDate);
    const end = new Date(nextDueDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - start;
    const calendarDays =
      Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

    setPaidDays(calendarDays);
  } else {
    setPaidDays("");
  }
}, [paymentDate, nextDueDate, monthsCount, daysCount]);


  // Calculate amountPaid
  useEffect(() => {
    if (amount && paidDays) {
      const monthly = parseFloat(amount);
      const days = parseInt(paidDays);
      if (!isNaN(monthly) && !isNaN(days)) {
        setAmountPaid(((monthly / 30) * days).toFixed(2));
      } else {
        setAmountPaid("");
      }
    } else {
      setAmountPaid("");
    }
  }, [amount, paidDays]);

  const handleTenantSelect = async (e) => {
    const id = e.target.value;
    setTenantId(id);
    const tenant = tenants.find((t) => t.id.toString() === id);
    if (tenant) {
      setAmount(tenant.amount || "");
      setLeaseStartDate(tenant.leaseStartDate || "");
      setLeaseEndDate(tenant.leaseEndDate || "");

      const start = tenant.leaseEndDate
        ? new Date(tenant.leaseEndDate)
        : new Date(tenant.leaseStartDate);

      if (tenant.leaseEndDate) {
        start.setDate(start.getDate() + 1);
      }

      setPaymentDate(start.toISOString().split("T")[0]);

      await fetchPunishmentByTenant(id);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // DEBUG: Check what dates are being processed
  // console.log("📅 Before submission:");
  // console.log("Payment Date (UI):", paymentDate);
  // console.log("Next Due Date (UI):", nextDueDate);
  // console.log("Is Gregorian mode:", isGregorian);

  if (!tenantId || !paymentDate || !nextDueDate || !amountPaid) {
    setError("Please fill in all required fields.");
    return;
  }
  setLoading(true);

  // SmartDateInput already gives Gregorian dates, so use them directly
  const payload = {
    tenantId: parseInt(tenantId),
    paymentDate,
    nextDueDate,
    paymentMethod,
    status,
    punishment: punishmentAmount || "0",
    isPaid,
  };

  // console.log("📅 Final payload:", payload);

  try {
    await api.post(`rent-collection`, payload);
    setMessageType("success");
    setMessage("Rent collected successfully!");
    setModalOpen(true);
    setTenantId("");
    setMonthsCount("");
    setDaysCount("");
    setPaymentDate("");
    setNextDueDate("");
    setAmountPaid("");
  } catch (error) {
  // console.log("FULL ERROR OBJECT:", error);
  // console.log("RESPONSE:", error.response);
  // console.log("RESPONSE DATA:", error.response?.data);

  const backendMessage =
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again.";

  setError(backendMessage);
}
 finally {
    setLoading(false);
  }
};

  return (
    <>
      <TitleCard title="Add Collected Rent" topMargin="mt-1">
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tenant Dropdown */}
          <div>
            <label className="block text-sm font-medium text-white-700">
              Tenant
            </label>
            <select
              value={tenantId}
              onChange={handleTenantSelect}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg"
              required
              disabled={Boolean(tenantIdFromUrl)}
            >
              <option value="">Select Tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} — Unit {t.Unit?.unitNumber ?? "N/A"}
                  {/* {tenant.fullName} — Unit {tenant.Unit?.unitNumber ?? "N/A"} */}
                </option>
              ))}
            </select>
          </div>

          {/* Tenant Info */}
          {tenantId && (
            <div className="mb-4 p-3 rounded-lg text-white-800 shadow flex space-x-6">
              {leaseStartDate && (
                <div>
                  Lease Start:{" "}
                  <span className="font-medium">
                    {formatDateForDisplay(leaseStartDate)}

                  </span>
                </div>
              )}
              {leaseEndDate && (
                <div>
                  Lease End:{" "}
                  <span className="font-medium">
                    {formatDateForDisplay(leaseEndDate)}
                  </span>
                </div>
              )}
              
              {amount && (
                <div>
                  Monthly Rent: <span className="font-semibold">ETB {amount}</span>
                </div>
              )}
              {punishmentAmount && (
                <div>
                  Punishment:{" "}
                  <span className="font-semibold text-red-500">
                    ETB {punishmentAmount}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Duration Inputs */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white-700">
                Months
              </label>
              <input
                type="number"
                value={monthsCount}
                onChange={(e) => setMonthsCount(e.target.value)}
                onWheel={(e) => e.target.blur()} 
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg"
                min="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white-700">
                Days
              </label>
              <input
                type="number"
                value={daysCount}
                onChange={(e) => setDaysCount(e.target.value)}
                onWheel={(e) => e.target.blur()} 
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg"
                min="0"
              />
            </div>
          </div>

          {/* Rent Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white-700">
                Rent From
              </label>
              <SmartDateInput
                value={paymentDate}
                onChange={setPaymentDate}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white-700">
                Rent To
              </label>
              <SmartDateInput
                value={nextDueDate}
                onChange={setNextDueDate}
                required
              />
            </div>
          </div>

          {/* Paid Days & Amount */}
          <div className="flex space-x-4 items-end">
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
            <div>
              <label className="block text-sm font-medium text-white-700">
                Amount Paid
              </label>
              <input
                type="text"
                value={amountPaid}
                readOnly
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Punishment */}
          {punishmentAmount && (
            <div className="flex space-x-4 items-end">
              <div>
                <label className="block text-sm font-medium text-white-700">
                  Punishment Amount
                </label>
                <input
                  type="number"
                  value={punishmentAmount}
                  readOnly
                  className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-white-700">
                  Punishment Paid
                </label>
              </div>
            </div>
          )}

          {/* Payment Method & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white-700">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg"
                required
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Rent Payment"}
          </button>
        </form>
      </TitleCard>

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
