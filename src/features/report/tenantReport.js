import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const TenantReport = () => {
  const [units, setUnits] = useState([]);
  const [floors, setFloors] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterParams, setFilterParams] = useState({
    paymentStatus: "",
    leaseStartDateFrom: "",
    leaseStartDateTo: "",
    leaseEndDateFrom: "",
    leaseEndDateTo: "",
    status: "",
    unitId: "",
    floorId: ""
  });

  // Fetch units and floors
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}unit`);
        setUnits(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFloors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor`);
        setFloors(response.data);
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };

    fetchUnits();
    fetchFloors();
  }, []);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}tenant/filter`, filterParams);
      setFilteredData(response.data);
    } catch (error) {
      const message = error.response?.status === 404
        ? "No tenants found with the given filters"
        : "Error filtering data. Please try again.";
      setModalMessage(message);
      setIsModalOpen(true);
      console.error("Error filtering data:", error);
      setFilteredData([]); 
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const openDetailsModal = (tenant) => {
    setCurrentTenant(tenant);
    setDetailsModalOpen(true);
  };

  const columns = [
    { key: 'tenantName', label: 'Tenant Name', render: (data) => data.fullName },
    { key: 'unitNumber', label: 'Unit Number', render: (data) => data.Unit?.unitNumber },
    { key: 'floorNumber', label: 'Floor Number', render: (data) => data.Floor?.floorNumber },
    // { key: 'paymentStatus', label: 'Payment Status', render: (data) => data.paymentStatus },
    { key: 'leaseStartDate', label: 'Lease Start Date', render: (data) => data.leaseStartDate ? new Date(data.leaseStartDate).toISOString().split('T')[0] : 'N/A' },
    { key: 'leaseEndDate', label: 'Lease End Date', render: (data) => data.leaseEndDate ? new Date(data.leaseEndDate).toISOString().split('T')[0]: 'N/A' },
    { key: 'status', label: 'Status', render: (data) => data.status },
    {
      key: 'actions',
      label: 'Actions',
      render: (data) => (
        <button
          onClick={() => openDetailsModal(data)}
          className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
        >
          Details
        </button>
      )
    }
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
          {/* Payment Status */}
          {/* <div>
            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Status</label>
            <select
              id="paymentStatus"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.paymentStatus}
              onChange={(e) => setFilterParams({ ...filterParams, paymentStatus: e.target.value })}
            >
              <option value="">Select Payment Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div> */}

          {/* Lease Start Date From */}
          <div>
            <label htmlFor="leaseStartDateFrom" className="block text-sm font-medium text-white-600 dark:text-gray-300">Lease Start Date From</label>
            <input
              type="date"
              id="leaseStartDateFrom"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.leaseStartDateFrom}
              onChange={(e) => setFilterParams({ ...filterParams, leaseStartDateFrom: e.target.value })}
            />
          </div>

          {/* Lease Start Date To */}
          <div>
            <label htmlFor="leaseStartDateTo" className="block text-sm font-medium text-white-600 dark:text-gray-300">Lease Start Date To</label>
            <input
              type="date"
              id="leaseStartDateTo"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.leaseStartDateTo}
              onChange={(e) => setFilterParams({ ...filterParams, leaseStartDateTo: e.target.value })}
            />
          </div>

          {/* Lease End Date From */}
          <div>
            <label htmlFor="leaseEndDateFrom" className="block text-sm font-medium text-white-600 dark:text-gray-300">Lease End Date From</label>
            <input
              type="date"
              id="leaseEndDateFrom"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.leaseEndDateFrom}
              onChange={(e) => setFilterParams({ ...filterParams, leaseEndDateFrom: e.target.value })}
            />
          </div>

          {/* Lease End Date To */}
          <div>
            <label htmlFor="leaseEndDateTo" className="block text-sm font-medium text-white-600 dark:text-gray-300">Lease End Date To</label>
            <input
              type="date"
              id="leaseEndDateTo"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.leaseEndDateTo}
              onChange={(e) => setFilterParams({ ...filterParams, leaseEndDateTo: e.target.value })}
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-white-600 dark:text-gray-300">Status</label>
            <select
              id="status"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.status}
              onChange={(e) => setFilterParams({ ...filterParams, status: e.target.value })}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unitId" className="block text-sm font-medium text-white-600 dark:text-gray-300">Unit</label>
            <select
              id="unitId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.unitId}
              onChange={(e) => setFilterParams({ ...filterParams, unitId: e.target.value })}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.unitNumber}</option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div>
            <label htmlFor="floorId" className="block text-sm font-medium text-white-600 dark:text-gray-300">Floor</label>
            <select
              id="floorId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.floorId}
              onChange={(e) => setFilterParams({ ...filterParams, floorId: e.target.value })}
            >
              <option value="">Select Floor</option>
              {floors.map((floor) => (
                <option key={floor.id} value={floor.id}>{floor.floorNumber}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-4 flex justify-end">
            <button
              type="submit"
              className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300"
            >
              {isLoading ? "Processing..." : "Filter Data"}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : isLoading ? (
        <LoadingComponent />
      ) : filteredData.length > 0 ? (
        <TableComponent
          title="Tenant Report"
          data={filteredData}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
        />
      ) : (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
          <TableComponent
            title="Tenant Report"
            data={[]}
            columns={columns}
            rowsPerPageOptions={[5, 10, 15]}
            showSearch={false}
            exportable={false}
          />
          <p>No data available for the selected filters.</p>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && currentTenant && (
        <div
          isOpen={detailsModalOpen}
          onRequestClose={() => setDetailsModalOpen(false)}
          contentLabel="Tenant Details"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-6 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto mt-12">
            <h2 className="text-xl mb-4">Details for {currentTenant.fullName}</h2>
            <div className="space-y-2">
              <p><strong>Phone Number:</strong> {currentTenant.phoneNumber}</p>
              <p><strong>Email:</strong> {currentTenant.email || 'N/A'}</p>
              <p><strong>National ID:</strong> {currentTenant.nationalId}</p>
              <p><strong>Lease Start Date:</strong> {currentTenant.leaseStartDate ? new Date(currentTenant.leaseStartDate).toISOString().split('T')[0]:'N/A'}</p>
              <p><strong>Lease End Date:</strong> {currentTenant.leaseEndDate ? new Date(currentTenant.leaseEndDate).toISOString().split('T')[0]: 'N/A'}</p>
              <p><strong>Additional Notes:</strong> {currentTenant.additionalNotes}</p>
              <p><strong>Advance:</strong> {currentTenant.advance}</p>
              <p><strong>TIN:</strong> {currentTenant.tin}</p>
              <p><strong>Car Plate:</strong> {currentTenant.TenantVehicles?.[0]?.carPlate}</p>
              <p><strong>Car Name:</strong> {currentTenant.TenantVehicles?.[0]?.carName}</p>
              <p><strong>Status:</strong> {currentTenant.status}</p>
              <p><strong>Unit Number:</strong> {currentTenant.Unit?.unitNumber}</p>
              <p><strong>Floor Number:</strong> {currentTenant.Floor?.floorNumber}</p>
              <p><strong>Document:</strong> <a
                href={`${process.env.REACT_APP_BASE}${currentTenant.document}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 underline"
              >
                View Document
              </a></p>
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={() => setDetailsModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for displaying error message */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="error"
          message={modalMessage}
        />
      )}
    </div>
  );
};

export default TenantReport;