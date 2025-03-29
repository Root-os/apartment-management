import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table";
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const FloorManagement = () => {
  const [floors, setFloors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorDetails, setFloorDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [newFloorData, setNewFloorData] = useState({
    floorNumber: '',
    totalUnits: '',
    rentedUnits: '',
    freeUnits: ''
  });
  const [loading, setLoading] = useState(true);  // Loading state for page and actions
  const [buttonLoading, setButtonLoading] = useState(false);  // Button loading state

  const navigate = useNavigate();

  // Fetch floors
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}floor`)
      .then(response => {
        setFloors(response.data);
      })
      .catch(error => {
        console.error("Error fetching floors:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false once fetch is complete
      });
  }, []);

  // Edit floor
  const handleEditClick = (floor) => {
    setSelectedFloor(floor);
    setNewFloorData({
      floorNumber: floor.floorNumber,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    setButtonLoading(true); // Start button loading
    axios.put(`${process.env.REACT_APP_BASE_URL}floor/${selectedFloor.id}`, newFloorData)
      .then(() => {
        setFloors(floors.map(floor => (floor.id === selectedFloor.id ? { ...floor, ...newFloorData } : floor)));
        setIsEditModalOpen(false);

        setModalOpen(true);
        setMessageType('success');
        setMessage('Floor updated successfully');
      })
      .catch(error => {
        console.error("Error updating floor:", error);

        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to update, please try again');
      })
      .finally(() => {
        setButtonLoading(false); // End button loading
      });
  };

  // Delete floor
  const handleDeleteClick = (floor) => {
    setSelectedFloor(floor);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setButtonLoading(true); // Start button loading for delete
    axios.delete(`${process.env.REACT_APP_BASE_URL}floor/${selectedFloor.id}`)
      .then(() => {
        setFloors(floors.filter(floor => floor.id !== selectedFloor.id));
        setIsDeleteModalOpen(false);

        setModalOpen(true);
        setMessageType('success');
        setMessage('Floor deleted successfully');
      })
      .catch(error => {
        console.error("Error deleting floor:", error);

        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to delete, please try again');
      })
      .finally(() => {
        setButtonLoading(false); // End button loading for delete
      });
  };

  // Detail floor
  const handleDetailClick = (floor) => {
    axios.get(`${process.env.REACT_APP_BASE_URL}floor/${floor.id}`)
      .then(response => {
        setFloorDetails(response.data);
        setIsDetailModalOpen(true);
      })
      .catch(error => {
        console.error("Error fetching floor details:", error);
      })
      .finally(() => {
      });
  };

  const columns = [
    { key: 'floorNumber', label: 'Floor Name' },
    { key: 'totalUnits', label: 'Total Units' },
    { key: 'rentedUnits', label: 'Rented Units' },
    { key: 'freeUnits', label: 'Free Units' },
    {
      key: 'actions',
      label: 'Actions',
      render: (floor) => (
        <>
          <button
            onClick={() => handleEditClick(floor)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(floor)}
            className="bg-red-500 text-white py-1 px-4 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(floor)}
            className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Detail
          </button>
        </>
      )
    }
  ];

  const handleAddClick = () => {
   window.location.href = '/app/floor-add';
  };

  return (
    <div>
      {loading ? (<LoadingComponent/>):(

      <TableComponent
        title="Floor List"
        data={floors}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />
    )}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Edit Floor</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Floor Name</label>
              <input
                type="text"
                value={newFloorData.floorNumber}
                onChange={(e) => setNewFloorData({ ...newFloorData, floorNumber: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button 
                onClick={handleEditSubmit} 
                className="bg-blue-500 text-white px-4 py-2 rounded" 
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div  className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this floor?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && floorDetails && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-scroll">
      <h2 className="text-xl mb-4">Free Units of the Floor</h2>

      {/* Check if there are no free units */}
      {floorDetails.freeUnits && floorDetails.freeUnits.length > 0 ? (
        <div className="mb-4">
          <ul>
            {floorDetails.freeUnits.map(unit => (
              <li key={unit.id}>
                <strong>Unit Number:</strong> {unit.unitNumber}<br />
                <strong>Size:</strong> {unit.size} sq ft<br />
                <strong>Status:</strong> {unit.status}<br />
                <strong>Available Equipments:</strong>
                <ul>
                  {JSON.parse(unit.availableEquipments).map((equipment, index) => (
                    <li key={index}>{equipment}</li>
                  ))}
                </ul>
                <strong>Problems:</strong>
                <ul>
                  {JSON.parse(unit.problems).map((problem, index) => (
                    <li key={index}>{problem}</li>
                  ))}
                </ul>
                <strong>Rented Date:</strong> {new Date(unit.rentedDate).toLocaleDateString()}<br />
                <strong>Vacated Date:</strong> {new Date(unit.vacatedDate).toLocaleDateString()}<br />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Message when no free units are available
        <div className="text-gray-500 text-center">
          <p>No free units available for this floor.</p>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
          Close
        </button>
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
    </div>
  );
};

export default FloorManagement;
