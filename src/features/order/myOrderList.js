import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderDate, setOrderDate] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const token=localStorage.getItem('token')

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}order/myorders`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the orders:', error);
      })
      .finally(() => { setIsLoading(false); });
  }, []);

  // Handle edit button click
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setOrderDate(order.orderDate);
    setAmount(order.amount);
    setNotes(order.notes);
    setReceiptImage(order.receiptImage);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  // Handle detail button click
  const handleDetailClick = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedOrder = {
        orderDate,
        amount,
        notes,
        receiptImage,
        orderTypeId: selectedOrder.orderTypeId
      };

      const formData = new FormData();
      formData.append('orderDate', updatedOrder.orderDate);
      formData.append('amount', updatedOrder.amount);
      formData.append('notes', updatedOrder.notes);
      formData.append('orderTypeId', updatedOrder.orderTypeId);
      if (receiptImage instanceof File) {
        formData.append('receiptImage', receiptImage);
      }

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}order/${selectedOrder.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      const updatedData = orders.map((order) =>
        order.id === selectedOrder.id ? response.data : order
      );
      setOrders(updatedData);
      setIsEditModalOpen(false);
      setSelectedOrder(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Order updated successfully.');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update order.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}order/${selectedOrder.id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      });
      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Order deleted successfully.');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete order.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'OrderType.name', label: 'Order Name', render: (row) => row.OrderType?.name || 'N/A' },
    { key: 'orderDate', label: 'Order Date',render:(row)=>new Date(row.orderDate).toLocaleDateString() },
    { key: 'amount', label: 'Amount' },
    { key: 'totalprice', label: 'Total Price' },
    { key: 'status', label: 'Status' },
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
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(row)}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Detail
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (<LoadingComponent />) : (
        <TableComponent
          title="My Orders"
          data={orders}
          columns={columns}
          exportable={true}
          showSearch={true}
        />
      )}
     {/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-base-100 p-6 rounded-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
        <div className="mb-4">
          <label htmlFor="orderDate" className="block text-sm font-medium text-white-700">
            Order Date
          </label>
          <input
            type="date"
            id="orderDate"
            value={orderDate.split('T')[0]}
            onChange={(e) => setOrderDate(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-white-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="receiptImage" className="block text-sm font-medium text-white-700">
            Receipt Image
          </label>
          <input
            type="file"
            id="receiptImage"
            onChange={(e) => setReceiptImage(e.target.files[0])}
            className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-base-100 p-6 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      {selectedOrder && (
        <>
          <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
          <p><strong>Amount:</strong> {selectedOrder.amount}</p>
          <p><strong>Total Price:</strong> {selectedOrder.totalprice}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
          <p><strong>Notes:</strong> {selectedOrder.notes}</p>
          <p><strong>Receipt Image:</strong> <a href={`https://apartment.houseethiopia.com/${selectedOrder.receiptImage}`} target="_blank" rel="noopener noreferrer">View</a></p>
          <p><strong>Order Type:</strong> {selectedOrder.OrderType.name}</p>
          <p><strong>Description:</strong> {selectedOrder.OrderType.description}</p>
          <p><strong>Price:</strong> {selectedOrder.OrderType.price}</p>
        </>
      )}
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  </div>
)}

          {/* Delete Modal */}
          {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this order?</h2>
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

export default MyOrdersPage;