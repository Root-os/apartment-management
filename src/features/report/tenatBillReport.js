import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const TenantBillReport = () => {
  const [tenantPayments, setTenantPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filterParams, setFilterParams] = useState({
    startDate: "",
    endDate: "",
    billPaymentTypeId: "",
    tenantId: ""
  });

  // Fetch Tenants and Bill Types
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`);
        setTenants(response.data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }finally {setLoading(false);}
    };

    const fetchBillTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-type`);
        setBillTypes(response.data);
      } catch (error) {
        console.error("Error fetching bill types:", error);
      }
    };

    fetchTenants();
    fetchBillTypes();
  }, []);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}tenant-payments/reports`, filterParams);
      setFilteredData(response.data);
    } catch (error) {
      const message = error.response?.status === 404
        ? "No payments found with the given filters"
        : "Error filtering data. Please try again.";
      setModalMessage(message);
      setIsModalOpen(true);
      console.error("Error filtering data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const columns = [
    { key: 'tenantName', label: 'Tenant Name', render: (payment) => payment.Tenant.fullName },
    { key: 'paymentType', label: 'Payment Type Name', render: (payment) => payment.BillPaymentType.typeName },

    { key: 'billTypeName', label: 'Bill Type', render: (payment) => payment.BillPaymentType.typeName },
    { key: 'amount', label: 'Amount' },
    { key: 'startDate', label: 'Start Date', render: (payment) => new Date(payment.startDate).toLocaleDateString() },
    { key: 'endDate', label: 'End Date', render: (payment) => new Date(payment.endDate).toLocaleDateString() },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Tenant Bill Report</h2>

        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <input
              type="date"
              id="startDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.startDate}
              onChange={(e) => setFilterParams({ ...filterParams, startDate: e.target.value })}
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <input
              type="date"
              id="endDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.endDate}
              onChange={(e) => setFilterParams({ ...filterParams, endDate: e.target.value })}
            />
          </div>

          {/* Tenant */}
          <div>
            <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tenant</label>
            <select
              id="tenantId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.tenantId}
              onChange={(e) => setFilterParams({ ...filterParams, tenantId: e.target.value })}
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>{tenant.fullName}</option>
              ))}
            </select>
          </div>

          {/* Bill Type */}
          <div>
            <label htmlFor="billPaymentTypeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bill Type</label>
            <select
              id="billPaymentTypeId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.billPaymentTypeId}
              onChange={(e) => setFilterParams({ ...filterParams, billPaymentTypeId: e.target.value })}
            >
              <option value="">Select Bill Type</option>
              {billTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.typeName}</option>
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
      {loading ? (<LoadingComponent/>):(
      <TableComponent
        title="Filtered Tenant Bill Report"
        data={filteredData}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />
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

export default TenantBillReport;