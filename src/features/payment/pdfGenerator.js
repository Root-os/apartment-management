import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const GenerateReceiptPage = () => {
  const { state } = useLocation(); // Get the state passed from AllPaymentsPage
  const { payments } = state || { payments: [] }; // Default to empty array if no payments are passed
  const [companyInfo, setCompanyInfo] = useState(null);

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
      }
    };

    fetchSettings();
  }, []);

  if (payments.length === 0) {
    return <p className="text-center text-lg text-gray-700">No payments available.</p>;
  }

  const vendor = payments[0].Vendor;
  const paymentDate = new Date(payments[0].paymentDate).toLocaleString();
  const totalPrice = payments.reduce((total, payment) => total + payment.price, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Company Information */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-600">{companyInfo?.buildingName || "Company Name"}</h1>
        <p className="text-lg text-gray-600">{companyInfo?.buildingAddress || "Company Address"}</p>
      </div>

      {/* Vendor Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Receipt for: {vendor.fname} {vendor.lname}</h3>
        <p className="text-gray-600">Vendor Address: {vendor.address}</p>
        <p className="text-gray-600">Vendor Phone: {vendor.phone}</p>
        <p className="text-gray-600">Vendor Email: {vendor.email}</p>
      </div>

      {/* Payment Information */}
      <div className="mb-6">
        <p className="text-lg text-gray-600">Payment Date: {paymentDate}</p>
        <p className="text-lg text-gray-600">Payment Method: {payments[0].paymentMethod}</p>
        <p className="text-lg text-gray-600">Status: {payments[0].status}</p>
      </div>

      {companyInfo?.seal && (
          <div className="flex justify-center mb-4">
            <img
              src={companyInfo.seal} // Dynamically use the seal URL from the settings
              alt="Company Seal"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

      {/* Item List (Prices) */}
      <div className="mb-6">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-sm text-gray-600">Price</th>
              <th className="px-4 py-2 border-b text-sm text-gray-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td className="px-4 py-2  text-sm text-gray-700">ETB-{payment.price}</td>
                <td className="px-4 py-2  text-sm text-gray-700">{payment.details || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Price */}
      <div className="mb-6 text-right">
        <h3 className="text-xl font-semibold text-gray-700">Total Price: ETB-{totalPrice}</h3>
      </div>

      {/* Print Button */}
      <div className="text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default GenerateReceiptPage;
