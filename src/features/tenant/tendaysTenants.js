import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableComponent from "../../components/table";
import LoadingComponent from "../../components/loading";

const TenDaysTenant = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(null);

  const navigate = useNavigate();

  // Fetch tenant data from the API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}tenant/10days/remaining`
        );
        setTenants(response.data);
        setError("");
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No tenants found - this is not an error, just empty data
          setTenants([]);
          setError("");
        } else {
          // Other errors (e.g., server down)
          setError("Failed to fetch tenant data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const getDocumentUrl = (document) => {
    return `${process.env.REACT_APP_BASE}${document}`;
  };

  const openDetailsModal = (tenant) => {
    setSelectedTenant(tenant);
  };
  const navigateToRentAdd = () => {
    window.location.href = "/app/rent-collection-add";
  };

  const columns = [
    {
      label: "Full Name",
      key: "fullName",
    },
    {
      label: "Phone Number",
      key: "phoneNumber",
    },
    {
      label: "Advance",
      key: "advance",
    },
    {
      label: "Unit Number",
      key: "unitNumber",
      render: (row) => row.Unit?.unitNumber || "N/A",
    },
    {
      label: "Floor",
      key: "floorNumber",
      render: (row) => row.Floor?.floorNumber || "N/A",
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openDetailsModal(row)}
            className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Detail
          </button>
          <button
            onClick={() =>
              navigate(`/app/rent-collection-add?tenantId=${row.id}`)
            }
            className="bg-indigo-500 text-white py-1 px-3 rounded"
          >
            Rent
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Tenants with Lease Ending in 10 Days
      </h2>

      {/* Error message if fetching failed */}
      {error && <div className="bg-red-300 p-3 mb-4 text-red-800">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div className="text-center p-4">
          <LoadingComponent />
        </div>
      ) : (
        <div>
          <TableComponent
            title=""
            data={tenants}
            columns={columns}
            rowsPerPageOptions={[5, 10, 15]}
            showSearch={true}
            exportable={true}
          />
          {tenants.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No tenants found whose lease ends in 10 days or less.
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center mt-12">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">
              Details for {selectedTenant.fullName}
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Phone Number:</strong> {selectedTenant.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {selectedTenant.email || "N/A"}
              </p>
              <p>
                <strong>National ID:</strong> {selectedTenant.nationalId}
              </p>
              <p>
                <strong>Lease Start Date:</strong>{" "}
                {selectedTenant.leaseStartDate
                  ? new Date(selectedTenant.leaseStartDate)
                      .toISOString()
                      .split("T")[0]
                  : "N/A"}
              </p>
              <p>
                <strong>Lease End Date:</strong>{" "}
                {selectedTenant.leaseEndDate
                  ? new Date(selectedTenant.leaseEndDate)
                      .toISOString()
                      .split("T")[0]
                  : "N/A"}
              </p>
              <p>
                <strong>Rent Amount:</strong> {selectedTenant.amount}
              </p>
              <p>
                <strong>Remaining Days:</strong> {selectedTenant.remainingDays}
              </p>
              <p>
                <strong>Payment Status:</strong> {selectedTenant.paymentStatus}
              </p>
              <p>
                <strong>Additional Notes:</strong>{" "}
                {selectedTenant.additionalNotes}
              </p>
              <p>
                <strong>Advance:</strong> {selectedTenant.advance}
              </p>
              <p>
                <strong>TIN:</strong> {selectedTenant.tin}
              </p>
              <p>
                <strong>Car Plate:</strong> {selectedTenant.carPlate}
              </p>
              <p>
                <strong>Car Name:</strong> {selectedTenant.carName}
              </p>
              <p>
                <strong>Status:</strong> {selectedTenant.status}
              </p>
              <p>
                <strong>Unit Number:</strong> {selectedTenant.Unit?.unitNumber}
              </p>
              <p>
                <strong>Floor Number:</strong>{" "}
                {selectedTenant.Floor?.floorNumber}
              </p>
              <p>
                <strong>Document:</strong>{" "}
                <a
                  href={`${process.env.REACT_APP_BASE}${selectedTenant.document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Document
                </a>
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setSelectedTenant(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
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

export default TenDaysTenant;
