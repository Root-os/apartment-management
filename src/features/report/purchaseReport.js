import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const PurchaseReport = () => {
  const [itemTypes, setItemTypes] = useState([]);
  const [vendors, setVendors] = useState([]); // Store vendor list
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [filterParams, setFilterParams] = useState({
    startDate: '',
    endDate: '',
    itemTypeId: '',
    vendorId: '', // Add vendorId to filter params
  });

  useEffect(() => {
    // Fetch item types
    const fetchItemTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}item-types`);
        setItemTypes(response.data);
      } catch (error) {
        console.error('Error fetching item types:', error);
      }
    };

    // Fetch vendors
    const fetchVendors = async () => {
      try {
        const response = await axios.get('https://apartment.bruktiethiotour.com/api/vendors');
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchItemTypes();
    fetchVendors();
  }, []);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}purchases/purchaseReport`, filterParams);
      setFilteredData(response.data);
    } catch (error) {
      const message = error.response?.status === 404
        ? 'No purchase records found with the given filters.'
        : 'Error filtering data. Please try again.';
      setModalMessage(message);
      setIsModalOpen(true);
      console.error('Error filtering data:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const columns = [
    {
      key: 'vendorName',
      label: 'Vendor Name',
      render: (data) => {
        const vendor = data.Vendors;
        return vendor ? `${vendor.fname} ${vendor.lname}` : 'Unknown Vendor'; 
      },
    },
    {
      key: 'vendorPhone',
      label: 'Vendor Phone',
      render: (data) => {
        const vendor = data.Vendor;
        return vendor ? vendor.phone : 'N/A'; 
      },
    },
    { key: 'itemName', label: 'Item Name', render: (data) => data.Item.itemName },
    { key: 'amount', label: 'Amount' },
    { key: 'price', label: 'Price' },
    { key: 'totalPrice', label: 'Total Price' },
    { key: 'date', label: 'Purchase Date', render: (data) => new Date(data.date).toLocaleDateString() },
    { key: 'expirationDate', label: 'Expiration Date', render: (data) => new Date(data.expirationDate).toLocaleDateString() },
    { key: 'description', label: 'Description' },
  ];
  

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Purchase Report</h2>

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

          {/* Item Type */}
          <div>
            <label htmlFor="itemTypeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Type</label>
            <select
              id="itemTypeId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.itemTypeId}
              onChange={(e) => setFilterParams({ ...filterParams, itemTypeId: e.target.value })}
            >
              <option value="">Select Item Type</option>
              {itemTypes.map((itemType) => (
                <option key={itemType.id} value={itemType.id}>{itemType.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Vendor Filter */}
          <div>
            <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor</label>
            <select
              id="vendorId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.vendorId}
              onChange={(e) => setFilterParams({ ...filterParams, vendorId: e.target.value })}
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.fname} {vendor.lname}
                </option>
              ))}
            </select>
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
        title="Filtered Purchase Report"
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

export default PurchaseReport;
