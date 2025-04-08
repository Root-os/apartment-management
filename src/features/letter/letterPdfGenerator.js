import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const LetterDetailPage = () => {
  const { state } = useLocation(); // Get the state passed via navigate
  const letter = state?.letterDetails; // Extract letterDetails from state
  const [companyInfo, setCompanyInfo] = useState(null);

  // Fetch company info only
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const companyResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}setting`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const settings = companyResponse.data;
        if (settings && settings.length > 0) {
          setCompanyInfo(settings[0]);
        }
      } catch (error) {
        console.error("Error fetching company settings:", error);
      }
    };

    fetchCompanyInfo();
  }, []);

  // If letter is not provided via state, show an error
  if (!letter) {
    return <p className="text-center text-lg text-red-500">No letter data provided.</p>;
  }

  // If company info is still loading, show a loading message
  if (!companyInfo) {
    return <p className="text-center text-lg text-gray-700">Loading company information...</p>;
  }

  const tenant = letter.Tenant;
  
  console.log('tenant',tenant)

  if (!tenant) {
    return <p className="text-center text-lg text-red-500">No tenant data available.</p>;
  }
  console.log("Tenant details: ", tenant);

  const currentDate = new Date(letter.letterDate || letter.createdAt).toLocaleDateString();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Company Info and Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-600">{companyInfo?.buildingName || "Company Name"}</h1>
        <p className="text-lg text-gray-600">{companyInfo?.buildingAddress || "Company Address"}</p>
        <p className="text-lg text-gray-600">{companyInfo?.phoneNumber || "Company Phone"}</p>
        <p className="text-lg text-gray-600">{companyInfo?.email || "Company Email"}</p>
      </div>

      {/* Date and Subject */}
      <div className="mb-6">
        <p className="text-lg text-gray-600">Date: {currentDate}</p>
        <p className="text-lg text-gray-600">Subject: {letter.LetterType?.name || "N/A"}</p>
      </div>

      {/* Recipient Info */}
      <div className="mb-6">
        <p className="text-lg text-gray-600">To: {tenant?.fullName || "N/A"}</p>
        <p className="text-lg text-gray-600">Phone: {tenant?.phoneNumber || "N/A"}</p>
        <p className="text-lg text-gray-600">Email: {tenant?.email || "N/A"}</p>
      </div>

      {/* Letter Body */}
      <div className="mb-6">
        <p className="text-lg text-gray-600">Dear {tenant?.fullName || "N/A"},</p>
        <p className="text-lg text-gray-600">
          As you know, you are a tenant in Floor {tenant?.Floor?.floorNumber || "N/A"} on unit {tenant?.unitId || "N/A"}.
        {letter?.description || "No description available"}

        </p>
      </div>

      {/* Closing and Signature */}
      <div className="mb-6">
        <p className="text-lg text-gray-600">Sincerely,</p>
        <div className="flex justify-center mb-4">
          {companyInfo?.seal && (
            <img
              src={companyInfo.seal}
              alt="Company Seal"
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
        </div>
        <p className="text-lg text-gray-600">{companyInfo?.companyName || "Company Representative"}</p>
      </div>

      {/* Print Button */}
      <div className="text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Print Letter
        </button>
      </div>
    </div>
  );
};

export default LetterDetailPage;
