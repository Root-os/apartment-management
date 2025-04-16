import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [floors, setFloors] = useState([]);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [unitDetails, setUnitDetails] = useState(null); 
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);


  const [editData, setEditData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    nationalId: '',
    leaseStartDate: '',
    leaseEndDate: '',
    paymentStatus: '',
    additionalNotes: '',
    unitId: '',
    floorId: '',
    advance: '',
    tin: '',
    document: '',
    status: '',
    description: '',
    carName: '',  // Added for carName
    carPlate: '', // Added for carPlate
    color: '',    // Added for color
  });

  // Loading and Saving States
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, messageType: '', message: '' });

  // Fetch tenant data, units, and floors from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`);
        setTenants(tenantResponse.data);
  
        const floorResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}floor`);
        setFloors(floorResponse.data);
        
        setIsPageLoading(false);
      } catch (err) {
        setError('Failed to fetch data.');
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchFreeUnits = async (floorId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor/${floorId}`);
      console.log('Fetched freeUnits:', response.data);
      setUnits(Array.isArray(response.data.freeUnits) ? response.data.freeUnits : []);
    } catch (err) {
      setError('Failed to fetch freeUnits.');
    }
  };
  
  // Handle file change for document upload
  const handleFileChange = (e) => {
    setEditData({ ...editData, document: e.target.files[0] });
  };

  // Edit modal: Set initial values when edit button is clicked
  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);
    setEditData({
      fullName: tenant.fullName,
      phoneNumber: tenant.phoneNumber,
      email: tenant.email,
      nationalId: tenant.nationalId,
      leaseStartDate: tenant.leaseStartDate,
      leaseEndDate: tenant.leaseEndDate,
      paymentStatus: tenant.paymentStatus,
      additionalNotes: tenant.additionalNotes,
      unitId: tenant.unitId,
      floorId: tenant.floorId,
      advance: tenant.advance,
      tin: tenant.tin,
      document: tenant.document,
      status: tenant.status,
      description: tenant.description,
      carName: tenant.carName || null,  // Populate carName if available
      carPlate: tenant.carPlate || null, // Populate carPlate if available
      color: tenant.color || null,    // Populate color if available
    });
    fetchFreeUnits(tenant.floorId);
    setIsEditModalOpen(true);
  };

  // Delete modal: Set selected tenant for deletion
  const handleDeleteClick = (tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteModalOpen(true);
  };

  const handleUnitClick = async (unitId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant/unit/${unitId}`);
      setUnitDetails(response.data[0]); 
      setIsUnitModalOpen(true);
    } catch (err) {
      setError('Failed to fetch unit details.');
    }
  };

  // Submit edited data to the API
  const handleEditSubmit = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      Object.keys(editData).forEach((key) => {
        formData.append(key, editData[key]);
      });

      await axios.put(`${process.env.REACT_APP_BASE_URL}tenant/${selectedTenant.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update tenant list with new data
      setTenants(tenants.map((tenant) => (tenant.id === selectedTenant.id ? { ...tenant, ...editData } : tenant)));
      setIsEditModalOpen(false);
      setModal({
        isOpen: true,
        messageType: 'success',
        message: 'Tenant updated successfully.',
      });
    } catch (err) {
      setModal({
        isOpen: true,
        messageType: 'error',
        message: 'An error occurred while updating the tenant data.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Submit delete request to the API
  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}tenant/${selectedTenant.id}`);
      setTenants(tenants.filter((tenant) => tenant.id !== selectedTenant.id));
      setIsDeleteModalOpen(false);
      setModal({
        isOpen: true,
        messageType: 'success',
        message: 'Tenant deleted successfully.',
      });
    } catch (err) {
      setModal({
        isOpen: true,
        messageType: 'error',
        message: 'Failed to delete tenant.',
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setModal({ isOpen: false, messageType: '', message: '' });
  };

  // Live validation for additional notes (min length 10 characters)
//  const validateAdditionalNotes = () => {
//   return editData.additionalNotes && editData.additionalNotes.length >= 10;
// };

  const handleAddClick = () => {
    window.location.href = '/app/tenant-add';
   };
   // Handle opening of the details modal
    const handleDetailsClick = (tenant) => {
      setSelectedTenant(tenant);
      setIsDetailsModalOpen(true);
    };

    // Handle closing of the details modal
    const navigateToRentAdd = () => {
      window.location.href = '/app/rent-collection-add';
    };
   

  return (
    <div>
      {/* Page Loading */}
      {isPageLoading ? (
        <LoadingComponent/>
      ) : (
        <TableComponent
          title="Tenant List"
          data={tenants}
          onAdd={handleAddClick}
          columns={[
            {
              label: "Full Name",
              key: "fullName",
            },
            {
              label: "Phone Number",
              key: "phoneNumber",
            },
            // {
            //   label: "Payment Status",
            //   key: "paymentStatus",
            // },
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
              label: 'Actions',
              key: 'actions',
              render: (row) => (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(row)}
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(row)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDetailsClick(row)}  
                   className="bg-gray-400 text-white py-1 px-2 rounded"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleUnitClick(row.unitId)}
                    className="bg-green-500 text-white py-1 px-2 rounded"
                  >
                    Units
                  </button>
                  <button
                    onClick={() => navigateToRentAdd(row.unitId)}
                    className="bg-indigo-500 text-white py-1 px-2 rounded"
                  >
                    Rent
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-12">
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Tenant</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="text"
                value={editData.phoneNumber}
                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">National ID</label>
              <input
                type="text"
                value={editData.nationalId}
                onChange={(e) => setEditData({ ...editData, nationalId: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lease Start Date</label>
              <input
                type="date"
                value={editData.leaseStartDate}
                onChange={(e) => setEditData({ ...editData, leaseStartDate: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lease End Date</label>
              <input
                type="date"
                value={editData.leaseEndDate}
                onChange={(e) => setEditData({ ...editData, leaseEndDate: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Status</label>
              <select
                value={editData.paymentStatus}
                onChange={(e) => setEditData({ ...editData, paymentStatus: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded">
                <option value="paid">Paid</option>
                <option value="due">Due</option>
                <option value="overDue">Over Due</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <input
                type="text"
                value={editData.additionalNotes}
                onChange={(e) => setEditData({ ...editData, additionalNotes: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
              {editData.additionalNotes && editData.additionalNotes.length < 10 && (
                <div className="text-red-500 text-xs mt-2">Notes must be at least 10 characters long.</div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Unit</label>
              <select
                value={editData.unitId}
                onChange={(e) => setEditData({ ...editData, unitId: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unitNumber}
                  </option>
                ))}
              </select>

            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Floor</label>
              <select
                value={editData.floorId}
                onChange={(e) => {
                  setEditData({ ...editData, floorId: e.target.value });
                  fetchFreeUnits(e.target.value); // Fetch units when floor changes
                }}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floorNumber}
                  </option>
                ))}
              </select>

            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
               value={editData.status}
               onChange={(e) => setEditData({ ...editData, status: e.target.value })}
               className="bg-base-100 w-full p-2 border border-gray-300 rounded"
               >
               <option value="active">Active</option>
               <option value="Inactive">In active</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">TIN</label>
              <input
                type="text"
                value={editData.tin}
                onChange={(e) => setEditData({ ...editData, tin: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Document</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div> */}
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Car Name</label>
              <input
                type="text"
                value={editData.carName}
                onChange={(e) => setEditData({ ...editData, carName: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div> */}
          
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={ isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Delete Tenant</h2>
            <p>Are you sure you want to delete this tenant?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
       {/* Tenant Details Modal */}
       {isDetailsModalOpen && selectedTenant && (
  <div
    isOpen={isDetailsModalOpen}
    onRequestClose={() => setIsDetailsModalOpen(false)}
    contentLabel="Tenant Details"
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-12"
  >
    <div className="bg-base-100 p-6 rounded-lg min-w-[72vh] max-h-[90vh] overflow-y-auto mt-10 ml-6">
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
        <label className="block text-sm font-medium mb-2">Email </label>
        <p className="text-sm">{selectedTenant.email}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">National ID</label>
        <p className="text-sm">{selectedTenant.nationalId}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Lease Start Date</label>
        <p className="text-sm">{selectedTenant.leaseStartDate ? new Date(selectedTenant.leaseStartDate).toISOString().split('T')[0] : 'N/A'}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Lease End Date</label>
        <p className="text-sm">
          {selectedTenant.leaseEndDate
            ? new Date(selectedTenant.leaseEndDate).toISOString().split('T')[0]
            : 'N/A'}
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Payment Status</label>
        <p className="text-sm">{selectedTenant.paymentStatus}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Advance</label>
        <p className="text-sm">{selectedTenant.advance || 'N/A'}</p>
      </div>

      {/* Car details section */}
      {selectedTenant.TenantVehicles && selectedTenant.TenantVehicles.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Car Details</label>
          <div className="text-sm">
            {selectedTenant.TenantVehicles.map((vehicle, index) => (
              <div key={index} className="mb-2">
                <p><strong>Car Name:</strong> {vehicle.carName}</p>
                <p><strong>Car Plate:</strong> {vehicle.carPlate}</p>
                <p><strong>Color:</strong> {vehicle.color}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
      {selectedTenant.document && (
        <div className="mb-4">
          <p><strong>Document:</strong></p>
          {(() => {
            const baseUrl = 'https://apartment.bruktiethiotour.com';

            // Case 1: If document is a File object (after upload, before refresh)
            if (selectedTenant.document instanceof File) {
              const fileName = selectedTenant.document.name.toLowerCase();
              if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')) {
                return (
                  <div>
                    <img
                      src={URL.createObjectURL(selectedTenant.document)}
                      alt="Tenant Document Preview"
                      className="w-full h-auto max-h-64 object-contain"
                      onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
                    />
                    <p className="text-sm text-gray-500">Preview (refresh to view uploaded file)</p>
                  </div>
                );
              } else {
                return <p>{fileName} (Uploaded, refresh to view)</p>;
              }
            }

            // Case 2: If document is a string (URL from server)
            const fullDocumentUrl = `${baseUrl}${selectedTenant.document.startsWith('/') ? '' : '/'}${selectedTenant.document}`;
            if (fullDocumentUrl.endsWith('.pdf') || fullDocumentUrl.endsWith('.doc') || fullDocumentUrl.endsWith('.docx')) {
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
              fullDocumentUrl.endsWith('.jpg') ||
              fullDocumentUrl.endsWith('.jpeg') ||
              fullDocumentUrl.endsWith('.png')
            ) {
              return (
                <div>
                  <img
                    src={fullDocumentUrl}
                    alt="Tenant Document"
                    className="w-full h-auto max-h-64 object-contain"
                    onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
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
      <div className="flex justify-end">
        <button
          onClick={() => setIsDetailsModalOpen(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


{isUnitModalOpen && unitDetails && (
    <div
      isOpen={isUnitModalOpen}
      onRequestClose={() => setIsUnitModalOpen(false)}
      contentLabel="Unit Details"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-12"
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
      {/* Modal for success/error messages */}
      <Modal 
        isOpen={modal.isOpen}
        onClose={closeModal}
        messageType={modal.messageType}
        message={modal.message}
      />
    </div>
  );
};

export default TenantList;
