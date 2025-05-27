import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table';
import DeleteConfirmationModal from '../../../components/editDeleteModal';
import Modal from '../../../components/Modal';
import LoadingComponent from '../../../components/loading';

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

  if (name === "approvedQuantity") {
    const newVal = Number(value);
    const maxAllowed = editItem.requestedQuantity;

    setEditItem((prev) => ({
      ...prev,
      approvedQuantity: newVal > maxAllowed ? maxAllowed : newVal,
    }));
    return;
  }

  if (name === "status" && value === "approved") {
    setEditItem((prev) => ({
      ...prev,
      status: value,
      approvedQuantity: prev.requestedQuantity || 0,
    }));
  } else {
    setEditItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
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

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}stockout/approve/${editItem.id}`, payload, {
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
      await axios.delete(`${process.env.REACT_APP_BASE_URL}stockout/${id}`, {
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
    { label: 'Approved Quantity', key: 'approvedQuantity' },
    { key: 'approvalReason', label: 'Approval/Rejection Reason' },
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
        <LoadingComponent/>
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
  <div className="fixed inset-0 flex items-start justify-center z-50 pt-20 bg-black bg-opacity-50">
    <div className="bg-white dark:bg-base-100 px-8 py-6 shadow-lg w-full max-w-xl border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Stockout Request</h2>
      <form onSubmit={handleUpdateRequest}>
        
        {/* Status Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Status</label>
          <select
            name="status"
            value={editItem.status}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border border-gray-300 rounded"
          >
            <option value="">Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Approval/Rejection Reason */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Approval / Rejection Reason
          </label>
          <input
            type="text"
            name="approvalReason"
            value={editItem.approvalReason || ""}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Approved Quantity */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Approved Quantity (if approved)
          </label>
         <input
            type="number"
            name="approvedQuantity"
            value={editItem.approvedQuantity}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border border-gray-300 rounded"
            min="0"
            max={editItem.requestedQuantity} // limit to requested quantity
            step="1"
          />

          {/* Stock Info and Warnings */}
          {editItem?.Item && (
            <>
              <p className="text-sm text-gray-500 mt-1">
                Available: <strong>{parseInt(editItem.Item.itemAmount || 0)}</strong>{" "}
                {editItem.Item.unit || "units"}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-semibold ${
                  editItem.Item.itemAmount <= 0
                    ? "bg-red-200 text-red-800"
                    : editItem.Item.itemAmount < editItem.Item.min_amount
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {editItem.Item.itemAmount <= 0
                  ? "Out of Stock"
                  : editItem.Item.itemAmount < editItem.Item.min_amount
                  ? "Low Stock"
                  : "Sufficient Stock"}
              </span>
            </>
          )}

        {editItem?.status === "approved" &&
  Number(editItem.approvedQuantity) > Number(editItem.requestedQuantity) && (
    <p className="text-red-600 text-sm mt-1 font-medium">
      ⚠️ Approved quantity cannot exceed requested quantity!
    </p>
)}

        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => setEditModalOpen(false)}
            className="px-4 py-2 mr-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              editLoading ||
              (editItem.status === "approved" &&
                Number(editItem.approvedQuantity) > (editItem.Item?.itemAmount || 0))
            }
            className={`px-4 py-2 rounded text-white font-semibold ${
              editLoading ||
              (editItem.status === "approved" &&
                Number(editItem.approvedQuantity) > (editItem.Item?.itemAmount || 0))
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editLoading ? "Saving..." : "Save Changes"}
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