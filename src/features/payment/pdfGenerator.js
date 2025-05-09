import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const GenerateReceiptPage = () => {
  const { state } = useLocation();
  const { payment } = state || {};
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

  if (!payment) {
    return <p className="text-center text-lg text-gray-700">No payment data available.</p>;
  }

  const vendor = payment.Vendor;
  const paymentDate = new Date(payment.paymentDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const totalPrice = payment.price;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 my-6 print:max-w-full print:shadow-none print:border-none">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-800 uppercase">
            {companyInfo?.buildingName || "Company Name"}
          </h1>
          <p className="text-sm text-gray-600">{companyInfo?.buildingAddress || "Company Address"}</p>
          <p className="text-sm text-gray-600">{companyInfo?.email || "Company Email"}</p>
          <p className="text-sm text-gray-600">{companyInfo?.phoneNumber || "Company Phone"}</p>
        </div>

        <div className="text-right space-y-2">
        {companyInfo?.logos && (
          <img
            src={companyInfo.logos}
            alt="Company Logo"
            className="w-24 h-24 object-contain mb-4"
          />
        )}

          {/* <h2 className="text-2xl font-bold text-gray-800 uppercase">Receipt</h2> */}
        </div>
      </div>

      {/* Bill To / Ship To Section */}
      <div className="flex justify-between mb-6 border-t border-b py-4">
        {/* Bill To */}
        <div className="w-1/2">
          <h3 className="text-sm font-bold text-gray-700 uppercase">Bill To</h3>
          <p className="text-sm text-gray-600">{vendor.fname} {vendor.lname}</p>
          <p className="text-sm text-gray-600">{vendor.address}</p>
          <p className="text-sm text-gray-600">{vendor.phone}</p>
          <p className="text-sm text-gray-600">{vendor.email}</p>
        </div>

        {/* Ship To (conditionally shown) */}
        {vendor.shipAddress && vendor.shipAddress !== vendor.address && (
          <div className="w-1/2">
            <h3 className="text-sm font-bold text-gray-700 uppercase">Ship To</h3>
            <p className="text-sm text-gray-600">{vendor.fname} {vendor.lname}</p>
            <p className="text-sm text-gray-600">{vendor.shipAddress}</p>
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="flex justify-end mb-6">
        <div className="text-sm text-right text-gray-600">
          <p><span className="font-bold">Receipt No:</span> 00{payment.id || "000001"}</p>
          <p><span className="font-bold">Payment Date:</span> {paymentDate}</p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-4 text-sm font-bold text-gray-700 uppercase">Item</th>
              <th className="py-2 px-4 text-sm font-bold text-gray-700 uppercase">Description</th>
              <th className="py-2 px-4 text-sm font-bold text-gray-700 uppercase">Payment Method</th>
              <th className="py-2 px-4 text-sm font-bold text-gray-700 uppercase text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 text-sm text-gray-600">{payment.item || "Item 1"}</td>
              <td className="py-2 px-4 text-sm text-gray-600">{payment.description || "Payment"}</td>
              <td className="py-2 px-4 text-sm text-gray-600">{payment.paymentMethod}</td>
              <td className="py-2 px-4 text-sm text-gray-600 text-right">ETB {payment.price.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="text-right mb-6">
        <div className="inline-block text-left">
          {/* <p className="text-sm text-gray-600">
            <span className="font-bold">Subtotal:</span> ETB {totalPrice.toFixed(2)}
          </p> */}
          <p className="text-base font-bold text-gray-700 border-t pt-2">
            Balance Paid: ETB {totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Company Seal at Bottom Center */}
      {companyInfo?.seal && (
        <div className="flex justify-center mt-10">
          <img
            src={companyInfo.seal}
            alt="Company Seal"
            className="w-24 h-24 rounded-full object-cover inline-block"
          />
        </div>
      )}

      {/* Print Button */}
      <div className="text-center mt-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Print Receipt
        </button>
      </div>
        {/* Footer Message */}
      <div className="text-center mb-6">
        <p className="text-sm font-bold text-gray-700">Thank you for your business!</p>
      </div>
    </div>
  );
};

export default GenerateReceiptPage;
