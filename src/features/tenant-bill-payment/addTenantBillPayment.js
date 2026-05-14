import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import TitleCard from "../../components/Cards/TitleCard";
import { useSearchParams } from "react-router-dom";
import SmartDateInput from "../../components/Common/smartDatePicker";
import { CalendarContext } from "../../context/calendarContext";
import api from "../../utils/api";

const AddBillPayment = () => {
  const [tenantId, setTenantId] = useState("");
  const [searchParams] = useSearchParams();

  const [billPaymentTypeId, setBillPaymentTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("paid");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [tenants, setTenants] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");

  const [lastPayment, setLastPayment] = useState(null);
  const [loadingLastPayment, setLoadingLastPayment] = useState(false);

  const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState("");
    const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentTypeId, setPaymentTypeId] = useState("");

  const { isGregorian, convertToGregorian, formatDateForDisplay } =
    useContext(CalendarContext);

  useEffect(() => {
    const tenantIdFromUrl = searchParams.get("tenantId");
    if (tenantIdFromUrl) {
      setTenantId(tenantIdFromUrl);
    }

    const fetchTenants = async () => {
      try {
        const response = await api.get(`tenant/floor-units`);

        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    const fetchBillTypes = async () => {
      try {
        const response = await api.get(`bill-type`);
        setBillTypes(response.data);
      } catch (error) {
        console.error("Error fetching bill types:", error);
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

    fetchTenants();
    fetchBillTypes();
    fetchPaymentTypes();
  }, [searchParams]);

  useEffect(() => {
    const fetchLastPayment = async () => {
      if (!tenantId || !billPaymentTypeId) {
        setLastPayment(null);
        return;
      }

      setLoadingLastPayment(true);

      try {
        const response = await api.get(`tenant-payments/last`, {
          params: {
            tenantId,
            billPaymentTypeId,
          },
        });

        if (response.data) {
          const { startDate, endDate } = response.data;

          setLastPayment({
            startDate,
            endDate,
          });

          setStartDate(addOneDay(endDate));
        } else {
          setLastPayment(null);
        }
      } catch (error) {
        console.error("No previous payment found");
        setLastPayment(null);
      } finally {
        setLoadingLastPayment(false);
      }
    };

    fetchLastPayment();
  }, [tenantId, billPaymentTypeId]);

  useEffect(() => {
    const tenantIdFromUrl = Number(searchParams.get("tenantId"));
    if (!tenantIdFromUrl || profiles.length === 0) return;

    for (let i = 0; i < profiles.length; i++) {
      const tenant = profiles[i].tenant.find(
        (t) => t.tenantId === tenantIdFromUrl,
      );

      if (tenant) {
        setSelectedProfileIndex(i);
        setTenantId(tenant.tenantId);
        break;
      }
    }
  }, [profiles, searchParams]);

  const addOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !tenantId ||
      !billPaymentTypeId ||
      !amountPaid ||
      !startDate ||
      !endDate ||
      !paymentTypeId 
    ) {
      setError("Please fill in all required fields.");
      setIsSuccess(false);
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be later than end date.");
      setIsSuccess(false);
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    const formatDate = (date) => new Date(date).toISOString();

    const payload = {
      tenantId: parseInt(tenantId),
      billTypeId: parseInt(billPaymentTypeId),
      // amount: parseFloat(amount),
      amountPaid: parseFloat(amountPaid),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      status: status,
      paymentTypeId: parseInt(paymentTypeId),
    };

    console.log("Payload being sent:", payload);

    try {
      const response = await api.post(`tenant-payments`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("API response:", response.data);

      setModalOpen(true);
      setMessageType("success");
      setModalMessage("Payment added successfully");

      // Reset form
      setTenantId("");
      setBillPaymentTypeId("");
      setAmount("");
      setAmountPaid("");
      setStartDate("");
      setEndDate("");
      setPaymentTypeId("");
      setPaymentDate("");
      setStatus("due");
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error,
      );

      //add backend error message if available
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while adding the payment. Please try again.";
      setModalMessage(errorMessage);
      setModalOpen(true);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-select unit if tenant has only one unit
    if (
      selectedProfileIndex !== "" &&
      profiles[selectedProfileIndex].tenant.length === 1
    ) {
      setTenantId(profiles[selectedProfileIndex].tenant[0].tenantId);
    }
  }, [selectedProfileIndex, profiles]);

  return (
    <div>
      <TitleCard title={"Add Tenant Payments "} topMargin={"mt-1"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="tenantId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tenant
            </label>
            <select
              className="bg-base-100 w-full p-3 border rounded"
              value={selectedProfileIndex}
              onChange={(e) => {
                setSelectedProfileIndex(e.target.value);
                setTenantId("");
              }}
            >
              <option value="">Select Tenant</option>
              {profiles.map((profile, index) => (
                <option key={profile.phoneNumber} value={index}>
                  {profile.fullName} ({profile.phoneNumber})
                </option>
              ))}
            </select>
          </div>
          {selectedProfileIndex !== "" && (
            <select
              className="bg-base-100 w-full p-3 border rounded mt-2"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            >
              {profiles[selectedProfileIndex].tenant.length > 1 && (
                <option value="">Select Unit</option>
              )}
              {profiles[selectedProfileIndex].tenant.map((t) => (
                <option key={t.tenantId} value={t.tenantId}>
                  Unit {t.unit.unitNumber} – Floor {t.floor.floorNumber}
                </option>
              ))}
            </select>
          )}
          <div>
            <label
              htmlFor="billPaymentTypeId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bill Payment Type
            </label>
            <select
              id="billPaymentTypeId"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              value={billPaymentTypeId}
              onChange={(e) => setBillPaymentTypeId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {billTypes
                .filter((billType) =>
                  !billType.typeName.toLowerCase().includes("rent")
                )
                .map((billType) => (
                  <option
                    key={billType.id}
                    value={billType.id}
                    className="text-black dark:text-gray-300"
                  >
                    {billType.typeName}
                  </option>
                ))}
            </select>
          </div>
          

          {/* <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div> */}

          {lastPayment && (
            <div className="p-3 rounded bg-gray-100 dark:bg-gray-800 text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Last Payment Period
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDateForDisplay(lastPayment.startDate)} →{" "}
                {formatDateForDisplay(lastPayment.endDate)}
              </p>
            </div>
          )}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Start Date
            </label>
            <SmartDateInput
              id="startDate"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              End Date
            </label>
            <SmartDateInput
              id="endDate"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="amountPaid"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount Paid
            </label>
            <input
              type="number"
              id="amountPaid"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              onWheel={(e) => e.target.blur()}
              required
              min="0"
              step="0.01"
            />
          </div>

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
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="paid">Paid</option>
              <option value="due">Due</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Add Payment"}
            </button>
          </div>
        </form>
      </TitleCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={modalMessage}
      />
    </div>
  );
};

export default AddBillPayment;
