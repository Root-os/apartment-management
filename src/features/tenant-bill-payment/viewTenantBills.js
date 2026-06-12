import React, { useState, useEffect } from "react";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import DisplayDate from "../../components/Common/displayDate";
import SmartDateInput from "../../components/Common/smartDatePicker";
import api from "../../utils/api";

const ViewBillPayment = () => {
  const [payments, setPayments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [receiptForm, setReceiptForm] = useState({
    id: null,
    rentCollectionId: null,
    status: "pending",
    fsNo: "",
    deliveryStatus: "pending",
  });
  const [newPaymentData, setNewPaymentData] = useState({
    tenantId: "",
    billPaymentTypeId: "",
    amount: "",
    startDate: "",
    endDate: "",
    status: "",
    amountPaid: "",
    paymentTypeId: "",
    // paymentDate: "",
  });

  useEffect(() => {
    api
      .get(`tenant-payments`)
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
      });
  }, []);

  useEffect(() => {
    api
      .get(`payment-settings`)
      .then((response) => {
          setPaymentTypes(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching payment types:", error);
      });
  }, []);

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setNewPaymentData({
      tenantId: payment.tenantId,
      billPaymentTypeId: payment.paymentTypeId || payment.billPaymentTypeId,
      amount: payment.amount,
      startDate: payment.startDate.split("T")[0],
      endDate: payment.endDate.split("T")[0],
      status: payment.status,
      amountPaid: payment.amountPaid || "",
      paymentTypeId: payment.paymentTypeId || payment.billPaymentTypeId || "",  
      // paymentDate: payment.paymentDate ? payment.paymentDate.split("T")[0] : "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    setIsLoading(true);

    const payload = {
      ...newPaymentData,
      amountPaid: Number(newPaymentData.amountPaid),
    };

    api
      .put(`tenant-payments/${selectedPayment.id}`, newPaymentData)
      .then(() => {
        setPayments(
          payments.map((payment) =>
            payment.id === selectedPayment.id
              ? { ...payment, ...newPaymentData }
              : payment,
          ),
        );
        setIsEditModalOpen(false);
        setModalOpen(true);
        setMessageType("success");
        setModalMessage("Payment updated successfully");
      })
      .catch((error) => {
        console.error("Error updating payment:", error);
        setModalOpen(true);
        setMessageType("error");
        setModalMessage("Unable to update payment");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    api
      .delete(`tenant-payments/${selectedPayment.id}`)
      .then(() => {
        setPayments(
          payments.filter((payment) => payment.id !== selectedPayment.id),
        );
        setIsDeleteModalOpen(false);
        setModalOpen(true);
        setMessageType("success");
        setModalMessage("Payment deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting payment:", error);
        setModalOpen(true);
        setMessageType("error");
        setModalMessage("Unable to delete payment");
      });
  };
  const handleDetailClick = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

 const openReceiptModal = async (payment) => {
  const tenantPaymentId = payment.id; 

  console.log("Calling API with tenantPaymentId:", tenantPaymentId);

  try {
    const res = await api.get(
      `rent-receipt/tenantPayment/${tenantPaymentId}`
    );

    setReceiptForm({
      id: res.data.id,
      tenantPaymentId: tenantPaymentId,
      status: res.data.status,
      fsNo: res.data.fsNo || "",
      deliveryStatus: res.data.deliveryStatus,
    });
  } catch (error) {
    setReceiptForm({
      id: null,
      tenantPaymentId: tenantPaymentId,
      status: "pending",
      fsNo: "",
      deliveryStatus: "pending",
    });
  }

  setReceiptModalOpen(true);
};

  const handleSaveReceipt = async () => {
    try {
      if (receiptForm.id) {
        await api.put(`rent-receipt/${receiptForm.id}`, receiptForm);
      } else {
        await api.post(`rent-receipt`, receiptForm);
      }

      setReceiptModalOpen(false);

      setModalOpen(true);
      setMessageType("success");
      setModalMessage("Receipt saved successfully!");
    } catch (error) {
      setModalOpen(true);
      setMessageType("error");
      setModalMessage(error.response?.data?.message || "Error saving receipt");
    }
  };

  const columns = [
    {
      key: "tenantName",
      label: "Tenant Name",
      render: (payment) => payment.Tenant.fullName,
    },
    {
      key: "floorNumber",
      label: "Floor",
      render: (payment) => payment.Tenant?.Floor?.floorNumber || "N/A",
    },
    {
      key: "unitNumber",
      label: "Unit",
      render: (payment) => payment.Tenant?.Unit?.unitNumber || "N/A",
    },
    {
      key: "billType",
      label: "Bill Type",
      render: (payment) => payment.BillType?.typeName || "N/A",
    },
    {
      key: "amountPaid",
      label: "Amount Paid",
      render: (payment) => {
        const amount = Number(payment.amountPaid);
        return `ETB ${!isNaN(amount) ? amount.toFixed(2) : "0.00"}`;
      },
    },
    { key: "status", label: "Status" },
    { key: "startDate", label: "Start Date", isDate: true },
    { key: "endDate", label: "End Date", isDate: true },
    {
      key: "actions",
      label: "Actions",
      render: (payment) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(payment)}
            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(payment)}
            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(payment)}
            className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-700"
          >
            Detail
          </button>
          <button
            onClick={() => openReceiptModal(payment)}
            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
          >
            Receipt
          </button>
        </div>
      ),
    },
  ];

  const handleAddClick = () => {
    window.location.href = "/app/tenant-bill-add";
  };

  return (
    <div>
      <TableComponent
        title="Tenant Bill Payments"
        data={payments}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        // exportable={true}
        onAdd={handleAddClick}
        exportConfig={[
    {
      label: "Tenant Name",
      getValue: (r) => r.Tenant?.fullName ?? "N/A",
    },
    {
      label: "Unit Number",
      getValue: (r) => r.Tenant?.Unit?.unitNumber ?? "N/A",
    },
    {
      label: "Floor",
      getValue: (r) => r.Tenant?.Floor?.floorNumber ?? "N/A",
    },
    {
      label: "Bill Type",
      getValue: (r) => r.BillType?.typeName ?? "N/A",
    },
    {
      label: "Amount Paid",
      getValue: (r) => r.amountPaid ?? 0,
    },
    {
      label: "Payment Method",
      getValue: (r) => r.PaymentSetting?.paymentMethod ?? "N/A",
    },
    {
      label: "Status",
      getValue: (r) => r.status || "N/A",
    },
    {
      label: "Start Date",
      getValue: (r) =>
        r.startDate
          ? new Date(r.startDate).toLocaleDateString()
          : "N/A",
    },
    {
      label: "End Date",
      getValue: (r) =>
        r.endDate
          ? new Date(r.endDate).toLocaleDateString()
          : "N/A",
    },
    // {
    //   label: "Lease Start Date",
    //   getValue: (r) =>
    //     r.Tenant?.leaseStartDate
    //       ? new Date(r.Tenant.leaseStartDate).toLocaleDateString()
    //       : "N/A",
    // },
    // {
    //   label: "Lease End Date",
    //   getValue: (r) =>
    //     r.Tenant?.leaseEndDate
    //       ? new Date(r.Tenant.leaseEndDate).toLocaleDateString()
    //       : "N/A",
    // },
  ]}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 py-4">
          <div
            className="bg-base-100 p-4 sm:p-6 rounded-lg w-full max-w-md 
                    max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 
                    scrollbar-track-gray-100"
          >
            <h2 className="text-xl mb-4">Edit Payment</h2>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                min="1"
                step="1"
                value={newPaymentData.amount}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, amount: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div> */}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Amount Paid
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPaymentData.amountPaid}
                onChange={(e) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    amountPaid:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <SmartDateInput
                value={newPaymentData.startDate}
                onChange={(gcDate) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    startDate: gcDate,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">End Date</label>
              <SmartDateInput
                value={newPaymentData.endDate}
                onChange={(gcDate) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    endDate: gcDate,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Payment Date
              </label>
              <SmartDateInput
                value={newPaymentData.paymentDate}
                onChange={(gcDate) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    paymentDate: gcDate,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div> */}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newPaymentData.status}
                onChange={(e) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    status: e.target.value,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="due">Due</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="mb-4">
  <label className="block text-sm font-medium mb-2">
    Payment Method
  </label>

  <select
    value={newPaymentData.paymentTypeId || ""}
    onChange={(e) =>
      setNewPaymentData({
        ...newPaymentData,
        paymentTypeId: Number(e.target.value),
      })
    }
    className="bg-base-100 w-full p-2 border border-gray-300 rounded"
    required
  >
    <option value="">Select Payment Method</option>

    {Array.isArray(paymentTypes) &&
      paymentTypes.map((type) => (
        <option key={type.id} value={type.id}>
          {type.paymentMethod}
        </option>
      ))}
  </select>
</div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? "updating" : "Upate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete this payment?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-base-100 px-6 rounded-lg w-full max-w-3xl sm:max-w-md">
            <h2 className="text-xl mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>Tenant Name:</strong>{" "}
                {selectedPayment?.Tenant?.fullName || "N/A"}
              </p>
              <p>
                <strong>Unit Number:</strong>{" "}
                {selectedPayment.Tenant?.Unit?.unitNumber || "N/A"}
              </p>
              <p>
                <strong>Floor Number:</strong>{" "}
                {selectedPayment.Tenant?.Floor?.floorNumber || "N/A"}
              </p>
              <p>
                <strong>Bill Type:</strong>{" "}
                {selectedPayment.BillType?.typeName || "N/A"}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                <DisplayDate date={selectedPayment.startDate} />
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                <DisplayDate date={selectedPayment.endDate} />
              </p>

              <p>
                <strong>Amount:</strong> {selectedPayment.amountPaid || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedPayment.status || "N/A"}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {selectedPayment.PaymentSetting?.paymentMethod || "N/A"}
              </p>
              {/* <p>
                <strong>Payment Date:</strong>{" "}
                {selectedPayment.paymentDate
                  ? new Date(selectedPayment.paymentDate)
                      .toISOString()
                      .split("T")[0]
                  : "N/A"}
              </p> */}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl mb-4">
              {receiptForm.id ? "Edit Receipt" : "Create Receipt"}
            </h2>

            {/* STATUS */}
            <div className="mb-4">
              <label>Status</label>
              <select
                value={receiptForm.status}
                onChange={(e) =>
                  setReceiptForm({ ...receiptForm, status: e.target.value })
                }
                className={`w-full p-2 border rounded
                  ${
                    receiptForm.status === "cutted"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                `}
              >
                <option value="pending">Pending</option>
                <option value="cutted">Cutted</option>
              </select>
            </div>

            {/* FS NUMBER */}
            <div className="mb-4">
              <label>FS Number</label>
              <input
                type="text"
                value={receiptForm.fsNo}
                onChange={(e) =>
                  setReceiptForm({ ...receiptForm, fsNo: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter FS Number"
                // Editable if status is 'cutted' OR if editing an existing receipt
                disabled={receiptForm.status !== "cutted" && !receiptForm.id}
              />
            </div>

            {/* DELIVERY STATUS */}
            <div className="mb-4">
              <label>Delivery Status</label>
              <select
                value={receiptForm.deliveryStatus}
                onChange={(e) =>
                  setReceiptForm({
                    ...receiptForm,
                    deliveryStatus: e.target.value,
                  })
                }
                className={`w-full p-2 border rounded
                  ${
                    receiptForm.deliveryStatus === "delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                `}
                disabled={receiptForm.status !== "cutted" || !receiptForm.fsNo}
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between">
              {/* LEFT SIDE (DELETE) */}
              {/* {receiptForm.id && (
                <button
                  onClick={handleDeleteReceipt}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              )} */}

              {/* RIGHT SIDE */}
              <div className="flex gap-2">
                <button
                  onClick={() => setReceiptModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveReceipt}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {receiptForm.id ? "Update" : "Create"}
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
        message={modalMessage}
        rowsPerPageOptions={[30, 50, 100]}
      />
    </div>
  );
};

export default ViewBillPayment;
