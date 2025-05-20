import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const LetterDetailPage = () => {
  const { state } = useLocation();
  const letter = state?.letterDetails;
  const [companyInfo, setCompanyInfo] = useState(null);

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

  if (!letter) {
    return <p className="text-center text-lg text-red-500 print:hidden">No letter data provided.</p>;
  }

  if (!companyInfo) {
    return <p className="text-center text-lg text-gray-700 print:hidden">Loading company information...</p>;
  }

  const tenant = letter.Tenant;
  const currentDate = new Date(letter.letterDate || letter.createdAt).toISOString().split('T')[0];

  return (
    <>
      {/* Non-printable UI */}
      <div className="print:hidden">
        <header className="p-4 bg-gray-100 shadow">
          <h2 className="text-2xl font-bold">Apartment Management System</h2>
        </header>

        {/* Optional Sidebar, Topbar, etc. */}

        <div className="text-center mt-6">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Print Letter
          </button>
        </div>
      </div>

      {/* Printable area only */}
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 print:shadow-none print:border-none print:p-0 print:rounded-none print:block">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-600">{companyInfo?.buildingName || "Company Name"}</h1>
          <p className="text-lg text-gray-600">{companyInfo?.buildingAddress || "Company Address"}</p>
          <p className="text-lg text-gray-600">{companyInfo?.phoneNumber || "Company Phone"}</p>
          <p className="text-lg text-gray-600">{companyInfo?.email || "Company Email"}</p>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-600">Date: {currentDate}</p>
          <p className="text-lg text-gray-600">Subject: {letter.LetterType?.name || "N/A"}</p>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-600">To: {tenant?.fullName || "N/A"}</p>
          <p className="text-lg text-gray-600">Phone: {tenant?.phoneNumber || "N/A"}</p>
          <p className="text-lg text-gray-600">Email: {tenant?.email || "N/A"}</p>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-600">Dear {tenant?.fullName || "N/A"},</p>
          <p className="text-lg text-gray-600">
            As you know, you are a tenant in Floor {tenant?.Floor?.floorNumber || "N/A"} on unit {tenant?.Unit?.unitNumber || "N/A"}.
            {letter?.description || "No description available"}
          </p>
        </div>

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
      </div>
    </>
  );
};

export default LetterDetailPage;
