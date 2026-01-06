import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import api from '../../utils/api';

const TenantFilterList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [floorDetails, setFloorDetails] = useState(null);
  const [unitDetails, setUnitDetails] = useState(null);

  // Fetch tenant data from the API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await api.get(`tenant`);
        setTenants(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tenant data.');
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const getDocumentUrl = (document) => {
    return `process.env.BASE_URL${document}`;
  };

  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };

  const handleDetailClick = (tenant) => {
    setSelectedTenant(tenant);
    setIsDetailModalOpen(true);
  };

  const handleFloorClick = async (floorId) => {
    try {
      const response = await api.get(`tenant/floor/${floorId}`);
      setFloorDetails(response.data[0]); 
      setIsFloorModalOpen(true);
    } catch (err) {
      setError('Failed to fetch floor details.');
    }
  };

  const handleUnitClick = async (unitId) => {
    try {
      const response = await api.get(`tenant/unit/${unitId}`);
      setUnitDetails(response.data[0]); 
      setIsUnitModalOpen(true);
    } catch (err) {
      setError('Failed to fetch unit details.');
    }
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
      label: "Payment Status",
      key: "paymentStatus",
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
            onClick={() => handleDetailClick(row)}
            className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Detail
          </button>
          <button
            onClick={() => handleFloorClick(row.floorId)}
            className="bg-blue-500 text-white py-1 px-2 rounded"
          >
            Floor
          </button>
          <button
            onClick={() => handleUnitClick(row.unitId)}
            className="bg-green-500 text-white py-1 px-2 rounded"
          >
            Units
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Error message if fetching failed */}
      {error && <div className="bg-red-300 p-3 mb-4 text-red-800">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div className="text-center p-4"><LoadingComponent/></div>
      ) : (
        <TableComponent
          title="Tenant List"
          data={tenants}
          columns={columns}
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedTenant && (
        <div
          isOpen={isDetailModalOpen}
          onRequestClose={() => setIsDetailModalOpen(false)}
          contentLabel="Tenant Details"
          className="fixed inset-0   flex justify-center items-center mt-12"
        >
          <div className="bg-base-300 p-6 rounded-lg min-w-[72vh] max-h-[90vh] overflow-y-auto mt-10 ml-6">
            <h2 className="text-xl mb-4">Tenant Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <p className="text-sm">{selectedTenant.fullName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <p className="text-sm">{selectedTenant.phoneNumber}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">National ID</label>
              <p className="text-sm">{selectedTenant.nationalId}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lease Start Date</label>
              <p className="text-sm">{selectedTenant.leaseStartDate ? new Date(selectedTenant.leaseStartDate).toISOString().split('T')[0]: 'N/A'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lease End Date</label>
              <p className="text-sm">{selectedTenant.leaseEndDate ? new Date(selectedTenant.leaseEndDate).toISOString().split('T')[0]: 'N/A'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Status</label>
              <p className="text-sm">{selectedTenant.paymentStatus}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Advance</label>
              <p className="text-sm">{selectedTenant.advance || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Car Plate</label>
              <p className="text-sm">{selectedTenant.carPlate}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Unit Number</label>
              <p className="text-sm">{selectedTenant.Unit ? selectedTenant.Unit.unitNumber : 'N/A'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Floor Number</label>
              <p className="text-sm">{selectedTenant.Floor ? selectedTenant.Floor.floorNumber : 'N/A'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <p className="text-sm">{selectedTenant.status}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Document</label>
            {selectedTenant.document && (
              <div className="mb-4">
                <p>
                  <strong>Document:</strong>
                </p>
                {(() => {
                  const baseUrl = `${process.env.REACT_APP_BASE}`;

                  // Case 1: If document is a File object (after upload, before refresh)
                  if (selectedTenant.document instanceof File) {
                    const fileName = selectedTenant.document.name.toLowerCase();
                    if (
                      fileName.endsWith(".jpg") ||
                      fileName.endsWith(".jpeg") ||
                      fileName.endsWith(".png")
                    ) {
                      return (
                        <div>
                          <img
                            src={URL.createObjectURL(selectedTenant.document)}
                            alt="Tenant Document Preview"
                            className="w-full h-auto max-h-64 object-contain"
                            onError={(e) =>
                              (e.target.src = "/path/to/fallback-image.jpg")
                            }
                          />
                          <p className="text-sm text-gray-500">
                            Preview (refresh to view uploaded file)
                          </p>
                        </div>
                      );
                    } else {
                      return <p>{fileName} (Uploaded, refresh to view)</p>;
                    }
                  }

                  // Case 2: If document is a string (URL from server)
                  const fullDocumentUrl = `${baseUrl}${
                    selectedTenant.document.startsWith("/") ? "" : "/"
                  }${selectedTenant.document}`;
                  if (
                    fullDocumentUrl.endsWith(".pdf") ||
                    fullDocumentUrl.endsWith(".doc") ||
                    fullDocumentUrl.endsWith(".docx")
                  ) {
                    return (
                      <a
                        href={fullDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Document
                      </a>
                    );
                  } else if (
                    fullDocumentUrl.endsWith(".jpg") ||
                    fullDocumentUrl.endsWith(".jpeg") ||
                    fullDocumentUrl.endsWith(".png")
                  ) {
                    return (
                      <div>
                        <img
                          src={fullDocumentUrl}
                          alt="Tenant Document"
                          className="w-full h-auto max-h-64 object-contain"
                          onError={(e) =>
                            (e.target.src = "/path/to/fallback-image.jpg")
                          }
                        />
                      </div>
                    );
                  } else {
                    return (
                      <a
                        href={fullDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Document
                      </a>
                    );
                  }
                })()}
              </div>
            )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floor Modal */}
      {isFloorModalOpen && floorDetails && (
        <div
          isOpen={isFloorModalOpen}
          onRequestClose={() => setIsFloorModalOpen(false)}
          contentLabel="Floor Details"
          className="fixed inset-0  flex justify-center items-center mt-12"
        >
        <div className="bg-base-100 p-6 rounded-lg min-w-[72vh] max-h-[90vh] overflow-y-auto mt-10 ml-6">
          <h2 className="text-xl mb-4">Floor Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Floor Number</label>
            <p className="text-sm">{floorDetails.Floor ? floorDetails.Floor.floorNumber : 'N/A'}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Number of Units</label>
            <p className="text-sm">{floorDetails.Floor ? floorDetails.Floor.noUnits : 'N/A'}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <p className="text-sm">{floorDetails.Floor ? floorDetails.Floor.status : 'N/A'}</p>
          </div>
            
          <div className="flex justify-end">
            <button
              onClick={() => setIsFloorModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
          </div>
        </div>
      )}

      {/* Unit Modal */}
      {isUnitModalOpen && unitDetails && (
    <div
      isOpen={isUnitModalOpen}
      onRequestClose={() => setIsUnitModalOpen(false)}
      contentLabel="Unit Details"
      className="fixed inset-0 flex justify-center items-center mt-12"
    >
    <div className="bg-base-100 p-6 rounded-lg min-w-[72vh] max-h-[90vh] overflow-y-auto mt-10 ml-6">
      <h2 className="text-xl mb-4">Unit Details</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Unit Number</label>
        <p className="text-sm">{unitDetails.Unit ? unitDetails.Unit.unitNumber : 'N/A'}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Size</label>
        <p className="text-sm">{unitDetails.Unit.size} sq ft</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Status</label>
        <p className="text-sm">{unitDetails.Unit.status}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Available Equipments</label>
        <p className="text-sm">
          {unitDetails.Unit.availableEquipments 
            ? JSON.parse(unitDetails.Unit.availableEquipments).join(', ') 
            : 'N/A'}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Problems</label>
        <p className="text-sm">
          {unitDetails.Unit.problems 
            ? JSON.parse(unitDetails.Unit.problems).join(', ') 
            : 'N/A'}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rented Date</label>
        <p className="text-sm">
          {unitDetails.Unit.rentedDate 
            ? new Date(unitDetails.Unit.rentedDate).toISOString().split('T')[0] 
            : 'N/A'}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Vacated Date</label>
        <p className="text-sm">
          {unitDetails.Unit.vacatedDate 
            ? new Date(unitDetails.Unit.vacatedDate).toISOString().split('T')[0]
            : 'N/A'}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsUnitModalOpen(false)}
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

export default TenantFilterList;