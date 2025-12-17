import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import api from '../../utils/api';

const TenantComplaintsPage = () => {
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

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get(`complaints/tenant/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError('There was an error fetching the complaints data!');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userId]);

  const handleConfirmClick = (complaint) => {
    setComplaintToConfirm(complaint);
    setIsConfirmModalOpen(true);
  };

 const handleConfirm = async () => {
  setIsLoading(true);
  try {
    const response = await api.put(
      `complaints/confirm-resolution`,
      {
        complaintId: complaintToConfirm.id,
        feedback: feedback,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Find existing complaint before update
    const existingComplaint = complaints.find(
      (c) => c.id === complaintToConfirm.id
    );

    const updatedComplaint = {
      ...existingComplaint, // preserve existing
      ...response.data.complaint, // apply updated data
      images:
        response.data.complaint.images && response.data.complaint.images.length > 0
          ? response.data.complaint.images
          : existingComplaint.images, // preserve old images if missing or empty
    };

    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint.id === complaintToConfirm.id ? updatedComplaint : complaint
      )
    );

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
  const openImageViewer = (image) => {
    setCurrentImage(image);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel((z) => Math.min(z + 0.1, 3));
  const zoomOut = () => setZoomLevel((z) => Math.max(z - 0.1, 1));

  const renderImages = (images) => {
    if (!Array.isArray(images) || images.length === 0) {
      return 'No images available';
    }

    return images.map((image, index) => (
      <img
        key={index}
        src={image}
        alt={`Complaint Image ${index + 1}`}
        className="w-16 h-16 object-cover cursor-pointer"
        onClick={() => openImageViewer(image)}
      />
    ));
  };
   const renderEmployeeName = (row) => {
    if (row.assignedEmployee) {
      return `${row.assignedEmployee.fname} ${row.assignedEmployee.lname}`; // e.g., "sura asm"
    }
    return 'Unassigned'; // Default if no employee is assigned
  };

  const columns = [
    { label: 'Description', key: 'description' },
    { label: 'Urgency', key: 'urgency' },
     {
      label: 'Assigned Person',
      key: 'assignedEmployeeId',
      render: (row) => renderEmployeeName(row),
    },
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

  const handleAddClick = () => {
    window.location.href = '/app/complain-tenant-add';
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}

      <TableComponent
        title="Your Complaints"
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
              <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
            <div className="flex justify-between items-center mb-4 z-10">
              <div className="flex space-x-2">
                <button onClick={zoomOut} className="text-white bg-gray-800 px-4 py-2 rounded-full">Zoom Out</button>
                <button onClick={zoomIn} className="text-white bg-gray-800 px-4 py-2 rounded-full">Zoom In</button>
              </div>
              <button onClick={closeImageViewer} className="text-white bg-gray-800 px-2 py-1 rounded-full">X</button>
            </div>
            <div className="flex-1 overflow-auto">
              <img
                src={currentImage}
                alt="Zoomed"
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

export default TenantComplaintsPage;
