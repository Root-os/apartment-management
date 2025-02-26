import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddExpense = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); // 
  const [successMessage, setSuccessMessage] = useState(null); 

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Simple validation
    if (!name || !description) {
      setError('Both name and description are required.');
      return;
    }

    setLoading(true);
    setError(null); 
    setSuccessMessage(null); 


    try {
      const response = await axios.post('https://apartment.houseethiopia.com/api/expense-type', {
        name,
        description,
      });
      setModalOpen(true);
      setMessageType('success');
      setMessage('Expense added successfully');
      setName(''); 
      setDescription('');
      window.location.href='/app/expense-view'
    } catch (err) {
      setError('An error occurred while adding the expense.');
      setModalOpen(true);
      setMessageType('error');
      setMessage('An error occurred while adding the expense.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <><TitleCard title={'Add Expense'}>

      {/* Expense Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white-700" htmlFor="name">Expense Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-base-100"
            required
          />
        </div>

        <div>
          <label className="block text-white-700" htmlFor="description">Expense Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" w-full p-2 border border-gray-300 rounded bg-base-100"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? 'Adding Expense...' : 'Add Expense'}
          </button>
        </div>
      </form>
      </TitleCard>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={messageType}
        message={message}
        />
    </>
  );
};

export default AddExpense;
