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
  <div className="max-w-3xl mx-auto p-0 bg-white shadow-lg rounded-lg border border-gray-200 my-6 print:max-w-full print:shadow-none print:border-none print:p-0">
    
    {/* HEADER with Background */}
    <div className="flex justify-between items-center bg-blue-50 border-b border-gray-300 p-6 rounded-t-lg">
      <div>
        <h1 className="text-2xl font-bold text-blue-900 uppercase">{companyInfo?.buildingName || "Company Name"}</h1>
        <p className="text-sm text-blue-700">{companyInfo?.buildingAddress || "Company Address"}</p>
        <p className="text-sm text-blue-700">{companyInfo?.email || "Company Email"}</p>
        <p className="text-sm text-blue-700">{companyInfo?.phoneNumber || "Company Phone"}</p>
      </div>
      {companyInfo?.logos && (
        <img
          src={companyInfo.logos}
          alt="Company Logo"
          className="w-24 h-24 object-contain"
        />
      )}
    </div>

    {/* Payment Info */}
    <div className="flex justify-end px-6 mt-4 mb-2">
      <div className="text-sm text-right text-gray-600">
        <p><span className="font-bold">Receipt No:</span> 00{payment.id || "000001"}</p>
        <p><span className="font-bold">Payment Date:</span> {paymentDate}</p>
      </div>
    </div>

    {/* Bill To / Ship To Section */}
    <div className="flex justify-between border-t border-b py-4 px-6 bg-gray-50">
      {/* Bill To */}
      <div className="w-1/2">
        <h3 className="text-sm font-bold text-gray-700 uppercase mb-1">Bill To</h3>
        <p className="text-sm text-gray-600">{vendor.fname} {vendor.lname}</p>
        <p className="text-sm text-gray-600">{vendor.address}</p>
        <p className="text-sm text-gray-600">{vendor.phone}</p>
        <p className="text-sm text-gray-600">{vendor.email}</p>
      </div>

      {/* Ship To */}
      {vendor.shipAddress && vendor.shipAddress !== vendor.address && (
        <div className="w-1/2">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-1">Ship To</h3>
          <p className="text-sm text-gray-600">{vendor.fname} {vendor.lname}</p>
          <p className="text-sm text-gray-600">{vendor.shipAddress}</p>
        </div>
      )}
    </div>

    {/* Transaction Details */}
    <div className="relative mb-12 mt-6 border-t border-b py-6 px-6 text-sm text-gray-700 bg-white">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-bold w-1/2">Item</span>
          <span className="w-1/2 text-right">{payment.item || "Item 1"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold w-1/2">Description</span>
          <span className="w-1/2 text-right">{payment.description || "Payment"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold w-1/2">Payment Method</span>
          <span className="w-1/2 text-right">{payment.paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold w-1/2">Amount</span>
          <span className="w-1/2 text-right">ETB {payment.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Seal Overlay */}
      {companyInfo?.seal && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none z-0">
          <img
            src={companyInfo.seal}
            alt="Company Seal"
            className="w-32 h-32 rounded-full object-contain"
          />
        </div>
      )}
    </div>

    {/* Summary Section */}
    <div className="text-right px-6 mb-6">
      <p className="text-base font-bold text-gray-700 border-t pt-2 inline-block">
        Balance Paid: ETB {totalPrice.toFixed(2)}
      </p>
    </div>

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
