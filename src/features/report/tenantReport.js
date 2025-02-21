import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const TenantReport = () => {
  const [units, setUnits] = useState([]);
  const [floors, setFloors] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const columns = [
    { key: 'tenantName', label: 'Tenant Name', render: (data) => data.Tenant?.fullName },
    { key: 'unitNumber', label: 'Unit Number', render: (data) => data.Tenant?.Unit.unitNumber },
    { key: 'floorNumber', label: 'Floor Number', render: (data) => data.Tenant?.Floor.floorNumber },
    { key: 'paymentStatus', label: 'Payment Status', render: (data) => data.paymentStatus },
    { key: 'leaseStartDate', label: 'Lease Start Date', render: (data) => new Date(data.leaseStartDate).toLocaleDateString() },
    { key: 'leaseEndDate', label: 'Lease End Date', render: (data) => new Date(data.leaseEndDate).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (data) => data.status }
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Tenant Report</h2>

        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
  {/* Payment Status */}
  <div>
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
  </div>

  {/* Lease Start Date From */}
  <div>
    <label htmlFor="leaseStartDateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lease Start Date From</label>
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
    <label htmlFor="leaseStartDateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lease Start Date To</label>
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
    <label htmlFor="leaseEndDateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lease End Date From</label>
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
    <label htmlFor="leaseEndDateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lease End Date To</label>
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
    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
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
    <label htmlFor="unitId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
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
    <label htmlFor="floorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Floor</label>
    <select
      id="floorId"
      className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
      value={filterParams.floorId}
      onChange={(e) => setFilterParams({ ...filterParams, floorId: e.target.value })}
    >
      <option value="">Select Floor</option>
      {floors.map((floor) => (
        <option key={floor.id} value={floor.id}>{floor.name}</option>
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

      <TableComponent
        title="Filtered Tenant Report"
        data={filteredData}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

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