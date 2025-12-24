import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';
import api from '../../utils/api';

const AddFloorUnit = () => {
  // Form state
  const [unitNumber, setUnitNumber] = useState('');
  const [size, setSize] = useState('');
  // const [status, setStatus] = useState('available');
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

  const [images, setImages] = useState([]);
  const [price, setPrice] = useState(null);
  const [rent, setRent] = useState(null);
  const [taxedRent, setTaxedRent] = useState(null);


  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await api.get("floor");
        setFloors(response.data);
      } catch (err) {
        setError('Failed to fetch floors.');
      }
    };

    fetchFloors();
  }, []);

useEffect(() => {
  if (size && price) {
    const calculatedRent = parseFloat(size) * parseFloat(price);
    setRent(Math.round(calculatedRent * 100) / 100); 

    const taxed = calculatedRent * 1.15; 
    setTaxedRent(Math.round(taxed * 100) / 100); 
  } else {
    setRent('');
    setTaxedRent('');
  }
}, [size, price]);



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

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      formData.append('unitNumber', unitNumber);
      formData.append('size', parseFloat(size));
      // formData.append('status', status);
      formData.append('floorId', parseInt(floorId));

      // Append arrays as JSON strings
      formData.append('availableEquipments', JSON.stringify(availableEquipments));
      formData.append('problems', JSON.stringify(problems));

      // Append image files
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      formData.append('pricePerSquare', parseFloat(price));
      formData.append('rentAmount', parseFloat(rent));
      formData.append('taxedRentAmount', parseFloat(taxedRent));

      console.log("Sending payload:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
    

      const response = await api.post("unit",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setModalOpen(true);
      setMessageType('success');
      setMessage('Unit Added Successfully');

      // Reset form after submission
      setUnitNumber('');
      setSize('');
      // setStatus('available');
      setAvailableEquipments([]);
      setProblems([]);
      setNewEquipment('');
      setNewProblem('');
      setRentedDate('');
      setVacatedDate('');
      setFloorId('');
      setImages([]);
      setPrice('');
      setRent('');
      setTaxedRent('');
      setLoading(false);
      window.location.href = '/app/view-unit';
    } catch (err) {
      setLoading(false);
      setModalOpen(true);
      setMessageType('error');

      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage('Unable to add Unit, try again!');
      }
    }
  };

  const handleImageChange = (e) => {
  const selectedFiles = Array.from(e.target.files);

  // Combine old and new files
  const combinedFiles = [...images, ...selectedFiles];

  // Limit total images to 10 max
  if (combinedFiles.length > 10) {
    setError('You can only upload up to 10 images.');
    return;
  }

  setError('');
  setImages(combinedFiles);
};



  return (
    <>
      <TitleCard title="Add Floor Unit" topMargin={"mt-1"}>

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
          <label className="block text-sm font-semibold mb-2">Size (m²)</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            onWheel = {(e) => e.target.blur()}
            required
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
             min="1"                
             step="0.01"
          />
        </div>

        <div>
          <label>Price per square</label>
          <input 
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onWheel = {(e) => e.target.blur()}
            required
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
             min="1"                
             step="0.01"
          />
        </div>
        <div>
          <label>Rent Amount</label>
          <input
            type="number"
            value={rent || ''}
            readOnly
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            step="0.01"
          />
        </div>

        <div>
          <label>Taxed Rent (15%)</label>
          <input
            type="number"
            value={taxedRent || ''}
            readOnly
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            step="0.01"
          />
        </div>


        {/* Status */}
        {/* <div>
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="under_maintenance">Under Maintenance</option>
          </select>
        </div> */}

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
                {floor.floorNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Upload Images</label>
         <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />

          {images.length > 0 && (
          <ul className="mt-2 flex space-x-4 overflow-x-auto">
            {images.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setImages(images.filter((_, i) => i !== idx));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          )}
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