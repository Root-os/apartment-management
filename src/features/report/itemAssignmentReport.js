import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import SmartDateInput from '../../components/Common/smartDatePicker';
import { isDate } from 'date-fns';

const ItemAssignmentReport = () => {
  const [itemAssignments, setItemAssignments] = useState([]); // Store item assignments data
  const [items, setItems] = useState([]); // Store items fetched from API
  const [filterParams, setFilterParams] = useState({
    assignType: '', 
    assignDate: '', 
    itemId: '', 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch items data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Fetch item assignments data based on filters
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clean up filterParams to remove empty values and match API expectations
    const cleanedParams = {};
    if (filterParams.assignType) cleanedParams.assignType = filterParams.assignType;
    if (filterParams.assignDate) cleanedParams.assignDate = filterParams.assignDate;
    if (filterParams.itemId) cleanedParams.itemId = Number(filterParams.itemId); // Convert to number if required by API

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}item-assignments/report`,
        cleanedParams
      );
      console.log('API response:', response.data);

      // Extract the data array from the response (response.data.data)
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      // Map the data to match table column keys
      const mappedData = data.map((assignment) => ({
        ...assignment,
        itemName: assignment.item?.itemName || 'N/A',
        assignedTo: `${assignment.assignto?.fname || ''} ${assignment.assignto?.lname || ''}`.trim() || 'N/A',
      }));
      setItemAssignments(mappedData);
    } catch (error) {
      const message =
        error.response?.status === 404
          ? 'No item assignments found with the given filters.'
          : 'Error filtering data. Please try again.';
      setModalMessage(message);
      setIsModalOpen(true);
      console.error('Error filtering data:', error);
      setItemAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

      const handleResetFilters = () => {
    setFilterParams({
    assignType: '', 
    assignDate: '', 
    itemId: '', 
    });
  };
  // Define columns for the table
  const columns = [
    { key: 'itemName', label: 'Item Name' },
    { key: 'assignedTo', label: 'Assigned To' },
    {
      key: 'assignDate',
      label: 'Assignment Date',
      isDate: true,
    },
    { key: 'assignType', label: 'Assignment Type' },
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Item Assignment Report</h2>

        {/* Filter Form */}
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
          {/* Assign Type */}
          {/* <div>
            <label htmlFor="assignType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assignment Type
            </label>
            <select
              id="assignType"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.assignType}
              onChange={(e) => setFilterParams({ ...filterParams, assignType: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="user">User</option>
              <option value="unit">Unit</option>
            </select>
          </div> */}

          {/* Assign Date */}
          <div>
            <label htmlFor="assignDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assign Date
            </label>
            <SmartDateInput
              id="assignDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.assignDate}
              onChange={(date) => setFilterParams({ ...filterParams, assignDate: date})}
            />
          </div>

          {/* Item ID (Dynamic dropdown populated from API) */}
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Item Name
            </label>
            <select
              id="itemId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.itemId}
              onChange={(e) => setFilterParams({ ...filterParams, itemId: e.target.value })}
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </div>

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
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Filter Data'}
            </button>
          </div>
        </form>
      </div>

      {/* Table for displaying item assignments report */}
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <TableComponent
            title="Filtered Item Assignment Report"
            data={itemAssignments}
            columns={columns}
           rowsPerPageOptions={[5, 10, 15]}

            showSearch={true}
            exportable={true}
          />
          {itemAssignments.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No data is available for the selected filter.
            </div>
          )}
        </>
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

export default ItemAssignmentReport;