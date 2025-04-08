import React, { useState } from "react";
import axios from "axios";
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const PaymentTypeForm = () => {
  // State variables to store input data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !description) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}payment-types`,
        {
          name: name,
          description: description,
        }
      );

      // Display success message
      setModalOpen(true);
      setMessageType('success');
      setMessage("Payment type added successfully!");

      setName("");
      setDescription("");
    } catch (err) {
      // Handle error
      setModalOpen(true);
      setMessageType('error');
      setMessage("An error occurred while adding the payment type.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Payment Type" topMargin={'mt-1'}>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white-700 font-semibold mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter payment type name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-white-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter payment description"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Payment Type"}
        </button>
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

export default PaymentTypeForm;
