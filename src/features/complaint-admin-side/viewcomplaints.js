import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [complaintToAssign, setComplaintToAssign] = useState(null);
  const [complaintToUpdateStatus, setComplaintToUpdateStatus] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false); // Manage the modal visibility
  const [currentImage, setCurrentImage] = useState(null); // Store the clicked image URL
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const fetchComplaints = async () => {
     
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}complaints/all`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setComplaints(response.data);
      } catch (error) {
        setError('There was an error fetching the complaints data!');
        console.error('There was an error fetching the complaints data!', error);
      }finally { 
        setPageLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token'); // Get admin token from localStorage
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setEmployees(response.data.users); 
      } catch (error) {
        setError('There was an error fetching the employees data!');
        console.error('There was an error fetching the employees data!', error);
      }
    };

    fetchComplaints();
    fetchEmployees();
  }, []);

  // Handle delete button click
  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setIsDeleteModalOpen(true);
  };

  // Handle delete request
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token'); 
      await axios.delete(`${process.env.REACT_APP_BASE_URL}complaints/delete/${complaintToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setComplaints((prevComplaints) => prevComplaints.filter((complaint) => complaint.id !== complaintToDelete.id));
      setIsDeleteModalOpen(false);
      setComplaintToDelete(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Complaint deleted successfully');
    } catch (error) {
      setError('There was an error deleting the complaint!');
      console.error('There was an error deleting the complaint!', error);

      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete, please try again');
    }
  };

  // Handle assign button click
  const handleAssignClick = (complaint) => {
    setComplaintToAssign(complaint);
    setIsAssignModalOpen(true);
  };

  // Handle assign request
  const handleAssign = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Get admin token from localStorage
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}complaints/assign`, {
        complaintId: complaintToAssign.id,
        employeeId: employeeId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setComplaints((prevComplaints) => prevComplaints.map((complaint) =>
        complaint.id === complaintToAssign.id ? response.data.complaint : complaint
      ));
      setLoading(false);
      setIsAssignModalOpen(false);
      setComplaintToAssign(null);
      setEmployeeId('');

      setModalOpen(true);
      setMessageType('success');
      setMessage(' Assigned successfully');
    } catch (error) {
      // setError('There was an error assigning the complaint!');
      console.error('There was an error assigning the complaint!', error);
      setLoading(false);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to assign, please try again');
    }
  };

  // Handle update status button click
  const handleUpdateStatusClick = (complaint) => {
    setComplaintToUpdateStatus(complaint);
    setIsUpdateStatusModalOpen(true);
  };

  // Handle update status request
  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Get admin token from localStorage
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}complaints/update-status`, {
        complaintId: complaintToUpdateStatus.id,
        status: status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setComplaints((prevComplaints) => prevComplaints.map((complaint) =>
        complaint.id === complaintToUpdateStatus.id ? response.data.complaint : complaint
      ));
      setLoading(false);
      setIsUpdateStatusModalOpen(false);
      setComplaintToUpdateStatus(null);
      setStatus('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Status updated successfully');
    } catch (error) {
      // setError('There was an error updating the complaint status!');
      console.error('There was an error updating the complaint status!', error);
      setLoading(false);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update, please try again');
    }
  };

  const getEmployeeNameById = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    return employee ? employee.fname : 'Unassigned';
  };

  // Handle image click to open viewer
  const openImageViewer = (image) => {
    setCurrentImage(image);
    setIsImageViewerOpen(true);
  };

  // Close image viewer modal
  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setZoomLevel(1); // Reset zoom level when closed
  };

  // Zoom functions for image viewer
  const zoomIn = () => setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 3)); // Max zoom level
  const zoomOut = () => setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 1)); // Min zoom level

  // Render complaint images
  const renderImages = (images) => {
    try {
      const imageArray = JSON.parse(images);
      return imageArray.map((image, index) => (
        <img
          key={index}
          src={`https://apartment.bruktiethiotour.com/${image}`}
          alt={`Complaint Image ${index + 1}`}
          className="w-16 h-16 object-cover cursor-pointer"
          onClick={() => openImageViewer(`https://apartment.bruktiethiotour.com/${image}`)} // Open image viewer
        />
      ));
    } catch (error) {
      return 'No images available';
    }
  };

  // Columns for the TableComponent
  const columns = [
    // { label: 'ID', key: 'id' },
    { label: 'Assigned Employee', key: 'assignedEmployeeId', render: (row) => getEmployeeNameById(row.assignedEmployeeId) },
    { label: 'Complain Description', key: 'description' },
    { label: 'Urgency', key: 'urgency' },
    { label: 'Status', key: 'status' },
    { label: 'Tenant Feedback', key: 'tenantFeedback' },
    { label: 'Images', key: 'images', render: (row) => renderImages(row.images) },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className='flex space-x-1'>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white py-1 px-4 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleAssignClick(row)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Assign
          </button>
          <button
            onClick={() => handleUpdateStatusClick(row)}
            className="bg-green-400 text-white py-1 px-2 rounded"
          >
           Status
          </button>
        </div>
      ),
    },
  ];

  // Render images properly (since images are stored as a JSON string)

  

  return (
    <div>
      {pageLoading ? (<LoadingComponent/>):(
      
      <TableComponent
        title="Complaints List"
        data={complaints}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />
    )}
      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4 ">Are you sure you want to delete this complaint?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Assign Complaint to Staff</h2>
            <div className="mb-4">
              <label htmlFor="employeeId" className="block text-sm font-medium text-white-700">Select Employee</label>
              <select
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select an Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fname}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsAssignModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAssign} className="bg-blue-500 text-white px-4 py-2 rounded"
               disabled={loading}
              >
                {loading ? 'assigning...':'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isUpdateStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Update Complaint Status</h2>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-white-700">Select Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsUpdateStatusModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleUpdateStatus} className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
              >
                {loading ? 'updating..':'update'}
                </button>
              </div>
            </div>
          </div>
        )}

         {/* Image Viewer Modal */}
         {isImageViewerOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="relative bg-white p-4 rounded-lg max-w-[90vw] max-h-[90vh] flex flex-col">
          {/* Control Buttons */}
          <div className="flex justify-between items-center mb-4 z-10">
            <div className="flex space-x-2">
              <button
                onClick={zoomOut}
                className="text-white bg-gray-800 px-4 py-2 rounded-full"
              >
                Zoom Out
              </button>
              <button
                onClick={zoomIn}
                className="text-white bg-gray-800 px-4 py-2 rounded-full"
              >
                Zoom In
              </button>
            </div>
            <button
              onClick={closeImageViewer}
              className="text-white bg-gray-800 px-2 py-1 rounded-full"
            >
              X
            </button>
          </div>

          {/* Image Container */}
          <div className="flex-1 overflow-auto">
            <img
              src={currentImage}
              alt="Zoomed Image"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.3s ease',
                transformOrigin: 'center', 
              }}
              className="max-w-full max-h-[80vh] object-contain"
            />
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

export default ComplaintsPage;