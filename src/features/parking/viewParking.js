import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; // Assuming you saved the TableComponent code in the same directory
import Modal from '../../components/Modal'; // Assuming you saved the Modal code in the same directory

const ParkingPage = () => {
  const [parkingData, setParkingData] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carPlate, setCarPlate] = useState('');
  const [carName, setCarName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch the parking data from the API
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/parking');
        setParkingData(response.data);
      } catch (error) {
        console.error('Error fetching parking data:', error);
      }
    };

    fetchParkingData();
  }, []);

  // Handle edit button click
  const handleEditClick = (parking) => {
    setSelectedParking(parking);
    setCarPlate(parking.carPlate);
    setCarName(parking.carName);
    setDriverName(parking.driverName);
    setDriverPhone(parking.driverPhone);
    setTimeIn(parking.timeIn);
    setTimeOut(parking.timeOut);
    setPrice(parking.price);
    setStatus(parking.status);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (parking) => {
    setSelectedParking(parking);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedParking = {
        carPlate,
        carName,
        driverName,
        driverPhone,
        timeIn,
        timeOut,
        price,
        status,
      };

      const response = await axios.put(`https://apartment.houseethiopia.com/api/parking/${selectedParking.id}`, updatedParking);
      const updatedData = parkingData.map((parking) =>
        parking.id === selectedParking.id ? response.data : parking
      );
      setParkingData(updatedData);
      setIsEditModalOpen(false);
      setSelectedParking(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Parking data updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update parking data');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/parking/${selectedParking.id}`);
      setParkingData(parkingData.filter((parking) => parking.id !== selectedParking.id));
      setIsDeleteModalOpen(false);
      setSelectedParking(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Parking data deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete parking data');
    } finally {
      setLoading(false);
    }
  };

  // Define the columns for the table
  const columns = [
    { label: 'Car Plate', key: 'carPlate' },
    { label: 'Car Name', key: 'carName' },
    { label: 'Driver Name', key: 'driverName' },
    { label: 'Driver Phone', key: 'driverPhone' },
    { label: 'Time In', key: 'timeIn' },
    { label: 'Time Out', key: 'timeOut' },
    // { label: 'Price', key: 'price' },
    { label: 'Status', key: 'status' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleAddClick = () => {
    window.confirm.href = '/parking-add';
  };

  return (
    <div>
      <TableComponent
        title="Parking Data"
        data={parkingData}
        columns={columns}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Parking Data</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="carPlate" className="block text-sm font-medium text-white-700">
                  Car Plate
                </label>
                <input
                  type="text"
                  id="carPlate"
                  value={carPlate}
                  onChange={(e) => setCarPlate(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="carName" className="block text-sm font-medium text-white-700">
                  Car Name
                </label>
                <input
                  type="text"
                  id="carName"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="driverName" className="block text-sm font-medium text-white-700">
                  Driver Name
                </label>
                <input
                  type="text"
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="driverPhone" className="block text-sm font-medium text-white-700">
                  Driver Phone
                </label>
                <input
                  type="text"
                  id="driverPhone"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timeIn" className="block text-sm font-medium text-white-700">
                  Time In
                </label>
                <input
                  type="datetime-local"
                  id="timeIn"
                  value={timeIn}
                  onChange={(e) => setTimeIn(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timeOut" className="block text-sm font-medium text-white-700">
                  Time Out
                </label>
                <input
                  type="datetime-local"
                  id="timeOut"
                  value={timeOut}
                  onChange={(e) => setTimeOut(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <input
                  type="text"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this parking data?</h2>
            <div className="flex justify-between">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
<Modal
isOpen={modalOpen}
onClose={() => setModalOpen(false)}
messageType={messageType}
message={message}
/>

{/* {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`bg-base-100 p-6 rounded-lg shadow-lg w-96 ${messageType === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            <h2 className="text-2xl font-bold mb-4">{messageType === 'success' ? 'Success' : 'Error'}</h2>
            <p>{message}</p>
            <div className="text-center mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}

    </div>
  );
};

export default ParkingPage;