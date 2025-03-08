import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';


const TenantComplaintsPage = ({ tenantId }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [complaintToConfirm, setComplaintToConfirm] = useState(null);
  const [feedback, setFeedback] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success')
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchComplaints = async () => {
      console.log('Fetching complaints for tenant:', userId);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}complaints/tenant/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComplaints(response.data);  
        setLoading(false);  
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError('There was an error fetching the complaints data!');
        setLoading(false);  // Stop loading on error
      }
    };

    fetchComplaints();
  }, [tenantId]);  // Run when tenantId changes

  // Handle confirm button click
  const handleConfirmClick = (complaint) => {
    setComplaintToConfirm(complaint);
    setIsConfirmModalOpen(true);
  };

  // Handle feedback submission
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}complaints/confirm-resolution`, {
        complaintId: complaintToConfirm.id,
        feedback: feedback,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setComplaints((prevComplaints) => prevComplaints.map((complaint) =>
        complaint.id === complaintToConfirm.id ? response.data.complaint : complaint
      ));
      setIsConfirmModalOpen(false);
      setComplaintToConfirm(null);
      setFeedback('');
      setLoading(false);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Confirmation send successfully');
    } catch (error) {
      setModalOpen(true)
      setMessageType('error')
      setMessage('Unable to send confirmation.');
    }finally{setIsLoading(false);}
  };

  // Columns for the TableComponent
  const columns = [
    { label: 'Description', key: 'description' },
    { label: 'Urgency', key: 'urgency' },
    { label: 'Status', key: 'status' },
    { label: 'Images', key: 'images', render: (row) => renderImages(row.images) },
    { label: 'Tenant Feedback', key: 'tenantFeedback' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => handleConfirmClick(row)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Confirm
        </button>
      ),
    },
  ];

  // Render images properly (since images are stored as a JSON string)
  const renderImages = (images) => {
    try {
      const imageArray = JSON.parse(images);
      return imageArray.length > 0
        ? imageArray.map((image, index) => (
            <img
              key={index}
              src={`https://apartment.houseethiopia.com/${image}`}
              alt={`Complaint Image ${index + 1}`}
              className="w-16 h-16 object-cover"
            />
          ))
        : 'No images available';
    } catch (error) {
      return 'Error loading images';
    }
  };

  if (loading) {
    return <LoadingComponent/>;
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <TableComponent
        title={`Complaints for Tenant ${tenantId}`}
        data={complaints}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

      {/* Confirm Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Confirm Complaint Resolution</h2>
            <div className="mb-4">
              {/* <label htmlFor="feedback" className="block text-sm font-medium text-white-700">Select Feedback</label> */}
              <select
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Feedback</option>
                <option value="satisfied">Satisfied</option>
                <option value="not_satisfied">Not Satisfied</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsConfirmModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
              >
               {isLoading ? 'Confirming...' : 'Confirm'} 
              </button>
            </div>
          </div>
        </div>
      )}

   < Modal
      isOpen={modalOpen}
      onClose={()=> setModalOpen(false)}
      messageType={messageType}
      message={message}
      />
    </div>
  );
};

export default TenantComplaintsPage;