import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";

const PaymentReport = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [filterParams, setFilterParams] = useState({
    vendorId: "",
    status: "",
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
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

  // Handle filter submit
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}payments/report`,
        filterParams
      );

      // Ensure the response is an array, otherwise set it to an empty array
      const data = Array.isArray(response.data) ? response.data : [];
      setPaymentData(data);
    } catch (error) {
      const message =
        error.response?.status === 404
          ? "No payment data found with the given filters."
          : "Error filtering data. Please try again.";
      setMessage(message);
      console.error("Error filtering data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const columns = [
    {
      key: "Vendor.fname",
      label: "Vendor",
      render: (row) => `${row.Vendor.fname} ${row.Vendor.lname}`,
    },
    { key: "price", label: "Price" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "status", label: "Status" },
    { key: "leftMoney", label: "Left Money" },
    {
      key: "paymentDate",
      label: "Payment Date",
      render: (data) => new Date(data.paymentDate).toLocaleString(),
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPayment(row)}
            className="bg-green-500 text-white px-2 py-1 rounded-md w-full md:w-auto min-w-[80px] text-center"
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Payment Report</h2>

        {/* Filter form */}
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-2 gap-4">
          {/* Vendor ID Dropdown */}
          <div>
            <label
              htmlFor="vendorId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Vendor
            </label>
            <select
              id="vendorId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.vendorId}
              onChange={(e) =>
                setFilterParams({ ...filterParams, vendorId: e.target.value })
              }
            >
              <option value="">Select Vendor</option>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.fname} {vendor.lname}
                  </option>
                ))
              ) : (
                <option value="">No vendors available</option>
              )}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.status}
              onChange={(e) =>
                setFilterParams({ ...filterParams, status: e.target.value })
              }
            >
              <option value="">Select Status</option>
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300"
            >
              {isLoading ? "Processing..." : "Filter Data"}
            </button>
          </div>
        </form>
      </div>

      {/* Table for displaying payment report */}
      <TableComponent
        title="Filtered Payment Report"
        data={paymentData || []} // Ensure the data is always an array
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

      {/* Message */}
      {message && (
        <div className="p-4 mt-4 bg-red-500 text-white rounded">{message}</div>
      )}

      {/* Detail View Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
            <div className="mb-4">
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
              <p>
                <strong>Contract Terms:</strong>{" "}
                <a
                  href={`${process.env.REACT_APP_BASE_URL}${selectedPayment?.Vendor?.contractTerms}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Contract
                </a>
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
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

export default PaymentReport;
