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
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false); // Manage the modal visibility
  const [currentImage, setCurrentImage] = useState(null); // Store the clicked image URL
  const [zoomLevel, setZoomLevel] = useState(1);

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
        setLoading(false); // Stop loading on error
      }
    };

    fetchComplaints();
  }, [tenantId]); // Run when tenantId changes

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
      setMessage('Confirmation sent successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to send confirmation.');
    } finally {
      setIsLoading(false);
    }
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

  // Columns for TableComponent
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

  // Loading component while data is fetched
  if (loading) {
    return <LoadingComponent />;
  }

  const handleAddClick = () => {
    window.location.href = '/app/complain-tenant-add';
  };

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
        onAdd={handleAddClick}
      />

      {/* Confirm Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Confirm Complaint Resolution</h2>
            <div className="mb-4">
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
            transformOrigin: 'center', // Ensures zoom is centered
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

export default TenantComplaintsPage;
