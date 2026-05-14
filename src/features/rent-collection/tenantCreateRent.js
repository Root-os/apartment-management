import React, { useState, useEffect, useContext } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import Modal from "../../components/Modal";
import SmartDateInput from "../../components/Common/smartDatePicker";
import { CalendarContext } from "../../context/calendarContext";
import api from "../../utils/api";

const AddTenantRent = () => {
  const { formatDateForDisplay } = useContext(CalendarContext);

  const [tenantId, setTenantId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [monthsCount, setMonthsCount] = useState("");
  const [daysCount, setDaysCount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [status, setStatus] = useState("Pending");
  const [amount, setAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paidDays, setPaidDays] = useState("");
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [leaseEndDate, setLeaseEndDate] = useState("");
  const [punishmentAmount, setPunishmentAmount] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [units, setUnits] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentTypeId, setPaymentTypeId] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  // ✅ AUTO FETCH TENANT DATA
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("dashboard/for-tenant", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUnits = res.data.unitsOccupied || [];
        // ✅ FILTER ONLY ACTIVE
        const activeUnits = allUnits.filter((u) => u.status === "active");

        if (!activeUnits.length) {
          setError("No active units found.");
          return;
        }

        // ✅ Set filtered units first
        setUnits(activeUnits);

        // ✅ If only one active unit → auto select
        if (activeUnits.length === 1) {
          handleTenantSelection(activeUnits[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load tenant data.");
      }
    };

    const fetchPaymentTypes = async () => {
      try {
        const res = await api.get(`payment-settings`);
        setPaymentTypes(res.data.data);
      } catch {
        setError("Failed to fetch payment types.");
      }
    };

    fetchTenantData();
    fetchPaymentTypes();
  }, []);

  const fetchPunishmentByTenant = async (tenantId) => {
    try {
      const res = await api.get(`punishments/${tenantId}`);

      if (Array.isArray(res.data) && res.data.length > 0) {
        const unpaid = res.data.find((p) => p.status === "unpaid");

        if (unpaid) {
          setPunishmentAmount(unpaid.amount ?? "");
          setIsPaid(false);
        } else {
          setPunishmentAmount("");
          setIsPaid(true);
        }
      } else {
        setPunishmentAmount("");
        setIsPaid(false);
      }
    } catch (err) {
      console.error(err);
      setPunishmentAmount("");
      setIsPaid(false);
    }
  };

  const handleTenantSelection = async (unitOrId) => {
    try {
      let selected;

      // ✅ Handle both cases (dropdown = id, autofill = object)
      if (typeof unitOrId === "object") {
        selected = unitOrId;
      } else {
        selected = units.find((u) => u.tenantId == unitOrId);
      }

      if (!selected) {
        setError("Unit not found");
        return;
      }

      setSelectedTenantId(selected.tenantId);
      setTenantId(selected.tenantId);

      // ✅ Now it works because selected is guaranteed
      setAmount(selected.amount || "");
      setLeaseStartDate(selected.leaseStartDate || "");
      setLeaseEndDate(selected.leaseEndDate || "");

      const baseDate = selected.leaseEndDate || selected.leaseStartDate;

      if (!baseDate) {
        setError("Missing lease dates");
        return;
      }

      const start = new Date(baseDate);

      if (isNaN(start)) {
        setError("Invalid date from server");
        return;
      }

      if (selected.leaseEndDate) {
        start.setDate(start.getDate() + 1);
      }

      setPaymentDate(start.toISOString().split("T")[0]);

      // punishment API
      await fetchPunishmentByTenant(selected.tenantId);
    } catch (err) {
      console.error(err);
      setError("Failed to load tenant details.");
    }
  };

  // ✅ Calculate nextDueDate
  useEffect(() => {
    if (paymentDate && (monthsCount || daysCount)) {
      let result = new Date(paymentDate);

      if (monthsCount) {
        result.setDate(result.getDate() + parseInt(monthsCount) * 30);
      }

      if (daysCount) {
        result.setDate(result.getDate() + parseInt(daysCount));
      }

      result.setDate(result.getDate() - 1);
      setNextDueDate(result.toISOString().split("T")[0]);
    }
  }, [paymentDate, monthsCount, daysCount]);

  // ✅ Calculate paidDays
  useEffect(() => {
    if (paymentDate && nextDueDate) {
      const start = new Date(paymentDate);
      const end = new Date(nextDueDate);

      const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

      setPaidDays(diff);
    }
  }, [paymentDate, nextDueDate]);

  // ✅ Calculate amountPaid
  useEffect(() => {
    if (amount && paidDays) {
      setAmountPaid(((amount / 30) * paidDays).toFixed(2));
    }
  }, [amount, paidDays]);

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!tenantId || !paymentDate || !nextDueDate) {
      setError("Missing required fields");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("tenantId", parseInt(tenantId));
    formData.append("paymentDate", paymentDate);
    formData.append("nextDueDate", nextDueDate);
    formData.append("paymentTypeId", parseInt(paymentTypeId));
    formData.append("status", status);
    formData.append("punishment", punishmentAmount || "0");
    formData.append("isPaid", isPaid);
    formData.append("description", description);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      await api.post("rent-collection", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Rent collected successfully!");
      setModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="My Rent Payment" topMargin="mt-1">
        {/* {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
            {error}
          </div>
        )} */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Select Unit
          </label>

          {units.length === 1 ? (
            <input
              type="text"
              value={`Unit ${units[0].unitNumber} (Floor ${units[0].floorNumber})`}
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100"
            />
          ) : (
            <select
              value={selectedTenantId}
              onChange={(e) => handleTenantSelection(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">-- Select Unit --</option>
              {units.map((u) => (
                <option key={u.tenantId} value={u.tenantId}>
                  Unit {u.unitNumber} (Floor {u.floorNumber})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ✅ Tenant Info */}
        <div className="mb-4 p-3 rounded-lg shadow flex space-x-6">
          {leaseStartDate && (
            <div>Lease Start: {formatDateForDisplay(leaseStartDate)}</div>
          )}
          {leaseEndDate && (
            <div>Lease End: {formatDateForDisplay(leaseEndDate)}</div>
          )}
          {amount && <div>Monthly Rent: ETB {amount}</div>}
          {punishmentAmount && (
            <div className="text-red-500">
              Punishment: ETB {punishmentAmount}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Duration */}
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

          {/* Dates */}
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

          {/* Calculations */}
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

              {/* <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isCleared}
                  onChange={(e) => setIsCleared(e.target.checked)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsCleared(checked);
                    if (checked) setIsPaid(false);
                  }}
                  className="w-5 h-5 text-green-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium">
                  Punishment Cleared
                </label>
              </div> */}
            </div>
          )}

          {/* Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white-700">
                Payment Method
              </label>

              <select
                value={paymentTypeId}
                onChange={(e) => setPaymentTypeId(e.target.value)}
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg"
                required
              >
                <option value="">Select payment method</option>

                {paymentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.paymentMethod}
                  </option>
                ))}
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
                disabled
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700">
              Description (Optional)
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg"
              rows={3}
              placeholder="Description or notes about this rent payment..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white-700">
              Receipt (PDF or Image)
            </label>

            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Rent"}
          </button>
        </form>
      </TitleCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType="success"
        message={message}
      />
    </>
  );
};

export default AddTenantRent;
