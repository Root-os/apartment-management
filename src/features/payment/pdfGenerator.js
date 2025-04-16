import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const GenerateReceiptPage = () => {
  const { state } = useLocation();
  const { payments } = state || { payments: [] };
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}setting`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const settings = response.data;
        if (settings && settings.length > 0) {
          setCompanyInfo(settings[0]);
        }
      } catch (error) {
        console.error("Failed to fetch company settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return <p className="text-center text-lg text-gray-700">Loading...</p>;
  }

  if (payments.length === 0) {
    return <p className="text-center text-lg text-gray-700">No payments available.</p>;
  }

  const vendor = payments[0].Vendor;
  const paymentDate = new Date(payments[0].paymentDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const totalPrice = payments.reduce((total, payment) => total + payment.price, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 my-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        {/* Company Info (Left) */}
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-800 uppercase">
            {companyInfo?.buildingName || "Company Name"}
          </h1>
          <p className="text-sm text-gray-600">{companyInfo?.buildingAddress || "Company Address"}</p>
          <p className="text-sm text-gray-600">{companyInfo?.email || "Company Email"}</p>
          <p className="text-sm text-gray-600">{companyInfo?.phoneNumber || "Company Phone"}</p>
        </div>
        {/* Logo and Receipt Title (Right) */}
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 uppercase mb-2">Receipt</h2>
          {companyInfo?.seal && (
            <img
              src={companyInfo.seal}
              alt="Company Seal"
              className="w-20 h-20 rounded-full object-cover inline-block"
            />
          )}
        </div>
      </div>

      {/* Bill To / Ship To Section */}
      <div className="flex justify-between mb-6 border-t border-b py-4">
        {/* Bill To (Left) */}
        <div className="w-1/3">
          <h3 className="text-sm font-bold text-gray-700 uppercase">Bill To</h3>
          <p className="text-sm text-gray-600">{vendor.fname} {vendor.lname}</p>
          <p className="text-sm text-gray-600">{vendor.address}</p>
          <p className="text-sm text-gray-600">{vendor.phone}</p>
          <p className="text-sm text-gray-600">{vendor.email}</p>
        </div>
        {/* Ship To (Middle) - Optional, can be omitted if not needed */}
        <div className="w-1/3">
          <h3 className="text-sm font-bold text-gray-700 uppercase">Ship To</h3>
          <p className="text-sm text-gray-600">{vendor.fname} {vendor.lname}</p>
          <p className="text-sm text-gray-600">{vendor.address}</p>
        </div>
        {/* Receipt Info (Right) */}
        <div className="w-1/3 text-right">
          <p className="text-sm text-gray-600">
            <span className="font-bold">Receipt No:</span> INV{payments[0].id || "000001"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Payment Date:</span> {paymentDate}
          </p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-4 text-sm font-bold text-gray-700 uppercase">Description</th>
              <th className="py-2 px-4 text-sm font-bold text-gray-700 uppercase">Payment Method</th>
              <th className="py-2 px-4 text-sm font-bold text-gray-700 uppercase text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 text-sm text-gray-600">{payment.details || `Payment ${index + 1}`}</td>
                <td className="py-2 px-4 text-sm text-gray-600">{payment.paymentMethod}</td>
                <td className="py-2 px-4 text-sm text-gray-600 text-right">ETB {payment.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="text-right mb-6">
        <div className="inline-block text-left">
          <p className="text-sm text-gray-600">
            <span className="font-bold">Subtotal:</span> ETB {totalPrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Discount:</span> ETB 0.00
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Subtotal Less Discount:</span> ETB {totalPrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Tax Rate:</span> 0.00%
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Total Tax:</span> ETB 0.00
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Shipping/Handling:</span> ETB 0.00
          </p>
          <p className="text-base font-bold text-gray-700 border-t pt-2">
            Balance Paid: ETB {totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center mb-6">
        <p className="text-sm font-bold text-gray-700">Thank you for your business!</p>
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase">Notes</h3>
        <p className="text-sm text-gray-600">
          Write payment method used, e.g., cash/credit/cheque.
        </p>
        <p className="text-sm text-gray-600">
          Add terms here, e.g., warranty, returns policy.
        </p>
      </div>

      {/* Print Button */}
      <div className="text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default GenerateReceiptPage;