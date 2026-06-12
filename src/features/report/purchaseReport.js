import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import SmartDateInput from '../../components/Common/smartDatePicker';
import { is } from 'date-fns/locale';
import { isDate } from 'date-fns';

const PurchaseReport = () => {
  const [itemCategorys, setItemTypes] = useState([]);
  const [vendors, setVendors] = useState([]); // Store vendor list
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [filterParams, setFilterParams] = useState({
    startDate: '',
    endDate: '',
    itemCategoryId: '',
    vendorId: '',
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
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}vendors`);
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

  const handleResetFilters = () => {
    setFilterParams({
    startDate: '',
    endDate: '',
    itemCategoryId: '',
    vendorId: '',
    });
  };

  const columns = [
    {
      key: 'vendorName',
      label: 'Vendor Name',
      render: (data) => {
        const vendor = data.Vendor;
        return vendor ? `${vendor.fname} ${vendor.lname}` : 'Unknown Vendor'; 
      },
    },
    // {
    //   key: 'vendorPhone',
    //   label: 'Vendor Phone',
    //   render: (data) => {
    //     const vendor = data.Vendor;
    //     return vendor ? vendor.phone : 'N/A'; 
    //   },
    // },
    {
      key: 'categoryName',
      label: 'Item Category',
      render: (data) => data.Item?.ItemCategory?.categoryName || 'N/A',
    },
    { key: 'itemName', label: 'Item Name', render: (data) => data.Item.itemName },
    { key: 'amount', label: 'Amount' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'totalPrice', label: 'Total Price' },
    { key: 'date', label: 'Purchase Date', isDate: true },
    { key: 'expirationDate', label: 'Expiration Date', isDate: true},
  ];
  

  return (
    <>
      <div className="container mx-auto p-4">

        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-white-600 dark:text-gray-300">Start Date</label>
            <SmartDateInput
              id="startDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.startDate}
              onChange={(date) => setFilterParams({ ...filterParams, startDate: date })}
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-white-600 dark:text-gray-300">End Date</label>
            <SmartDateInput
              id="endDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.endDate}
              onChange={(date) => setFilterParams({ ...filterParams, endDate: date })}
            />
          </div>

          {/* Item Type */}
          <div>
            <label htmlFor="itemCategoryId" className="block text-sm font-medium text-white-600 dark:text-gray-300">Item Type</label>
            <select
              id="itemCategoryId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.itemCategoryId}
              onChange={(e) => setFilterParams({ ...filterParams, itemCategoryId: e.target.value })}
            >
              <option value="">Select Item Type</option>
              {itemCategorys.map((itemCategory) => (
                <option key={itemCategory.id} value={itemCategory.id}>{itemCategory.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Vendor Filter */}
          <div>
            <label htmlFor="vendorId" className="block text-sm font-medium text-white-600 dark:text-gray-300">Vendor</label>
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

      <TableComponent
        title="Purchase Report"
        data={filteredData}
        columns={columns}
       rowsPerPageOptions={[5, 10, 15]}

        showSearch={true}
        exportable={true}
        exportConfig={[
    {
      label: "Vendor Name",
      getValue: (r) =>
        r?.Vendor
          ? `${r.Vendor.fname} ${r.Vendor.lname}`
          : "N/A",
    },
    {
      label: "Vendor Phone",
      getValue: (r) => r?.Vendor?.phone ?? "N/A",
    },
    // {
    //   label: "Item Category",
    //   getValue: (r) => r?.Item?.ItemCategory?.categoryName ?? "N/A",
    // },
    {
      label: "Item Name",
      getValue: (r) => r?.Item?.itemName ?? "N/A",
    },
    {
      label: "Amount",
      getValue: (r) => r?.amount ?? 0,
    },
    {
      label: "Price",
      getValue: (r) => r?.price ?? 0,
    },
    {
      label: "Total Price",
      getValue: (r) => r?.totalPrice ?? 0,
    },
    {
      label: "Purchase Date",
      getValue: (r) =>
        r?.date ? new Date(r.date).toLocaleDateString() : "N/A",
    },
    // {
    //   label: "Expiration Date",
    //   getValue: (r) =>
    //     r?.expirationDate
    //       ? new Date(r.expirationDate).toLocaleDateString()
    //       : "N/A",
    // },
    // {
    //   label: "Description",
    //   getValue: (r) => r?.description ?? "",
    // },
  ]}
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
    </>
  );
};

export default PurchaseReport;
