import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const GovtBillReport = () => {
  const [billPayments, setBillPayments] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [filterParams, setFilterParams] = useState({
    startDate: '',
    endDate: '',
    billTypeId: '',
    createdAt: ''
  });

  useEffect(() => {
    const fetchBillTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-type`);
        setBillTypes(response.data);
      } catch (error) {
        console.error('Error fetching bill types:', error);
      }
    };

    fetchBillTypes();
  }, []);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}bill-payments/bill-report`, filterParams);
      setFilteredData(response.data);
    } catch (error) {
      const message = error.response?.status === 404
        ? 'No bill payments found with the given filters'
        : 'Error filtering data. Please try again.';
      setModalMessage(message);
      setIsModalOpen(true);
      console.error('Error filtering data:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const columns = [
    { key: 'billType', label: 'Bill Type', render: (data) => data.BillPaymentType?.typeName },
    { key: 'amount', label: 'Amount' },
    { key: 'startDate', label: 'Start Date', render: (data) => new Date(data.startDate).toLocaleDateString() },
    { key: 'endDate', label: 'End Date', render: (data) => new Date(data.endDate).toLocaleDateString() },
    { key: 'status', label: 'Status' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'description', label: 'Description' }
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Government Bill Report</h2>

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

          {/* Bill Type */}
          <div>
            <label htmlFor="billTypeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bill Type</label>
            <select
              id="billTypeId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.billTypeId}
              onChange={(e) => setFilterParams({ ...filterParams, billTypeId: e.target.value })}
            >
              <option value="">Select Bill Type</option>
              {billTypes.map((billType) => (
                <option key={billType.id} value={billType.id}>{billType.typeName}</option>
              ))}
            </select>
          </div>

          {/* Created At */}
          <div>
            <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Created Time</label>
            <input
              type="date"
              id="createdAt"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.createdAt}
              onChange={(e) => setFilterParams({ ...filterParams, createdAt: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-4 flex justify-end">
            <button
              type="submit"
              className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300"
            >
              {isLoading ? 'Processing...' : 'Filter Data'}
            </button>
          </div>
        </form>
      </div>

      <TableComponent
        title="Filtered Bill Report"
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

export default GovtBillReport;