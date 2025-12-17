import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import TitleCard from "../../components/Cards/TitleCard";
import { useSearchParams } from "react-router-dom";
import SmartDateInput from "../../components/Common/smartDatePicker";

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

  useEffect(() => {
    const tenantIdFromUrl = searchParams.get("tenantId");
    if (tenantIdFromUrl) {
      setTenantId(tenantIdFromUrl);
    }

    const fetchTenants = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}tenant`
        );
        setTenants(response.data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    const fetchBillTypes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}bill-type`
        );
        setBillTypes(response.data);
      } catch (error) {
        console.error("Error fetching bill types:", error);
      }
    };

    fetchTenants();
    fetchBillTypes();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !tenantId ||
      !billPaymentTypeId ||
      !amountPaid ||
      !startDate ||
      !endDate ||
      !paymentMethod
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
      billPaymentTypeId: parseInt(billPaymentTypeId),
      // amount: parseFloat(amount),
      amountPaid: parseFloat(amountPaid),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      status: status,
      paymentMethod: paymentMethod,
  
    };

    console.log("Payload being sent:", payload);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}tenant-payments`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API response:", response.data);

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
      setPaymentMethod("");
      setPaymentDate("");
      setStatus("due");
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error
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
              id="tenantId"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              required
              disabled={!!searchParams.get("tenantId")} // disables if coming from URL
            >
              <option value="" disabled>
                Select Tenant
              </option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.fullName}
                </option>
              ))}
            </select>
          </div>

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
              {billTypes.map((billType) => (
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
              onWheel={(e)=> e.target.blur()}
              required
              min="0"
              step="0.01"
            />
          </div>

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
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Payment Method
              </option>
              <option value="Mobile Banking">Credit Card</option>
              <option value="telebirr">Telebirr</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
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
