import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import api from '../../utils/api';

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderDate, setOrderDate] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  const token=localStorage.getItem('token')

  useEffect(() => {
    api
      .get(`order`)
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
    setStatus(order.status); // Set initial status of selected order
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
  const handleApproveStatus = async (orderId, newStatus) => {
    setLoading(true);
    const token = localStorage.getItem('token');  
  
    try {

      const response = await api.put(
        `order/approve/${orderId}`,
        { status: newStatus },  
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
 
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? response.data : order
      );
      setOrders(updatedOrders);
  

      setModalOpen(true);
      setMessageType('success');
      setMessage('Order status updated successfully.');
    } catch (error) {
     
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update order status.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`order/${selectedOrder.id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        },
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
    { key: 'OrderType.name', label: 'Order Type',render:(row)=>row.OrderType?.name ||'N/A' },
    { key: 'Tenant.fullName', label: 'Full Name',render:(row)=>row.Tenant?.fullName ||'N/A' },

    {
  key: 'orderDate',
  label: 'Order Date & Time',
  render: (row) => {
    if (!row.orderDate) return 'N/A';

    const date = new Date(row.orderDate);

    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // change to false if you want 24h
    });
  },
},

    { key: 'amount', label: 'Amount', 
      render: (row) => {
        if (row.amount) {
          return Math.round(row.amount);
        }
        return 'N/A';
      }
     },
    { key: 'totalprice', label: 'Total Price'
      // render: (row) => {
      //   if (row.totalprice) {
      //     return Math.round(row.totalprice);
      //   }
      //   return 'N/A';
      // }
     },
    { key: 'status', label: 'Status' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="justify-end space-x-1">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(row)}
            className="bg-gray-500 text-white px-2 py-1 rounded-md"
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (<LoadingComponent />) : (
        <TableComponent
          title="All Orders"
          data={orders}
          columns={columns}
          exportable={true}
          showSearch={true}
        />
      )}
      {/* Edit Modal to change Status */}
      {isEditModalOpen && (
        <div className="mt-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Order Status</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApproveStatus(selectedOrder.id, status);  // Only update the status
              }}
            >
              {/* Status Field */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-white-700">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                  <option value="ready">Ready</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              {/* Submit & Cancel Buttons */}
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

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            {selectedOrder && (
              <>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toISOString().split('T')[0]}</p>
                <p><strong>Amount:</strong> {selectedOrder.amount}</p>
                <p><strong>Single Price:</strong> {selectedOrder.OrderType.price}</p>
                <p><strong>Total Price:</strong> {selectedOrder.totalprice}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Receipt Image:</strong></p>
                  <button
                    onClick={() => window.open(selectedOrder.receiptImage, '_blank')}
                    className="text-blue-800 underline"
                  >
                    View Receipt
                  </button>
                <p><strong>Tenant Name:</strong> {selectedOrder.Tenant?.fullName}</p>
                <p><strong>Tenant Phone:</strong> {selectedOrder.Tenant.phoneNumber}</p>
                <p><strong>Tenant Email:</strong> {selectedOrder.Tenant.email}</p>
                <p><strong>Order Type:</strong> {selectedOrder.OrderType.name}</p>
                <p><strong>Description:</strong> {selectedOrder.OrderType.description}</p>
              </>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
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

export default AllOrdersPage;