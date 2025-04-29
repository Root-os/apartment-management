import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import {FaSearch} from 'react-icons/fa';
import Modal from '../../components/Modal';
import LoadingComponent from "../../components/loading";

const UnitList = () => {
  const [units, setUnits] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false)
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitDetails, setUnitDetails] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [selectedStatus, setSelectedStatus] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);

  const [newUnitData, setNewUnitData] = useState({
    unitNumber: '',
    size: '',
    status: '',
    availableEquipments: [],
    problems: [],
    rentedDate: '',
    vacatedDate: '',
    floorId: ''
  });
  const [newEquipment, setNewEquipment] = useState("");
  const [newProblem, setNewProblem] = useState("");

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}unit`);
        setUnits(response.data); 
        setLoading(false); 
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false); 
      }
    };

    const fetchFloorData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor`);
        setFloors(response.data);
      } catch (err) {
        console.error("Failed to fetch floors.");
      }
    };

    fetchUnitData();
    fetchFloorData();
  }, []);

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    setNewUnitData({
      unitNumber: unit.unitNumber,
      size: unit.size,
      status: unit.status,
      availableEquipments: Array.isArray(unit.availableEquipments) ? unit.availableEquipments : JSON.parse(unit.availableEquipments),
      problems: Array.isArray(unit.problems) ? unit.problems : JSON.parse(unit.problems),
      // rentedDate: unit.rentedDate,
      // vacatedDate: unit.vacatedDate,
      floorId: unit.floorId
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    setBtnLoading(true);
    axios.put(`${process.env.REACT_APP_BASE_URL}unit/${selectedUnit.id}`, newUnitData)
      .then(() => {
        setUnits(units.map(unit => (unit.id === selectedUnit.id ? { ...unit, ...newUnitData } : unit)));
        setIsEditModalOpen(false);

        setModalOpen(true);
        setMessageType('success');
        setMessage('Unit updated successfully');

        setBtnLoading(false);
      })
      .catch(error => {
        setBtnLoading(false);
        // console.error("Error updating unit:", error);

        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to update, please try again');  
      });
  };

  const handleDeleteClick = (unit) => {
    setSelectedUnit(unit);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    axios.delete(`${process.env.REACT_APP_BASE_URL}unit/${selectedUnit.id}`)
      .then(() => {
        setUnits(units.filter(unit => unit.id !== selectedUnit.id));
        setFilteredUnits(filteredUnits.filter(unit => unit.id !== selectedUnit.id));
        setIsDeleteModalOpen(false);

        setModalOpen(true);
        setMessageType('success');
        setMessage('Unit deleted successfully');
      })
      .catch(error => {
        console.error("Error deleting unit:", error);
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to delete, please try again');
      });
  };

  const handleAddEquipment = () => {
    if (newEquipment.trim() !== "") {
      setNewUnitData({
        ...newUnitData,
        availableEquipments: [...newUnitData.availableEquipments, newEquipment]
      });
      setNewEquipment("");
    }
  };

  const handleRemoveEquipment = (index) => {
    const updatedEquipments = newUnitData.availableEquipments.filter((_, i) => i !== index);
    setNewUnitData({ ...newUnitData, availableEquipments: updatedEquipments });
  };

  const handleAddProblem = () => {
    if (newProblem.trim() !== "") {
      setNewUnitData({
        ...newUnitData,
        problems: [...newUnitData.problems, newProblem]
      });
      setNewProblem("");
    }
  };

  const handleRemoveProblem = (index) => {
    const updatedProblems = newUnitData.problems.filter((_, i) => i !== index);
    setNewUnitData({ ...newUnitData, problems: updatedProblems });
  };

  const handleEquipmentChange = (index, value) => {
    const updatedEquipments = [...newUnitData.availableEquipments];
    updatedEquipments[index] = value;
    setNewUnitData({ ...newUnitData, availableEquipments: updatedEquipments });
  };

  const handleProblemChange = (index, value) => {
    const updatedProblems = [...newUnitData.problems];
    updatedProblems[index] = value;
    setNewUnitData({ ...newUnitData, problems: updatedProblems });
  };

  const handleDetailClick = async (unit) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}unit/floor/${unit.floorId}`);
      setUnitDetails(response.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching unit details:", error);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus((prevStatus) => {
      if (prevStatus.includes(status)) {
        return prevStatus.filter((s) => s !== status);
      } else {
        return [...prevStatus, status];
      }
    });
  };

  const floorLookup = floors.reduce((acc, floor) => {
    acc[floor.id] = floor.floorNumber;
    return acc;
  }, {});
  
  const handleSearchClick = async () => {
    try {
      let response;
      if (selectedStatus.includes("free") && selectedStatus.includes("rented")) {
        response = await axios.get(`${process.env.REACT_APP_BASE_URL}unit`);
      } else if (selectedStatus.includes("free")) {
        response = await axios.get(`${process.env.REACT_APP_BASE_URL}unit/free/units`);
      } else if (selectedStatus.includes("rented")) {
        response = await axios.get(`${process.env.REACT_APP_BASE_URL}unit/rented/units`);
      } else {
        response = await axios.get(`${process.env.REACT_APP_BASE_URL}unit`);
      }
      setFilteredUnits(response.data);
    } catch (error) {
      console.error("Error fetching filtered units:", error);
    }
  };

  const StatusFilter = ({ selectedStatus, onStatusChange, onSearchClick }) => (
    <div className="flex items-center mb-4">
        <button
      className={`mr-2 px-4 py-2 rounded ${selectedStatus.includes("free") ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
      onClick={() => onStatusChange("free")}
    >
      Free
    </button>
    <button
      className={`mr-2 px-4 py-2 rounded ${selectedStatus.includes("rented") ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
      onClick={() => onStatusChange("rented")}
    >
      Rented
    </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onSearchClick}
      >
        <FaSearch/> {/* Assuming you have FontAwesome or similar for the search icon */}
      </button>
    </div>
  );

  const columns = [
    {
      Header: "Unit Number",
      accessor: "unitNumber",
    },
    {
      Header: "Size (sq.m)",
      accessor: "size",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Available Equipments",
      accessor: "availableEquipments",
      Cell: ({ value }) => {
        const equipments = Array.isArray(value) ? value : JSON.parse(value);
        return <ul>{equipments.map((item, index) => <li key={index}>{item}</li>)}</ul>;
      },
    },
    {
      Header: "Problems",
      accessor: "problems",
      Cell: ({ value }) => {
        const problems = Array.isArray(value) ? value : JSON.parse(value);
        return <ul>{problems.map((item, index) => <li key={index}>{item}</li>)}</ul>;
      },
    },
    {
      Header: "Floor",
      accessor: "floorId",
      Cell: ({ value }) => floorLookup[value] || "N/A",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white py-1 px-4 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(row)}
             className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Details
          </button>
        </div>
      ),
    },
  ];

const handleAddClick = () => {  window.location.href = '/app/unit-add';};

  return (
    <div>
      {loading ? (
        <LoadingComponent/>
      ) :(
       <>
        <TableComponent
           title="Unit List"
           data={filteredUnits.length > 0 ? filteredUnits : units}
           columns={columns.map(col => ({
           key: col.accessor,
           label: col.Header,
           render: col.Cell ? (row) => col.Cell({ value: row[col.accessor], row }) : undefined
          }))}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
          customHeader={<StatusFilter selectedStatus={selectedStatus} onStatusChange={handleStatusChange} onSearchClick={handleSearchClick} />}
          onAdd={handleAddClick}
        />
     </> 
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Unit</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Unit Number</label>
              <input
                type="text"
                value={newUnitData.unitNumber}
                onChange={(e) => setNewUnitData({ ...newUnitData, unitNumber: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Size (sq.m)</label>
              <input
                type="number"
                value={newUnitData.size}
                onChange={(e) => setNewUnitData({ ...newUnitData, size: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                 min="1"                
                 step="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newUnitData.status}
                onChange={(e) => setNewUnitData({ ...newUnitData, status: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>Select Status</option>
                <option value="occupied">Occupied</option>
                <option value="available">Free</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Available Equipments</label>
              {newUnitData.availableEquipments.map((equipment, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => handleEquipmentChange(index, e.target.value)}
                    className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEquipment(index)}
                    className="ml-2 bg-red-500 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder="Enter equipment"
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={handleAddEquipment}
                  className="ml-2 bg-blue-500 text-white p-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Problems</label>
              {newUnitData.problems.map((problem, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={problem}
                    onChange={(e) => handleProblemChange(index, e.target.value)}
                    className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveProblem(index)}
                    className="ml-2 bg-red-500 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  placeholder="Enter problem"
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={handleAddProblem}
                  className="ml-2 bg-blue-500 text-white p-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rented Date</label>
              <input
                type="date"
                value={new Date(newUnitData.rentedDate).toISOString().split("T")[0]}
                onChange={(e) => setNewUnitData({ ...newUnitData, rentedDate: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div> */}
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Vacated Date</label>
              <input
                type="date"
                value={new Date(newUnitData.vacatedDate).toISOString().split("T")[0]}
                onChange={(e) => setNewUnitData({ ...newUnitData, vacatedDate: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Floor</label>
              <select
                value={newUnitData.floorId}
                onChange={(e) => setNewUnitData({ ...newUnitData, floorId: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                {floors.map(floor => (
                  <option key={floor.id} value={floor.id}>{floor.floorNumber}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleEditSubmit} className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={btnLoading}
               >
                {btnLoading ? 'saving...':'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this unit?</h2>
            <div className="flex justify-end space-x-1">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && unitDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto min-w-[72vh] ">
            <h2 className="text-xl mb-4">Unit Details</h2>
            {/* <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Available Units</label>
              <p>{unitDetails.availableUnits}</p>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Occupied Units</label>
              <p>{unitDetails.occupiedUnits}</p>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Under Maintenance</label>
              <p>{unitDetails.under_maintenance}</p>
            </div>
          </div> */}
            <div className="mb-4">
              {/* <label className="block text-sm font-medium mb-2">Units</label> */}
              <ul>
                {unitDetails.units.map(unit => (
                  <li key={unit.id}>
                    <strong className="text-blue-600" >Unit Number:</strong> {unit.unitNumber}<br />
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
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
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

export default UnitList;