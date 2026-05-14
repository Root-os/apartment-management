import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableComponent from "../../components/table";
import LoadingComponent from "../../components/loading";
import Modal from "../../components/Modal";
import api from "../../utils/api";

const METHOD_ALIASES = {
  // CBE
  cbe: "cbe",
  "commercial bank of ethiopia": "cbe",
  "nigid bank": "cbe",
  "commertial bank": "cbe",

  // CBEBirr
  cbebirr: "cbebirr",
  "cbe birr": "cbebirr",
  "cbe mobile": "cbebirr",

  // Abyssinia
  abyssinia: "abyssinia",
  "abssinia bank": "abyssinia",

  // Dashen
  dashen: "dashen",
  "dashen bank": "dashen",

  // TeleBirr
  telebirr: "telebirr",
  "tele birr": "telebirr",
};

const normalizeMethod = (method) =>
  METHOD_ALIASES[method?.toLowerCase().trim()];

const TenantPaymentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [uploadingForId, setUploadingForId] = useState(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [verifyPaymentMethod, setVerifyPaymentMethod] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [apiPaymentSettings, setApiPaymentSettings] = useState([]); // full objects
  const [receiverInfo, setReceiverInfo] = useState({ name: "", account: "" });
  const [uploadLoading, setUploadLoading] = useState(false);
const [uploadSuccessId, setUploadSuccessId] = useState(null);
const [uploadErrorId, setUploadErrorId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchPaymentTypes();
    fetchPaymentSettings();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`payment-requests/tenant/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data.data);
    } catch (error) {
      setMessage("Failed to load payment requests");
      setMessageType("error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const response = await api.get(`payment-types`);
      setPaymentTypes(response.data);
    } catch (error) {
      console.error("Error fetching payment types", error);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const response = await api.get("payment-settings");

      // keep ALL payment methods
      const methods = response.data.data;

      setApiPaymentSettings(methods);

      // default first method
      if (methods.length > 0) {
        const firstMethod = methods[0];

        setVerifyPaymentMethod("");

        setReceiverInfo({
          name: firstMethod.receiverName,
          account: firstMethod.receiverAccountNumber,
        });
      }
    } catch (error) {
      console.error("Failed to fetch payment settings", error);
    }
  };

const handleReceiptUpload = async (event) => {
  const file = event.target.files[0];

  if (!file || !uploadingForId) return;

  setUploadLoading(true);

  // reset states
  setUploadSuccessId(null);
  setUploadErrorId(null);

  const currentId = uploadingForId;

  const formData = new FormData();
  formData.append("receipt", file);

  try {
    const token = localStorage.getItem("token");

    await api.post(
      `payment-requests/upload-receipt/${currentId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // success state
    setUploadSuccessId(currentId);

    setModalOpen(true);
    setMessageType("success");
    setMessage("Receipt uploaded successfully!");

    fetchRequests();

    // remove success after 3 sec
    setTimeout(() => {
      setUploadSuccessId(null);
    }, 3000);

  } catch (error) {
    // error state
    setUploadErrorId(currentId);

    setModalOpen(true);
    setMessageType("error");
    setMessage("Upload failed. Please try again.");

    // remove error after 3 sec
    setTimeout(() => {
      setUploadErrorId(null);
    }, 3000);

  } finally {
    setUploadLoading(false);
    setUploadingForId(null);
  }
};

  const handleVerifyPayment = async () => {
    if (!selectedRequest) return;
    if (!verifyPaymentMethod) {
      setMessageType("warning");
      setMessage("Please select a payment method first.");
      setModalOpen(true);
      return;
    }

    setVerifyLoading(true);

    try {
      // find selected payment method object
      const selectedMethod = apiPaymentSettings.find(
        (m) => m.id.toString() === verifyPaymentMethod,
      );

      // normalize payment method
      const normalized = normalizeMethod(selectedMethod?.paymentMethod);

      // ❌ unsupported method
      if (!normalized) {
        setMessageType("warning");

        setMessage(
          "This payment method is not supported for automatic verification. Please upload your receipt instead.",
        );

        setModalOpen(true);
        setVerifyLoading(false);

        return;
      }

      // ✅ supported method
      const response = await api.post(
        `payment-requests/${selectedRequest.id}/verify`,
        {
          paymentMethodId: Number(verifyPaymentMethod),
          transactionNumber,
        },
        {
          params: {
            amount: selectedRequest.amount,
          },
        },
      );

      setMessageType(response.data.success ? "success" : "error");

      setMessage(response.data.message || "Verification complete");

      setVerifyModalOpen(false);

      fetchRequests();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";

      setMessage(backendMessage);

      setMessageType("error");

      setVerifyModalOpen(false);
    } finally {
      setModalOpen(true);
      setVerifyLoading(false);
    }
  };

  const columns = [
    {
      key: "floorNumber",
      label: "Floor",
      render: (row) => row.Tenant.Floor?.floorNumber || "N/A",
    },
    {
      key: "unitNumber",
      label: "Unit",
      render: (row) => row.Tenant.Unit?.unitNumber || "N/A",
    },
    { key: "message", label: "Message" },
    { key: "level", label: "Level" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => `${Math.round(row.amount)}`,
    },
    {
      key: "billTypeId",
      label: "Payment Type",
      render: (row) => row.BillType?.typeName || "Unknown",
    },
    {
      key: "dueDate",
      label: "Due Date",
      isDate: true,
    },
    { key: "repeatedFor", label: "Repeated For" },
    { key: "status", label: "Status" },
    {
      key: "receipt",
      label: "Receipt",
      render: (row) =>
        row.receipt ? (
          <a
            href={row.receipt}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1d4ed8", textDecoration: "none" }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            View
          </a>
        ) : (
          <span>No receipt</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {/* Upload Receipt */}
          <input
            type="file"
            accept="image/*,application/pdf"
            style={{ display: "none" }}
            id={`upload-input-${row.id}`}
            onChange={handleReceiptUpload}
          />
     <button
  onClick={() => {
    setUploadingForId(row.id);
    document.getElementById(`upload-input-${row.id}`).click();
  }}
  className={`px-2 py-1 rounded-md text-white text-sm ${
    row.receipt
      ? "bg-amber-500 hover:bg-amber-600"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {row.receipt ? "Update Receipt" : "Upload Receipt"}
</button>

          {/* Conditional Verify or View Receipt */}
          {row.status === "pending" ? (
            <button
              onClick={() => {
                setSelectedRequest(row);
                setVerifyPaymentMethod("");
                setTransactionNumber("");
                setVerifyModalOpen(true);
              }}
              className={`px-2 py-1 rounded text-white bg-blue-600 
              `}
              disabled={verifyLoading}
            >
              Verify
            </button>
          ) : (
            <button
              onClick={() => navigate(`/app/view-reciept/${row.id}`)}
              className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            >
              View Receipt
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="My Payment Requests"
          data={requests}
          columns={columns}
          showSearch={true}
        />
      )}

      {verifyModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Verify Payment</h2>
            <div className="space-y-4">
              {/* Amount - display only, above Payment Method */}
              <div>
                <label className="block mb-1 font-medium">Amount</label>
                <span>{Math.round(selectedRequest.amount)}</span>
              </div>

              {receiverInfo.name && (
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p>
                    <strong>Receiver Name:</strong> {receiverInfo.name}
                  </p>
                  <p>
                    <strong>Account Number:</strong> {receiverInfo.account}
                  </p>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block mb-1 font-medium">Payment Method</label>

                <select
                  value={verifyPaymentMethod}
                  onChange={(e) => {
                    const id = e.target.value;

                    setVerifyPaymentMethod(id);

                    const selected = apiPaymentSettings.find(
                      (m) => m.id.toString() === id,
                    );

                    if (selected) {
                      setReceiverInfo({
                        name: selected.receiverName,
                        account: selected.receiverAccountNumber,
                      });
                    } else {
                      setReceiverInfo({
                        name: "",
                        account: "",
                      });
                    }
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* 👇 NEW DEFAULT OPTION */}
                  <option value="">-- Select Payment Method --</option>

                  {apiPaymentSettings.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.paymentMethod}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transaction Number */}
              <div>
                <label className="block mb-1 font-medium">
                  Transaction Number
                </label>
                <input
                  type="text"
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setVerifyModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPayment}
                  disabled={!verifyPaymentMethod || verifyLoading}
                  className={`px-2 py-1 rounded text-white ${
                    !verifyPaymentMethod || verifyLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {verifyLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default TenantPaymentRequestsPage;
