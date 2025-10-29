import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import DisplayDate from "../../components/Common/displayDate";

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
  const [newPaymentData, setNewPaymentData] = useState({
    tenantId: "",
    billPaymentTypeId: "",
    amount: "",
    startDate: "",
    endDate: "",
    status: "",
    amountPaid: "",
    paymentMethod: "",
    paymentDate: "",
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}tenant-payments`)
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
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
      paymentMethod: payment.paymentMethod || "",
      paymentDate: payment.paymentDate ? payment.paymentDate.split("T")[0] : "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}tenant-payments/${selectedPayment.id}`,
        newPaymentData
      )
      .then(() => {
        setPayments(
          payments.map((payment) =>
            payment.id === selectedPayment.id
              ? { ...payment, ...newPaymentData }
              : payment
          )
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
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}tenant-payments/${selectedPayment.id}`
      )
      .then(() => {
        setPayments(
          payments.filter((payment) => payment.id !== selectedPayment.id)
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

  const columns = [
    {
      key: "tenantName",
      label: "Tenant Name",
      render: (payment) => payment.Tenant.fullName,
    },
    {
      key: "billType",
      label: "Bill Type",
      render: (payment) => payment.BillType.typeName,
    },
    {
      key: "amountPaid",
      label: "Amount Paid",
      render: (payment) => `ETB ${payment.amountPaid.toFixed(2)}`,
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
        exportable={true}
        onAdd={handleAddClick}
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
                min="1"
                step="1"
                value={newPaymentData.amountPaid}
                onChange={(e) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    amountPaid: e.target.value,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={newPaymentData.startDate}
                onChange={(e) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    startDate: e.target.value,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={newPaymentData.endDate}
                onChange={(e) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    endDate: e.target.value,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Payment Date
              </label>
              <input
                type="date"
                value={newPaymentData.paymentDate}
                onChange={(e) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    paymentDate: e.target.value,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

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
                value={newPaymentData.paymentMethod}
                onChange={(e) =>
                  setNewPaymentData({
                    ...newPaymentData,
                    paymentMethod: e.target.value,
                  })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
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
                {selectedPayment.Tenant?.fullName || "N/A"}
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
                <strong>End Date:</strong> {""}
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
                {selectedPayment.paymentMethod || "N/A"}
              </p>
              <p>
                <strong>Payment Date:</strong>{" "}
                {selectedPayment.paymentDate
                  ? new Date(selectedPayment.paymentDate)
                      .toISOString()
                      .split("T")[0]
                  : "N/A"}
              </p>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={modalMessage}
      />
    </div>
  );
};

export default ViewBillPayment;
