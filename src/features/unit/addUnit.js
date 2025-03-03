import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddFloorUnit = () => {
  // Form state
  const [unitNumber, setUnitNumber] = useState('');
  const [size, setSize] = useState('');
  const [status, setStatus] = useState('available');
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [problems, setProblems] = useState([]);
  const [rentedDate, setRentedDate] = useState('');
  const [vacatedDate, setVacatedDate] = useState('');
  const [floorId, setFloorId] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [floors, setFloors] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] =useState(null);

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor`);
        setFloors(response.data);
      } catch (err) {
        setError('Failed to fetch floors.');
      }
    };

    fetchFloors();
  }, []);

  // Add new equipment
  const handleAddEquipment = () => {
    if (newEquipment) {
      setAvailableEquipments((prevEquipments) => [...prevEquipments, newEquipment]);
      setNewEquipment('');
    }
  };

  // Add new problem
  const handleAddProblem = () => {
    if (newProblem) {
      setProblems((prevProblems) => [...prevProblems, newProblem]);
      setNewProblem('');
    }
  };

  // Remove equipment from the list
  const handleRemoveEquipment = (index) => {
    const updatedEquipments = availableEquipments.filter((_, i) => i !== index);
    setAvailableEquipments(updatedEquipments);
  };

  // Remove problem from the list
  const handleRemoveProblem = (index) => {
    const updatedProblems = problems.filter((_, i) => i !== index);
    setProblems(updatedProblems);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the request payload
    const data = {
      unitNumber,
      size: parseFloat(size),
      status,
      availableEquipments, // Already an array
      problems, // Already an array
      rentedDate,
      vacatedDate,
      floorId: parseInt(floorId),
    };

    setLoading(true);
    setError('');

    try {
      // Make the POST request
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}unit`,
        data
      );

      setModalOpen(true);
      setMessageType('success')
      setMessage('Unit Added Successfully')

      // Reset form after submission
      setUnitNumber('');
      setSize('');
      setStatus('available');
      setAvailableEquipments([]);
      setProblems([]);
      setNewEquipment('');
      setNewProblem('');
      setRentedDate('');
      setVacatedDate('');
      setFloorId('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add Unit, try again!');
    }
  };

  return (
    <>
      <TitleCard title="Add Floor Unit" topMargin={"mt-4"}>

      {error && <div className="bg-red-300 p-3 mb-4 text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Unit Number */}
        <div>
          <label className="block text-sm font-semibold mb-2">Unit Number</label>
          <input
            type="text"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            required
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-semibold mb-2">Size (in sq.ft.)</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>

        {/* Available Equipments */}
        <div>
          <label className="block text-sm font-semibold mb-2">Available Equipments</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              placeholder="Enter equipment"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleAddEquipment}
              className="ml-2 bg-blue-500 text-white p-3 rounded-md"
            >
              Add 
            </button>
          </div>
          <ul>
            {availableEquipments.map((equipment, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{equipment}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEquipment(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Problems */}
        <div>
          <label className="block text-sm font-semibold mb-2">Problems</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newProblem}
              onChange={(e) => setNewProblem(e.target.value)}
              placeholder="Enter problem"
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleAddProblem}
              className="ml-2 bg-blue-500 text-white p-3 rounded-md"
            >
              Add
            </button>
          </div>
          <ul>
            {problems.map((problem, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{problem}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProblem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Vacated Date */}

<div className="flex space-x-4">
  <div>
    <label className="block text-sm font-semibold mb-2">Vacated Date</label>
    <input
      type="date"
      value={vacatedDate}
      onChange={(e) => setVacatedDate(e.target.value)}
      className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
    />
  </div>
  <div>
    <label className="block text-sm font-semibold mb-2">Rented Date</label>
    <input
      type="date"
      value={rentedDate}
      onChange={(e) => setRentedDate(e.target.value)}
      className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
    />
  </div>
</div>


        {/* Floor ID */}
        <div>
          <label className="block text-sm font-semibold mb-2">Floor</label>
          <select
            value={floorId}
            onChange={(e) => setFloorId(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Select a Floor</option>
            {floors.map((floor) => (
              <option key={floor.id} value={floor.id}>
                {floor.name}
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
            {loading ? 'Submitting' :
              'Add Unit'
            }
          </button>
        </div>
      </form>
      </TitleCard>

      <Modal
      isOpen={modalOpen}
      onClose={()=> setModalOpen(false)}
      messageType={messageType}
      message={message}
      />
    </>
  );
};

export default AddFloorUnit;
