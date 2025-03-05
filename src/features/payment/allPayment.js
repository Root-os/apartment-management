import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import GeneratePdf from "../../components/pdfGenerator";

const AllPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch payments
    axios
      .get(`${process.env.REACT_APP_BASE_URL}payments`)
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the payments:", error);
      });

    // Fetch vendors
    axios
      .get(`${process.env.REACT_APP_BASE_URL}vendors`)
      .then((response) => {
        setVendors(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the vendors:", error);
      });
  }, []);

  // Handle edit button click
  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setVendorId(payment.vendorId);
    setPrice(payment.price);
    setPaymentMethod(payment.paymentMethod);
    setStatus(payment.status);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleDetailClick = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedPayment = {
        vendorId,
        price,
        paymentMethod,
        status,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}payments/${selectedPayment.id}`,
        updatedPayment
      );
      const updatedData = payments.map((payment) =>
        payment.id === selectedPayment.id ? response.data : payment
      );
      setPayments(updatedData);
      setIsEditModalOpen(false);
      setSelectedPayment(null);

      setMessageType("success");
      setMessage("Payment updated successfully");
    } catch (error) {
      setMessageType("error");
      setMessage("Unable to update payment");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}payments/${selectedPayment.id}`
      );
      setPayments(
        payments.filter((payment) => payment.id !== selectedPayment.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedPayment(null);

      setMessageType("success");
      setMessage("Payment deleted successfully");
    } catch (error) {
      setMessageType("error");
      setMessage("Unable to delete payment");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "Vendor.fname",
      label: "Vendor",
      render: (row) => `${row.Vendor?.fname} ${row.Vendor?.lname}`,
    },
    { key: "price", label: "Price" },
    { key: "leftMoney", label: "Left Money" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "status", label: "Status" },
    {
      key: "paymentDate",
      label: "Payment Date",
      render: (row) => new Date(row.paymentDate).toLocaleString(),
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-2 py-1 rounded-md w-full md:w-auto min-w-[80px] text-center"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-2 py-1 rounded-md w-full md:w-auto min-w-[80px] text-center"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(row)}
            className="bg-green-500 text-white px-2 py-1 rounded-md w-full md:w-auto min-w-[80px] text-center"
          >
            Detail
          </button>
          <button
            onClick={() => GeneratePdf(row)}
            className="bg-indigo-500 text-white px-2 py-1 rounded-md w-full md:w-auto min-w-[80px] text-center"
          >
            Generate PDF
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Payments</h1>
      <TableComponent
        title="Payments List"
        data={payments}
        columns={columns}
        exportable={true}
        showSearch={true}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Payment</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="vendorId"
                  className="block text-sm font-medium text-white-700"
                >
                  Vendor
                </label>
                <select
                  id="vendorId"
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Vendor
                  </option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.fname} {vendor.lname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-white-700"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
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
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Payment Method
                  </option>
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                  <option value="bank transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
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
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="complete">Complete</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View */}
      {isDetailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
            <div id="receipt-content" className="mb-4">
              <p>
                <strong>Vendor:</strong> {selectedPayment.Vendor.fname}{" "}
                {selectedPayment.Vendor.lname}
              </p>
              <p>
                <strong>Price:</strong> {selectedPayment.price}
              </p>
              <p>
                <strong>Left Money:</strong> {selectedPayment.leftMoney}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedPayment.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> {selectedPayment.status}
              </p>
              <p>
                <strong>Payment Date:</strong>{" "}
                {new Date(selectedPayment.paymentDate).toLocaleString()}
              </p>
              <p>
                <strong>Vendor Phone:</strong> {selectedPayment.Vendor.phone}
              </p>
              <p>
                <strong>Vendor Email:</strong> {selectedPayment.Vendor.email}
              </p>
              <p>
                <strong>Vendor Address:</strong>{" "}
                {selectedPayment.Vendor.address}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPaymentsPage;