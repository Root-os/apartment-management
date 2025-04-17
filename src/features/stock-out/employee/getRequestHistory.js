import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table';
import Modal from '../../../components/Modal';
import LoadingComponent from '../../../components/loading';

const StockoutPage = () => {
  const [stockoutData, setStockoutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [items, setItems] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch the stockout data from API
  const fetchStockoutData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}stockout/my-request`, 
          {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      );
      setStockoutData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stockout data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockoutData();
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Handle cancel request
  const handleCancelRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Cancel request token:', token); 

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}stockout/cance-request/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Cancel Response:', response.data);
      // alert(response.data.message);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Stock out request canceled successfully!');

      setStockoutData(prevData => prevData.map(item => 
        item.id === id ? { ...item, status: 'canceled' } : item
      ));
    } catch (error) {
      console.error("Error canceling request:", error);
      setModalOpen(true);
      setMessageType('error');
      setMessage("unable to cancel request:", error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
       
        setModalOpen(true);
        setMessageType('error');
        setMessage(`  ${error.response.data.message || 'Unknown error'}`);
      } else {
        alert('Unknown error occurred while canceling the request.');
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to cancel!');
      }
    }
  };

  // Handle edit request
  const handleEditRequest = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  // Handle update request
  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        itemId: editItem.itemId,
        source: editItem.source,
        reason: editItem.reason,
        requestedQuantity: editItem.requestedQuantity,
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}stockout/${editItem.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('Update Response:', response.data);
      
      setModalOpen(true);
      setMessageType('success');
      setMessage('Stock out request upfated successfully!');

      await fetchStockoutData();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating request:", error);

      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
      

        setModalOpen(true);
        setMessageType('error');
        setMessage(` ${error.response.data.message || 'Unknown error'}`);
      } else {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to update the request.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  // Define columns for the table
  const columns = [
    { key: 'itemName', label: 'Item Name' },
    { key: 'source', label: 'Source' },
    { key: 'reason', label: 'Request Reason' },
    { key: 'requestedQuantity', label: 'Requested Quantity' },
    { key: 'approvedQuantity', label: 'Approved Quantity' },
    { key: 'status', label: 'Status' },
    { key: 'approvalReason', label: 'Reason' },
    // { key: 'fname', label: 'First Name' },
    // { key: 'lname', label: 'Last Name' },
    // { key: 'email', label: 'Email' },
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className='flex space-x-1'>
        <button 
          onClick={() => handleCancelRequest(row.id)}
          disabled={row.status === 'canceled'}
          className={`px-4 py-2 rounded ${row.status === 'canceled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        >
          Cancel
        </button>
        <button 
          onClick={() => handleEditRequest(row)}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white ml-2"
        >
          Edit
        </button>
      </div>
    )}
  ];

  // Prepare data for the table, including user data and item info
  const tableData = stockoutData.map(item => ({
    ...item,
    itemName: item.Item ? item.Item.itemName : 'Unknown Item',
    fname: item.User ? item.User.fname : 'Unknown',
    lname: item.User ? item.User.lname : 'Unknown',
    email: item.User ? item.User.email : 'Unknown',
  }));

  const handleAddClick = () => {
    window.location.href = '/app/employee-initial-request';
   };

  return (
    <div>
      {loading ? (
        <LoadingComponent/>
      ) : (
        <TableComponent 
          title="Requests"
          data={tableData}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          exportable={true}
          showSearch={true}
          onAdd={handleAddClick}
        />
      )}

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div  className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl mb-4">Edit Stockout Request</h2>
            <form onSubmit={handleUpdateRequest}>
              <div className="mb-4">
                <label className="block text-white-700 font-semibold mb-2">Item</label>
                <select
                  name="itemId"
                  value={editItem.itemId}
                  onChange={handleInputChange}
                  className="w-full bg-base-100 p-2 border border-gray-300 rounded"
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
                <label className="block text-white-700 font-semibold mb-2">Source</label>
                <select
                  name="source"
                  value={editItem.source}
                  onChange={handleInputChange}
                  className="w-full bg-base-100 p-2 border border-gray-300 rounded"
                >
                  <option value="store">Store</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white-700 font-semibold mb-2">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={editItem.reason}
                  onChange={handleInputChange}
                  className="w-full bg-base-100 p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white-700 font-semibold mb-2">Requested Quantity</label>
                <input
                  type="number"
                  name="requestedQuantity"
                  value={editItem.requestedQuantity}
                  onChange={handleInputChange}
                  className="w-full bg-base-100 p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 mr-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
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

export default StockoutPage;