import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import SmartDateInput from '../../components/Common/smartDatePicker';

const ExpenseReport = () => {
  const [expenseData, setExpenseData] = useState([]); // Unused here, but kept for consistency
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Initially empty
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true); // For initial fetch of expense types

  const [filterParams, setFilterParams] = useState({
    expenseTypeId: "",
    startDate: "",
    endDate: ""
  });

  // Fetch Expense Types only
  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}expense-type`);
        setExpenseTypes(response.data);
      } catch (error) {
        console.error("Error fetching expense types:", error);
      } finally {
        setLoading(false); // Stop loading after expense types are fetched
      }
    };

    fetchExpenseTypes();
  }, []);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}expense/filter`, filterParams);
      setFilteredData(response.data); // Update table data with filtered results
    } catch (error) {
      const message = error.response?.status === 404
        ? "No expenses found with the given filters"
        : "Error filtering data. Please try again.";
      setModalMessage(message);
      setIsModalOpen(true);
      console.error("Error filtering data:", error);
      setFilteredData([]); // Reset to empty on error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const columns = [
    { key: 'expenseType.name', label: 'Expense Type', render: (expense) => expense.expenseType.name },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date', isDate: true },
    { key: 'description', label: 'Description' },
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
              onChange={(date) => setFilterParams({ ...filterParams, startDate: date })}
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

          {/* Expense Type */}
          <div>
            <label htmlFor="expenseTypeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expense Type</label>
            <select
              id="expenseTypeId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.expenseTypeId}
              onChange={(e) => setFilterParams({ ...filterParams, expenseTypeId: e.target.value })}
            >
              <option value="">Select Expense Type</option>
              {expenseTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-4 flex justify-end">
            <button
              type="submit"
              className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Filter Data"}
            </button>
          </div>
        </form>
      </div>

      {/* Show loading component while fetching expense types */}
      {loading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="Expense Report"
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

export default ExpenseReport;