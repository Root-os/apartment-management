import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const OrderTypesPage = () => {
  const [orderTypes, setOrderTypes] = useState([]);
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}order-type`)
      .then((response) => {
        setOrderTypes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the order types:', error);
      })
      .finally(() => { setIsLoading(false); })
  }, []);

  // Handle edit button click
  const handleEditClick = (orderType) => {
    setSelectedOrderType(orderType);
    setName(orderType.name);
    setDescription(orderType.description);
    setPrice(orderType.price);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (orderType) => {
    setSelectedOrderType(orderType);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedOrderType = {
        name,
        description,
        price: parseFloat(price)
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}order-type/${selectedOrderType.id}`, updatedOrderType);
      const updatedData = orderTypes.map((orderType) =>
        orderType.id === selectedOrderType.id ? response.data : orderType
      );
      setOrderTypes(updatedData);
      setIsEditModalOpen(false);
      setSelectedOrderType(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Order type updated successfully.');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update order type.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}order-type/${selectedOrderType.id}`);
      setOrderTypes(orderTypes.filter((orderType) => orderType.id !== selectedOrderType.id));
      setIsDeleteModalOpen(false);
      setSelectedOrderType(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Order type deleted successfully.');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete order type.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Order Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price (ETB)' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <>
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (<LoadingComponent />) : (
        <TableComponent
          title="Order Types List"
          data={orderTypes}
          columns={columns}
          exportable={true}
          showSearch={true}
        />
      )}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Order Type</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white-700">
                  Order Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-white-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  min="1"
                  step="1"
                  onChange={(e) => setPrice(e.target.value)}
                  onWheel={(e)=> e.target.blur()}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this order type?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default OrderTypesPage;