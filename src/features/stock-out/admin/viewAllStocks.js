import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table'; 

const StockOutRequestPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal visibility state for status update
  const [statusData, setStatusData] = useState(null); // Data for the status update (id, current status)
  const [status, setStatus] = useState('approved'); // Default status
  const [approvedQuantity, setApprovedQuantity] = useState(0); // Approved quantity
  const [approvalReason, setApprovalReason] = useState(''); // Approval reason
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility state for delete confirmation
  const [requestToDelete, setRequestToDelete] = useState(null); // ID of the request to delete

  useEffect(() => {
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
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle the deletion of a stockout request
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}stockout/${requestToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === 'Stockout request deleted successfully') {
        // Filter out the deleted request from the state
        setData((prevData) => prevData.filter((request) => request.id !== requestToDelete));
        alert('Stockout request deleted successfully');
      } else {
        alert('Failed to delete the request');
      }
    } catch (error) {
      console.error('Error deleting request', error);
      alert('Error deleting request');
    } finally {
      setShowDeleteModal(false); // Hide the delete modal after deletion attempt
    }
  };

  // Handle the click on "Change Status" to show the modal
  const handleChangeStatus = (row) => {
    setStatusData(row);
    setStatus(row.status); // Set the current status of the row
    setApprovedQuantity(row.approvedQuantity || 0); // Set the current approved quantity
    setApprovalReason(row.approvalReason || ''); // Set the current approval reason
    setShowModal(true); // Show the status update modal
  };

  // Handle the status update
  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}stockout/${statusData.id}`,
        {
          status: status,
          approvedQuantity: approvedQuantity,
          approvalReason: approvalReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === 'Stockout approved successfully' || response.data.message === 'Stockout rejected successfully') {
        // Update the status of the specific request in the data array
        setData((prevData) =>
          prevData.map((request) =>
            request.id === statusData.id
              ? { ...request, status: status, approvedQuantity: approvedQuantity, approvalReason: approvalReason }
              : request
          )
        );
        alert('Stockout request status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status', error);
      alert('Error updating status');
    } finally {
      setShowModal(false); // Hide the modal after status update attempt
    }
  };

  // Define the columns based on your data structure
  const columns = [
    {
      label: 'Item Name',
      key: 'Item.itemName',
      render: (row) => row.Item ? row.Item.itemName : 'N/A',
    },
    { label: 'Requested By', key: 'User.fname', render: (row) => `${row.User.fname} ${row.User.lname}` },
    { label: 'Requested Quantity', key: 'requestedQuantity' },
    { label: 'Status', key: 'status' },
    { label: 'Reason', key: 'reason' },
    {
      label: 'Actions', // Add Actions column for the delete and change status buttons
      key: 'actions',
      render: (row) => (
        <>
          <button
            onClick={() => handleChangeStatus(row)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Change Status
          </button>
          <button
            onClick={() => {
              setRequestToDelete(row.id);
              setShowDeleteModal(true);
            }}
            className="bg-red-500 text-white py-1 px-4 rounded mr-2"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TableComponent
          title="Stock Out Requests"
          data={data}
          columns={columns}
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Modal for status update */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-98">
            <h3 className="text-xl font-semibold mb-4">Change Status of Stockout Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Approved Quantity</label>
              <input
                type="number"
                value={approvedQuantity}
                onChange={(e) => setApprovedQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Approval Reason</label>
              <textarea
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Status
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Modal for delete confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-98">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this request?</h3>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StockOutRequestPage;
