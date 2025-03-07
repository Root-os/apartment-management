import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import TitleCard from '../../components/Cards/TitleCard';

const PurchaseRequestForm = () => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]); // New state for vendors
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true); // New loading state for vendors

  const [formData, setFormData] = useState({
    itemId: '',
    requestedBy: '',
    amount: '',
    requestDate: '',
    reason: '',
    approvedBy: '',
    vendorId: '' // Added vendorId to formData
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items", error);
      } finally {
        setLoadingItems(false);
      }
    };

    const fetchUsers = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/users`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setUsers(response.data.users); 
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    // New function to fetch vendors
    const fetchVendors = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/vendors');
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors", error);
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchItems();
    fetchUsers();
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}purchases-request`, formData);
      setResponse(res.data);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Purchase request Added successfully!')
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add Request!')
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Purchase Request" topMargin={'mt-2'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-white-700">Requested By</label>
            <select
              name="requestedBy"
              value={formData.requestedBy}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fname} {user.lname}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white-700">Approved By</label>
            <select
              name="approvedBy"
              value={formData.approvedBy}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fname} {user.lname}
                </option>
              ))}
            </select>
          </div>

          {/* New Vendor selection field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white-700">Vendor</label>
            <select
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.fname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md bg-base-100 shadow-sm"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Request Date</label>
            <input
              type="date"
              name="requestDate"
              value={formData.requestDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md bg-base-100 shadow-sm"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md bg-base-100 shadow-sm"
              rows="3"
            />
          </div>

          <div>
            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add Request'}
            </button>
          </div>
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

export default PurchaseRequestForm;