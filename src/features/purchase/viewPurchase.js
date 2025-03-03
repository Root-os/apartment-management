import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import DeleteConfirmationModal from '../../components/editDeleteModal'
import Modal from '../../components/Modal';

const PurchasesPage = () => {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [vendourName, setVendourName] = useState('');
  const [vendourPhone, setVendourPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemTypeId, setItemTypeId] = useState('');
  const [loading, setLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  


  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    axios
      .get('https://apartment.houseethiopia.com/api/purchases')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching purchases:', error);
      });

    axios
      .get('https://apartment.houseethiopia.com/api/items')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });

    axios
      .get('https://apartment.houseethiopia.com/api/item-types')
      .then((response) => {
        setItemTypes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching item types:', error);
      });
  }, []);

  const handleEditClick = (purchase) => {
    setSelectedPurchase(purchase);
    setVendourName(purchase.vendourName);
    setVendourPhone(purchase.vendourPhone);
    setAmount(purchase.amount);
    setPrice(purchase.price);
    setDescription(purchase.description);
    setExpirationDate(purchase.expirationDate.split('T')[0]);
    setItemId(purchase.itemId);
    setItemTypeId(purchase.itemTypeId);
    setIsEditModalOpen(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedPurchase = {
        vendourName,
        vendourPhone,
        amount,
        price,
        description,
        expirationDate,
        itemId,
        itemTypeId,
      };

      const response = await axios.put(
        `https://apartment.houseethiopia.com/api/purchases/${selectedPurchase.id}`,
        updatedPurchase
      );

      const updatedData = data.map((purchase) =>
        purchase.id === selectedPurchase.id ? response.data : purchase
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
    setSelectedPurchase(purchase); // Set the selected purchase for deletion
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };
  
  const handleDelete = async (purchaseId) => {
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/purchases/${purchaseId}`);
      setData(data.filter((purchase) => purchase.id !== purchaseId)); // Remove from state after successful delete
      setIsDeleteModalOpen(false); // Close modal
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
    { label: 'Vendor Name', key: 'vendourName' },
    { label: 'Vendor Phone', key: 'vendourPhone' },
    {
      label: 'Item Type',
      key: 'ItemType.typeName',
      render: (row) => row.ItemType ? row.ItemType.typeName : 'N/A', // Accessing typeName from the nested ItemType object
    },
    {
      label: 'Item Name',
      key: 'Item.itemName',
      render: (row) => row.Item ? row.Item.itemName : 'N/A', // Accessing itemName from the nested Item object
    },
    { label: 'Description', key: 'description' },
    { label: 'Total Price', key: 'totalPrice' },
    // { label: 'Item Category', key: 'Item.itemCategory' },
    { 
      label: 'Expiration Date', 
      key: 'expirationDate', 
      render: (row) => {
        if (row.expirationDate) {
          const date = new Date(row.expirationDate);
          return date.toLocaleDateString('en-US'); // This formats the date as MM/DD/YYYY
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
        onClick={() => handleEditClick(row)} // Your existing edit button functionality
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
      >
        Edit
      </button>
      <button
        onClick={() => handleDeleteClick(row)} // Trigger delete modal
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Delete
      </button>
    </div>
      ),
    },
  ];

  return (
    <div>
      <TableComponent
        title="Purchases List"
        data={data}
        columns={columns}
        exportable={true}
        showSearch={true}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Purchase</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="vendourName" className="block text-sm font-medium text-white-700">
                  Vendor Name
                </label>
                <input
                  type="text"
                  id="vendourName"
                  value={vendourName}
                  onChange={(e) => setVendourName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="vendourPhone" className="block text-sm font-medium text-white-700">
                  Vendor Phone
                </label>
                <input
                  type="text"
                  id="vendourPhone"
                  value={vendourPhone}
                  onChange={(e) => setVendourPhone(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  Item
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
          <label className="block text-sm font-medium text-white-700">Item Type</label>
          <select
            value={itemTypeId}
            onChange={(e) => setItemTypeId(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Item Type</option>
            {itemTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.typeName}
              </option>
            ))}
          </select>
        </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Save
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

<DeleteConfirmationModal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)} // Close the modal
  onDelete={handleDelete} // Trigger the delete function
  data={selectedPurchase} // Pass the selected purchase data
/>


      {/* Modal for Success/Error Message */}
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
