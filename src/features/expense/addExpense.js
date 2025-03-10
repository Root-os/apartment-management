import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [expenseTypeId, setExpenseTypeId] = useState('');
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch expense types from API
  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}expense-type`);
        setExpenseTypes(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Failed to fetch expense types.');
      }
    };

    fetchExpenseTypes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const expenseData = {
      amount,
      date,
      description,
      expenseTypeId,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}expense`, expenseData);
      // Reset form
      setAmount('');
      setDate('');
      setDescription('');
      setExpenseTypeId('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Expense added successfully.');

      window.location.href = '/expense-view'
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to add expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Expense" topMargin={'mt-4'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Expense Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Expense Type</label>
            <select
              value={expenseTypeId}
              onChange={(e) => setExpenseTypeId(e.target.value)}
              required
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Select Expense Type</option>
              {expenseTypes.map((expenseType) => (
                <option key={expenseType.id} value={expenseType.id}>
                  {expenseType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Submitting...' : 'Add Expense'}
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

export default AddExpense;