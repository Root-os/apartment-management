import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import DeleteConfirmationModal from '../../components/editDeleteModal';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const PurchasesPage = () => {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [itemCategories, setItemCategories] = useState([]); // To store item categories
  const [vendors, setVendors] = useState([]); // Added vendor state
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // State for detail modal

  // Form state variables
  const [vendorId, setVendorId] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}purchases`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching purchases:', error);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}items`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}item-types`)
      .then((response) => {
        setItemCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching item categories:', error);
      });

    // Fetch vendors
    axios
      .get(`${process.env.REACT_APP_BASE_URL}vendors`)
      .then((response) => {
        setVendors(response.data); // Set vendors from the external API
      })
      .catch((error) => {
        console.error('Error fetching vendors:', error);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  const handleEditClick = (purchase) => {
    setSelectedPurchase(purchase);
    setVendorId(purchase.vendorId); // Set vendorId instead of vendorName
    setAmount(purchase.amount);
    setPrice(purchase.price);
    setDate(purchase.date);
    setDescription(purchase.description);
    setExpirationDate(purchase.expirationDate.split('T')[0]);
    setItemId(purchase.itemId);
    setItemCategoryId(purchase.ItemCategoryId);
    setIsEditModalOpen(true);
  };

  const handleDetailClick = (purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailModalOpen(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      // Calculate total price before sending the request
      const calculatedTotalPrice = amount * price;
  
      const updatedPurchase = {
        vendorId,
        amount,
        price,
        totalPrice: calculatedTotalPrice, // Update this field
        description,
        date,
        expirationDate,
        itemId,
        ItemCategoryId: itemCategoryId
      };
  
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}purchases/${selectedPurchase.id}`,
        updatedPurchase
      );
  
      // Ensure that the Vendor and Item are included in the response
      const updatedPurchaseData = response.data;
  
      // Fetch the Vendor and Item from their respective lists to update them immediately
      const vendor = vendors.find(vendor => vendor.id === updatedPurchaseData.vendorId);
      const item = items.find(item => item.id === updatedPurchaseData.itemId);
  
      // Update the response with the found Vendor and Item
      updatedPurchaseData.Vendor = vendor || {};
      updatedPurchaseData.Item = item || {};
  
      // Check if the Item is correctly found
      if (!updatedPurchaseData.Item) {
        console.error("Item not found for itemId:", updatedPurchaseData.itemId);
      }
  
      // Update the purchase list with the updated data
      const updatedData = data.map((purchase) =>
        purchase.id === selectedPurchase.id ? updatedPurchaseData : purchase
      );
  
      setData(updatedData);
      setIsEditModalOpen(false);
      setSelectedPurchase(null);
  
      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Purchase updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage('Unable to update purchase');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleDeleteClick = (purchase) => {
    setSelectedPurchase(purchase);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (purchaseId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}purchases/${purchaseId}`);
      setData(data.filter((purchase) => purchase.id !== purchaseId));
      setIsDeleteModalOpen(false);
      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Purchase deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage('Unable to delete purchase');
    }
  };

  const columns = [
    {
      label: 'Vendor Name',
      key: 'vendorName',
      render: (row) => row.Vendor ? `${row.Vendor.fname} ${row.Vendor.lname}` : 'N/A'
    },
    {
      label: 'Vendor Phone',
      key: 'vendorPhone',
      render: (row) => row.Vendor ? row.Vendor.phone : 'N/A'
    },
    {
      label: 'Item Name',
      key: 'Item.itemName',
      render: (row) => row.Item ? row.Item.itemName : 'N/A',
    },
    { label: 'Description', key: 'description' },
    { label: 'Total Price', key: 'totalPrice' },
    {
      label: 'Expiration Date',
      key: 'expirationDate',
      render: (row) => {
        if (row.expirationDate) {
          const date = new Date(row.expirationDate);
          return date.toLocaleDateString('en-US');
        }
        return 'N/A';
      }
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDetailClick(row)}
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Details
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleAddClick = () => {
    window.location.href = '/app/add-purchase';
  };

  return (
    <div>
      {pageLoading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="Purchases List"
          data={data}
          columns={columns}
          exportable={true}
          showSearch={true}
          onAdd={handleAddClick}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-11/12 sm:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Purchase</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="vendorId" className="block text-sm font-medium text-white-700">
                  Vendor Name
                </label>
                <select
                  id="vendorId"
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.fname} {vendor.lname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-white-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-white-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-white-700">
                 Total Price
                </label>
                <input
                  type="number"
                  id="totalPrice"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-white-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-white-700">
                 Purchase Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="expirationDate" className="block text-sm font-medium text-white-700">
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="expirationDate"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="itemId" className="block text-sm font-medium text-white-700">
                  Item Name
                </label>
                <select
                  id="itemId"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.itemName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="itemCategoryId" className="block text-sm font-medium text-white-700">
                  Category Name
                </label>
                <select
                  id="itemCategoryId"
                  value={itemCategoryId}
                  onChange={(e) => setItemCategoryId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {itemCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? 'Saving...': 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-11/12 sm:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Purchase Details</h2>
            {/* Display the details of the selected purchase */}
            <p><strong>Vendor Name:</strong> {selectedPurchase?.Vendor?.fname} {selectedPurchase?.Vendor?.lname}</p>
            <p><strong>Amount:</strong> {selectedPurchase?.amount}</p>
            <p><strong>Price:</strong> {selectedPurchase?.price}</p>
            <p><strong>Total Price:</strong> {selectedPurchase?.totalPrice}</p>
            <p><strong>Description:</strong> {selectedPurchase?.description}</p>
            <p><strong>Expiration Date:</strong> {new Date(selectedPurchase?.expirationDate).toLocaleDateString()}</p>
            <p><strong>Purchase Date:</strong> {new Date(selectedPurchase?.date).toLocaleDateString()}</p>
            {/* Add any other details you wish to show */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        data={selectedPurchase}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={modalMessage}
      />
    </div>
  );
};

export default PurchasesPage;
