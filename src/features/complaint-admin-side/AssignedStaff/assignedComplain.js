import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import TableComponent from '../../../components/table';
import LoadingComponent from '../../../components/loading';


const EmployeeComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}complaints/assigned/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(response.data || []);
      } catch (err) {
        console.error('Failed to fetch complaints', err);
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchComplaints();
  }, [userId, token]);

  const openImageViewer = (image) => {
    setCurrentImage(image);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setZoomLevel(1);
    setIsImageViewerOpen(false);
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
        className="w-16 h-16 object-cover cursor-pointer rounded"
        onClick={() => openImageViewer(image)}
      />
    ));
  };

  const columns = [
    { label: 'Description', key: 'description' },
    { label: 'Urgency', key: 'urgency' },
    {
      label: 'Tenant',
      key: 'tenant',
      render: (row) => row.Tenant?.fullName || 'Unknown Tenant',
    },
    {
      label: 'Images',
      key: 'images',
      render: (row) => renderImages(row.images),
    },
  ];

  if (loading) return <LoadingComponent />;

  return (
    <div>
      {error && <div className="text-red-500 p-4">{error}</div>}

      <TableComponent
        title="Assigned Complaints"
        data={complaints}
        columns={columns}
        rowsPerPageOptions={[5, 10, 20]}
        showSearch={true}
        exportable={true}
      />

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
    </div>
  );
};

export default EmployeeComplaints;
