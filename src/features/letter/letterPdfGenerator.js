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
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 print:shadow-none print:border-none print:p-0 print:rounded-none print:block text-justify leading-7 text-gray-700">

  {/* Header */}
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-blue-600">{companyInfo?.buildingName || "Company Name"}</h1>
    <p>{companyInfo?.buildingAddress || "Company Address"}</p>
    <p>Phone: {companyInfo?.phoneNumber || "Company Phone"}</p>
    <p>Email: {companyInfo?.email || "Company Email"}</p>
  </div>

  {/* Date and Subject */}
  <div className="mb-8 text-right">
    <p className="mb-2">Date: {currentDate}</p>
  </div>

  {/* Recipient Block */}
  <div className="mb-8">
    <p className="font-semibold mb-1">To:</p>
    <p>{tenant?.fullName || "N/A"}</p>
    <p>Phone: {tenant?.phoneNumber || "N/A"}</p>
    <p>Email: {tenant?.email || "N/A"}</p>
  </div>
  {/* Subject */}
  <div className="flex space-x-2 mb-4">
    <p className="font-semibold mb-1">Subject:</p>
    <p>{letter?.description || "No subject available."}</p>
  </div>

  {/* Salutation and Body */}
  <div className="mb-8">
    <p className="mb-4">Dear {tenant?.fullName || "Tenant"},</p>
    <p>
      This letter serves to formally inform you that you are currently residing in <strong>Floor {tenant?.Floor?.floorNumber || "N/A"}, Unit {tenant?.Unit?.unitNumber || "N/A"}</strong> of our property. <br /><br />
      {letter?.description || "No description available."}
    </p>
  </div>

  {/* Closing and Signature */}
  <div className="mt-12">
    <p className="mb-4">Sincerely,</p>

    {companyInfo?.seal && (
      <div className="mb-4">
        <img
          src={companyInfo.seal}
          alt="Company Seal"
          className="w-28 h-28 object-cover mb-2"
        />
      </div>
    )}

    {/* <p className="font-semibold">{companyInfo?.companyName || "Company Representative"}</p> */}
  </div>
</div>

    </>
  );
};

export default LetterDetailPage;
