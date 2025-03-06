import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table';
import DeleteConfirmationModal from '../../../components/editDeleteModal';
import Modal from '../../../components/Modal';

const StockOutRequestPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}stockout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to get data!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditRequest = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        status: editItem.status,
        approvedQuantity: editItem.approvedQuantity,
        approvalReason: editItem.approvalReason,
      };

      const response = await axios.put(`https://apartment.houseethiopia.com/api/stockout/approve/${editItem.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Update Response:', response.data);
      
      setModalOpen(true);
      setMessageType('success');
      setMessage(response.data.message);

      // Re-fetch data after update
      fetchData();
      setEditModalOpen(false);
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage(error.response.data.message);

      if (error.response) {
        setModalOpen(true);
        setMessageType('error');
        setMessage(error.response.data.message);
      } else {
        alert('Unknown error occurred while updating the request.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteRequest = (item) => {
    setDeleteItem(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://apartment.houseethiopia.com/api/stockout/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(prevData => prevData.filter(item => item.id !== id));
      setModalOpen(true);
      setMessageType('success');
      setMessage('request deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage(error.response.data.message);
    }
  };

  const columns = [
    {
      label: 'Item Name',
      key: 'Item.itemName',
      render: (row) => row.Item ? row.Item.itemName : 'N/A',
    },
    { 
      label: 'Requested By', 
      key: 'User.fname', 
      render: (row) => row.User ? `${row.User.fname} ${row.User.lname}` : 'Unknown' 
    },
    { label: 'Requested Quantity', key: 'requestedQuantity' },
    { label: 'Request Reason', key: 'reason' },
    { label: 'Status', key: 'status' },
    { key: 'approvalReason', label: 'Reason' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className='flex space-x-2'>
          <button 
            onClick={() => handleEditRequest(row)}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white ml-2"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDeleteRequest(row)}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white ml-2"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TableComponent
          title="Requests"
          data={data}
          columns={columns}
          showSearch={true}
          exportable={true}
        />
      )}

      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-10 ">
          <div className="bg-base-100 px-8 shadow-md w-1/3 border border-gray-300 rounded">
            <h2 className="text-2xl mb-4">Edit Stockout Request</h2>
            <form onSubmit={handleUpdateRequest}>
              <div className="mb-4">
                <label className="block text-white-700 font-semibold mb-2">Status</label>
                <select
                  name="status"
                  value={editItem.status}
                  onChange={handleInputChange}
                  className="w-full bg-base-100 p-2 border border-gray-300 rounded"
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white-700 font-semibold mb-2">Approved Quantity</label>
                <input
                  type="number"
                  name="approvedQuantity"
                  value={editItem.approvedQuantity}
                  onChange={handleInputChange}
                  className="w-full bg-base-100 p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white-700 font-semibold mb-2">Approval Reason</label>
                <input
                  type="text"
                  name="approvalReason"
                  value={editItem.approvalReason}
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

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        data={deleteItem}
      />
       <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default StockOutRequestPage;