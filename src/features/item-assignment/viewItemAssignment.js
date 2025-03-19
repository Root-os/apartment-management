import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; 
import DeleteConfirmationModal from '../../components/editDeleteModal';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const ItemAssignmentsPage = () => {
  const [itemAssignments, setItemAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); 
  const [formData, setFormData] = useState({
    id: '',
    itemId: '',
    assignedId: '',
    assignType: 'User',  
    assignDate: '',
    amount: '',
    description: ''
  });
  const [deleteItem, setDeleteItem] = useState(null); 

  useEffect(() => { 
    axios
    .get(`${process.env.REACT_APP_BASE_URL}items`)
    .then((response) => {
      setItems(response.data);
    })
    .catch((error) => {
      console.error('Error fetching items:', error);
    });
  }, []);

  useEffect(() => {
    const fetchItemAssignments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}item-assignments`);
        setItemAssignments(response.data.data); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching item assignments:', err);
        setError('Failed to fetch item assignments');
        setLoading(false);
      }finally{ setPageLoading(false);}
    };

    const fetchAssignedUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        
        const response = await axios.get('https://apartment.houseethiopia.com/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.data.success && Array.isArray(response.data.users)) {
          setAssignedUsers(response.data.users);
        } else {
          throw new Error('API response is not an array of users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Unable to get assigned users');
      }
    };

    fetchItemAssignments();
    fetchAssignedUsers();
  }, []);

  const handleSubmit = (assignment) => {
    setFormData({
      id: assignment.id, 
      itemId: assignment.itemId,
      assignedId: assignment.assignedId,
      assignType: assignment.assignType, 
      assignDate: assignment.assignDate,
      amount: assignment.amount,
      description: assignment.description
    });
    setOpenModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a new object without the `id` field
    const { id, ...payload } = formData;

    // Validate formData before sending the request
    if (!formData.itemId || !formData.assignedId || !formData.assignType || !formData.assignDate || !formData.amount || !formData.description) {
      setMessageType('error');
      setMessage('Please fill all required fields');
      setModalOpen(true);
      setLoading(false);
      return;
    }
    
    axios
      .put(`${process.env.REACT_APP_BASE_URL}item-assignments/${id}`, payload)
      .then(() => {
        setItemAssignments((prevAssignments) => 
          prevAssignments.map((assignment) => 
            assignment.id === id ? { ...assignment, ...formData } : assignment
          )
        );
        setOpenModal(false); 
        setModalOpen(true);
        setMessageType('success');
        setMessage('Item assignment updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating assignment:', error);

        // Log the response error details for debugging
        if (error.response) {
          console.log('Error response data:', error.response.data);
        }

        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to update Item assignment!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}item-assignments/${id}`)
      .then(() => {
        setItemAssignments(itemAssignments.filter((item) => item.id !== id));
        setOpenDeleteModal(false); 
        setModalOpen(true);
        setMessageType('success');
        setMessage('Item assignment deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting assignment:', error);
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to delete Item assignment!');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, 
    }));
  };

  const columns = [
    {
        label: 'Item Name',
        key: 'itemName',
        render: (row) => row.item?.itemName || 'N/A', 
    },
    {
        label: 'Assigned To',
        key: 'assignto',
        render: (row) => `${row.assignto?.fname} ${row.assignto?.lname}` || 'N/A',
    },
    { label: 'Assign Type', key: 'assignType' },
    { label: 'Description', key: 'description' },
    { label: 'Amount', key: 'amount' },
    { label: 'Assign Date', key: 'assignDate',
        render: (row) => {
            if (row.assignDate) {
              const date = new Date(row.assignDate);
              return date.toLocaleDateString('en-US'); 
            }
            return 'N/A';
          }
    },
    {
        label: 'Actions',
        key: 'actions',
        render: (row) => (
          <div className='flex space-x-1'>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => handleSubmit(row)}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
              onClick={() => {
                setDeleteItem(row); 
                setOpenDeleteModal(true); 
              }}
            >
              Delete
            </button>
          </div>
        )
      }
  ];
  const handleAddClick = () => {
    window.location.href = '/app/add-item-assignments';
   };

  return (
    <div> 
       {pageLoading ? (<LoadingComponent/>): (
      <TableComponent
        title="Item Assignments"
        data={itemAssignments}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />
    )}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-100 rounded-lg shadow-xl p-6 max-w-lg w-full mt-12 max-h-[80vh] overflow-y-auto ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Item Assignment</h2>
              <button onClick={() => setOpenModal(false)} className="text-white-500 hover:text-gray-700">
                X
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="itemId" className="block text-sm font-medium text-white-700">
                  Item
                </label>
                <select
                  id="itemId"
                  name="itemId"
                  value={formData.itemId}
                  onChange={handleChange}
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
                <label htmlFor="assignedId" className="block text-sm font-medium text-white-700">
                  Assigned User
                </label>
                <select
                  id="assignedId"
                  name="assignedId"
                  value={formData.assignedId}
                  onChange={handleChange}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Assigned User</option>
                  {assignedUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fname} {user.lname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="assignType" className="block text-sm font-medium text-white-700">
                  Assign Type
                </label>
                <select
                  id="assignType"
                  name="assignType"
                  value={formData.assignType}
                  onChange={handleChange}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="User">User</option>
                  <option value="Unit">Unit</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="assignDate" className="block text-sm font-medium text-white-700">
                  Assign Date
                </label>
                <input
                  type="date"
                  id="assignDate"
                  name="assignDate"
                  value={formData.assignDate}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md bg-base-100"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-white-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md bg-base-100"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-white-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md bg-base-100"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => handleDelete(deleteItem.id)}
        data={deleteItem}
      />

      <Modal
       isOpen={modalOpen}
       onClose={()=> setModalOpen(false)}
       messageType={messageType}
       message={message}
      />
    </div>
  );
};

export default ItemAssignmentsPage;