import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import SmartDateInput from '../../components/Common/smartDatePicker';
// import { isDate } from 'date-fns';

const GovtBillReport = () => {
  const [billPayments, setBillPayments] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

    // Reset filter fields to initial state
  const handleResetFilters = () => {
    setFilterParams({
      startDate: '',
      endDate: '',
      billTypeId: '',
     
    });
  };


const columns = [
  {
    key: 'BillType',
    label: 'Bill Type',
    render: (row) => row.BillType?.typeName || 'N/A'
  },
  { key: 'amount', label: 'Amount' },
  { key: 'startDate', label: 'Start Date', isDate: true },
  { key: 'endDate', label: 'End Date', isDate: true },
  { key: 'status', label: 'Status' },
  { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'description', label: 'Description' }
];


  return (
    <div className="p-8">
      <div className="container mx-auto p-4">

        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <SmartDateInput
              id="startDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.startDate}
              onChange={(date) => setFilterParams({ ...filterParams, startDate: date})}
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <SmartDateInput
              id="endDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.endDate}
              onChange={(date) => setFilterParams({ ...filterParams, endDate: date })}
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
          {/* <div>
            <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Created Time</label>
            <input
              type="date"
              id="createdAt"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.createdAt}
              onChange={(e) => setFilterParams({ ...filterParams, createdAt: e.target.value })}
            />
          </div> */}

          {/* Submit Button */}
          <div className="col-span-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300"
            >
              {isLoading ? 'Processing...' : 'Filter Data'}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
       <LoadingComponent />
        ) : (
          <div>
            <TableComponent
              title="Bill Report"
              data={filteredData}
              columns={columns}
             rowsPerPageOptions={[5, 10, 15]}

              showSearch={true}
              exportable={true}
            />
            {filteredData.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No data available for the selected filters.</p>
            )}
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

export default GovtBillReport;