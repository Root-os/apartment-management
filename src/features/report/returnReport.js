import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import SmartDateInput from '../../components/Common/smartDatePicker';
import { isDate } from 'date-fns';

const ReturnReport = () => {
  const [returnData, setReturnData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [filterParams, setFilterParams] = useState({
    vendorId: '',
    itemId: '',
    startDate: '',
    endDate: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch vendors
    axios
      .get(`${process.env.REACT_APP_BASE_URL}vendors`)
      .then((response) => {
        setVendors(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the vendors:', error);
      });

    // Fetch items
    axios
      .get(`${process.env.REACT_APP_BASE_URL}items`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the items:', error);
      })
      .finally (()=>{setLoading(false);})
  }, []);

  // Handle filter submit
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}returns/report`, filterParams);

      // Ensure the response is an array, otherwise set it to an empty array
      const data = Array.isArray(response.data) ? response.data : [];
      setReturnData(data);
    } catch (error) {
      const message = error.response?.status === 404
        ? 'No return data found with the given filters.'
        : 'Error filtering data. Please try again.';
      setModalMessage(message);
      // setIsModalOpen(true);
      // console.error('Error filtering data:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const columns = [
    { key: 'Vendor.fname', label: 'Vendor', render: (row) => `${row.Vendor.fname} ${row.Vendor.lname}` },
    { key: 'Item.itemName', label: 'Item', render: (row) => row.Item.itemName },
    { key: 'quantity', label: 'Quantity' },
    { key: 'reason', label: 'Reason' },
    { key: 'returnDate', label: 'Return Date', isDate},
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Return Report</h2>

        {/* Filter form */}
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
          {/* Vendor ID Dropdown */}
          <div>
            <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor</label>
            <select
              id="vendorId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.vendorId}
              onChange={(e) => setFilterParams({ ...filterParams, vendorId: e.target.value })}
            >
              <option value="">Select Vendor</option>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.fname} {vendor.lname}
                  </option>
                ))
              ) : (
                <option value="">No vendors available</option>
              )}
            </select>
          </div>

          {/* Item ID Dropdown */}
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item</label>
            <select
              id="itemId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.itemId}
              onChange={(e) => setFilterParams({ ...filterParams, itemId: e.target.value })}
            >
              <option value="">Select Item</option>
              {items.length > 0 ? (
                items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.itemName}
                  </option>
                ))
              ) : (
                <option value="">No items available</option>
              )}
            </select>
          </div>

          {/* Start Date Picker */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <SmartDateInput
              id="startDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.startDate}
              onChange={(date) => setFilterParams({ ...filterParams, startDate: date})}
            />
          </div>

          {/* End Date Picker */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <SmartDateInput
              id="endDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.endDate}
              onChange={(date) => setFilterParams({ ...filterParams, endDate: date })}
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
      {/* Table for displaying return report */}
      {loading ? (<LoadingComponent/>): returnData.length > 0 ? (
      <TableComponent
        title="Filtered Return Report"
        data={returnData || []}  // Ensure the data is always an array
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />
      ): (<div>
         <p>No data available for the selected filters.</p>
        <TableComponent
        title="Filtered Return Report"
        data={returnData || []}  // Ensure the data is always an array
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      /> 
      </div>)}
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

export default ReturnReport;