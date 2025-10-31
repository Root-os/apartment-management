import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import GenerateReceipt from "./pdfGenerator";
import { useNavigate } from "react-router-dom";
import DisplayDate from "../../components/Common/displayDate";
import SmartDateInput from "../../components/Common/smartDatePicker";

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
  const [paymentDate, setPaymentDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [selectedVendorPayments, setSelectedVendorPayments] = useState([]);

  const navigate = useNavigate();

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

  // Handle delete button click
  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleDetailClick = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const handleGenerateReceipt = (payment) => {
    navigate("/app/payment-receipt", { state: { payment } });
  };

  // Handle edit button click
  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setVendorId(payment.vendorId);
    setPrice(payment.price);
    setPaymentMethod(payment.paymentMethod);
    setStatus(payment.status);
    setDescription(payment.description || "");

    const formattedPaymentDate = new Date(payment.paymentDate)
      .toISOString()
      .split("T")[0];
    setPaymentDate(formattedPaymentDate);
    setIsEditModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedPayment = {
        vendorId: Number(vendorId),
        price: Number(price),
        paymentMethod,
        status,
        paymentDate,
        description,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}payments/${selectedPayment.id}`,
        updatedPayment
      );

      const updatedVendor = vendors.find(
        (vendor) => vendor.id === Number(vendorId)
      );
      const updatedPaymentFromServer = response.data.payment;

      const updatedData = payments.map((payment) =>
        payment.id === selectedPayment.id
          ? {
              ...payment,
              ...updatedPaymentFromServer,
              Vendor: updatedVendor,
            }
          : payment
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
    { key: "item", label: "Item" },
    { key: "price", label: "Price" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
    {
      key: "paymentDate",
      label: "Payment Date",
      isDate: true,
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
            className="bg-gray-400 text-white px-2 py-1 rounded-md w-full md:w-auto min-w-[80px] text-center"
          >
            Detail
          </button>
          <button
            onClick={() => handleGenerateReceipt(row)} // Pass the entire payment object
            className="bg-indigo-500 text-white px-2 py-1 rounded-md w-full md:w-auto min-w-[80px] text-center"
          >
            Receipt
          </button>
        </div>
      ),
    },
  ];
  const handleAddClick = () => {
    window.location.href = "/app/add-payment";
  };

  return (
    <div className="container mx-auto p-6">
      <TableComponent
        title="Payment made for Vendors " //Vendors Payment
        data={payments}
        columns={columns}
        exportable={true}
        showSearch={true}
        onAdd={handleAddClick}
      />

      {selectedVendorPayments.length > 0 && (
        <GenerateReceipt payments={selectedVendorPayments} />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
          <div className="bg-base-100 p-6 rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                  min="1"
                  step="1"
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
                  <option value="bank transfer">Bank Transfer</option>
                  <option value="tellebirr">Tellebirr</option>
                  <option value="mobile banking">Mobile Banking</option>
                  <option value="others">Other</option>
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
              <div className="mb-4">
                <label
                  htmlFor="paymentDate"
                  className="block text-sm font-medium text-white-700"
                >
                  Payment Date
                </label>
                <SmartDateInput
                  id="paymentDate"
                  value={paymentDate}
                  onChange={(gcDate) => setPaymentDate(gcDate)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
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
              {/* <p>
                <strong>Vendor:</strong> {selectedPayment.Vendor.fname}{" "}
                {selectedPayment.Vendor.lname}
              </p> */}
              <p>
                <strong>Item:</strong> {selectedPayment.item}
              </p>
              <p>
                <strong>Price:</strong> {selectedPayment.price}
              </p>
              <p>
                <strong>Description:</strong> {selectedPayment.description}
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
                <DisplayDate date={selectedPayment.paymentDate} />
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
