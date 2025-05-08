import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const EmployeeComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComplaints(response.data || []);
      } catch (err) {
        console.error('Failed to fetch complaints', err);
      }
    };

    if (userId) {
      fetchComplaints();
    }
  }, [userId, token]);

  const filteredComplaints = complaints.filter(
    (c) =>
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.Tenant?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredComplaints.length / rowsPerPage);

  const openImageViewer = (image) => {
    setCurrentImage(image);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setZoomLevel(1);
    setIsImageViewerOpen(false);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 1));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assigned Complaints</h1>

      <div className="flex flex-wrap justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search complaints..."
          className="border p-2 rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded ml-4"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          {[5, 10, 20].map((num) => (
            <option key={num} value={num}>
              Show {num}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Description</th>
              <th className="p-2">Urgency</th>
              {/* <th className="p-2">Status</th> */}
              <th className="p-2">Tenant</th>
              <th className="p-2">Images</th>
            </tr>
          </thead>
          <tbody>
            {paginatedComplaints.map((complaint) => (
              <tr key={complaint.id} className="border-t">
                <td className="p-2">{complaint.description}</td>
                <td className="p-2 capitalize">{complaint.urgency}</td>
                {/* <td className="p-2 capitalize">{complaint.status}</td> */}
                <td className="p-2">
                  {complaint.Tenant?.fullName}
                </td>
                <td className="p-2 flex space-x-2">
                  {Array.isArray(complaint.images) && complaint.images.length > 0 ? (
                    complaint.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Complaint"
                        className="w-16 h-16 object-cover cursor-pointer rounded"
                        onClick={() => openImageViewer(img)}
                      />
                    ))
                  ) : (
                    <span>No Images</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">
          Page {currentPage} of {totalPages}
        </p>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded mr-2"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-[90vw] max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
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
            <div className="flex-1 overflow-auto">
              <img
                src={currentImage}
                alt="Zoomed Complaint"
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
