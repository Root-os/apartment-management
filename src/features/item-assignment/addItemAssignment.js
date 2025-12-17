import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import TitleCard from '../../components/Cards/TitleCard';
import SmartDateInput from '../../components/Common/smartDatePicker';

const ItemAssignmentForm = () => {
  const [items, setItems] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formData, setFormData] = useState({
    itemId: '',
    assignedId: '',
    assignType: 'User',
    assignDate: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
        setItems(response.data);
      } catch (err) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to get items');
      }
    };

    const fetchAssignedUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        console.log('Token: ', token); // Log token

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/employee`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        console.log('Assigned Users:', response.data); // Log response data

        // Access the users array from the response object
        if (response.data.success && Array.isArray(response.data.users)) {
          setAssignedUsers(response.data.users);
        } else {
          throw new Error('API response is not an array of users');
        }
      } catch (err) {
        console.error('Error fetching users:', err); // Log error
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to get assigned users');
      }
    };

    fetchItems();
    fetchAssignedUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

const handleDateChange = (fieldName) => (dateValue) => {
  setFormData((prevState) => ({
    ...prevState,
    [fieldName]: dateValue,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      itemId: formData.itemId,
      assignedId: formData.assignedId,
      assignType: formData.assignType,
      assignDate: formData.assignDate,
      amount: formData.amount,
      description: formData.description,
    };

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}item-assignments`, payload);
      setFormData({
        itemId: '',
        assignedId: '',
        assignType: 'User',
        assignDate: '',
        amount: '',
        description: ''
      });
      setModalOpen(true);
      setMessageType('success');
      setMessage('Item assignment Added successfully!');
      window.location.href='/app/view-item-assignments';
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add Item assignment!');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeNameById = (id) => {
    const employee = assignedUsers.find((emp) => emp.id === id);
    return employee ? employee.fname : 'Unassigned';
  };

  return (
    <>
      <TitleCard title="Add Item Assignment" topMargin={'mt-2'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-white-700">Item</label>
            <select
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              required
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
            <label className="block text-sm font-medium text-white-700">Assigned User</label>
            <select
              name="assignedId"
              value={formData.assignedId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="">Select Assigned User</option>
              {Array.isArray(assignedUsers) && assignedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fname}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white-700">Assign Type</label>
            <select
              name="assignType"
              value={formData.assignType}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="User">User</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white-700">Assign Date</label>
            <SmartDateInput
              name="assignDate"
              value={formData.assignDate}
              onChange={handleDateChange('assignDate')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white-700">Item Amount</label>
            <input
              type="number"
              name="amount"
              min="1"
              step="1"
              value={formData.amount}
              onChange={handleChange}
              onWheel={(e)=> e.target.blur()}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
              rows="4"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </TitleCard>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default ItemAssignmentForm;
