import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TableComponent from '../../components/table';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editData, setEditData] = useState({
    fullName: '',
    phoneNumber: '',
    nationalId: '',
    leaseStartDate: '',
    leaseEndDate: '',
    paymentStatus: '',
    advance: '',
    carPlate: '',
    unitNumber: '',
    floorNumber: '',
    status: '',
    document: '',
  });

  // Fetch tenant data from the API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/tenant');
        setTenants(response.data);
        console.log('Fetched tenants:', response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tenant data.');
        setLoading(false);
      }
    };

    const fetchUnits = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/unit');
        setUnits(response.data);
      } catch (err) {
        setError('Failed to fetch units.');
      }
    };

    const fetchFloors = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/floor');
        setFloors(response.data);
      } catch (err) {
        setError('Failed to fetch floors.');
      }
    };

    fetchTenants();
    fetchUnits();
    fetchFloors();
  }, []);

  const getDocumentUrl = (document) => {
    return `https://apartment.houseethiopia.com${document}`;
  };

  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };

  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);
    setEditData({
      fullName: tenant.fullName,
      phoneNumber: tenant.phoneNumber,
      nationalId: tenant.nationalId,
      leaseStartDate: tenant.leaseStartDate,
      leaseEndDate: tenant.leaseEndDate,
      paymentStatus: tenant.paymentStatus,
      advance: tenant.advance,
      carPlate: tenant.carPlate,
      unitNumber: tenant.Unit ? tenant.Unit.unitNumber : '',
      floorNumber: tenant.Floor ? tenant.Floor.name : '',
      status: tenant.status,
      document: tenant.document,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(editData).forEach((key) => {
        formData.append(key, editData[key]);
      });

      await axios.put(`https://apartment.houseethiopia.com/api/tenant/${selectedTenant.id}`, formData, {
        labels: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTenants(tenants.map((tenant) => (tenant.id === selectedTenant.id ? { ...tenant, ...editData } : tenant)));
      setIsEditModalOpen(false);
    } catch (err) {
      setError('An error occurred while updating the tenant data.');
    }
  };

  const handleDeleteClick = (tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/tenant/${selectedTenant.id}`);
      setTenants(tenants.filter((tenant) => tenant.id !== selectedTenant.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('An error occurred while deleting the tenant data.');
    }
  };

  const handleFileChange = (e) => {
    setEditData({ ...editData, document: e.target.files[0] });
  };

  const handleDetailClick = (tenant) => {
    setSelectedTenant(tenant);
    setIsDetailModalOpen(true);
  };

  const floorLookup = floors.reduce((acc, floor) => {
    acc[floor.id] = floor.name;
    return acc;
  }, {});
  const unitLookup = units.reduce((acc, unit) => {
    acc[unit.id] = unit.unitNumber;
    return acc;
  }, {});

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
      render: (row ) => (
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
            onClick={() => handleDetailClick(row)}
            className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tenant List</h2>

      {/* Error message if fetching failed */}
      {error && <div className="bg-red-300 p-3 mb-4 text-red-800">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div className="text-center p-4">Loading tenants...</div>
      ) : (
        <TableComponent
  title="Tenant List"
  data={tenants}
  columns={columns}

  rowsPerPageOptions={[5, 10, 15]}
  showSearch={true}
  exportable={true}
/>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedTenant && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          contentLabel="Edit Tenant"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Tenant</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="text"
                value={editData.phoneNumber}
                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">National ID</label>
              <input
                type="text"
                value={editData.nationalId}
                onChange={(e) => setEditData({ ...editData, nationalId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lease Start Date</label>
              <input
                type="date"
                value={editData.leaseStartDate}
                onChange={(e) => setEditData({ ...editData, leaseStartDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lease End Date</label>
              <input
                type="date"
                value={editData.leaseEndDate}
                onChange={(e) => setEditData({ ...editData, leaseEndDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Status</label>
              <input
                type="text"
                value={editData.paymentStatus}
                onChange={(e) => setEditData({ ...editData, paymentStatus: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Advance</label>
              <input
                type="text"
                value={editData.advance}
                onChange={(e) => setEditData({ ...editData, advance: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Car Plate</label>
              <input
                type="text"
                value={editData.carPlate}
                onChange={(e) => setEditData({ ...editData, carPlate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Unit Number</label>
              <select
                value={editData.unitNumber}
                onChange={(e) => setEditData({ ...editData, unitNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.unitNumber}>
                    {unit.unitNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Floor Number</label>
              <select
                value={editData.floorNumber}
                onChange={(e) => setEditData({ ...editData, floorNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.name}>
                    {floor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <input
                type="text"
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Document</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          contentLabel="Delete Confirmation"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Are you sure you want to delete this tenant?</h2>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

       {/* Detail Modal */}
       {isDetailModalOpen && selectedTenant && (
        <Modal
          isOpen={isDetailModalOpen}
          onRequestClose={() => setIsDetailModalOpen(false)}
          contentLabel="Tenant Details"
          className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center mt-12"
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
              <p className="text-sm">{selectedTenant.leaseStartDate ? new Date(selectedTenant.leaseStartDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lease End Date</label>
              <p className="text-sm">{selectedTenant.leaseEndDate ? new Date(selectedTenant.leaseEndDate).toLocaleDateString() : 'N/A'}</p>
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
              {selectedTenant.document ? (
                isImage(selectedTenant.document) ? (
                  <img src={getDocumentUrl(selectedTenant.document)} alt="Document" className="w-16 h-16 object-cover" />
                ) : (
                  <a href={getDocumentUrl(selectedTenant.document)} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    View Document
                  </a>
                )
              ) : (
                'N/A'
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
        </Modal>
      )}
    </div>
  );
};

export default TenantList;