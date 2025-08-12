import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table"; // adjust path if needed
import Modal from "../../components/Modal"; // Assuming you have a Modal component

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [modalMessageType, setModalMessageType] = useState("success");
  const [modalOpen, setModalOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}booking`);
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setModalMessage("Failed to fetch bookings");
      setModalMessageType("error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsDetailModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedBooking(null);
    setModalMessage(null);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}booking/${selectedBooking.id}`);
      setBookings(bookings.filter((b) => b.id !== selectedBooking.id));
      setModalMessage("Booking deleted successfully");
      setModalMessageType("success");
      setModalOpen(true);
      setIsDeleteModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      setModalMessage("Failed to delete booking");
      setModalMessageType("error");
      setModalOpen(true);
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: "Unit.unitNumber",
      label: "Unit Number",
      render: (row) => row.Unit?.unitNumber || "N/A",
    },
    { key: "fullName", label: "Full Name" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "email", label: "Email" },
    {
      key: "startDate",
      label: "Start Date",
      render: (row) => new Date(row.startDate).toISOString().split('T')[0],
    },
    {
      key: "endDate",
      label: "End Date",
      render: (row) => new Date(row.endDate).toISOString().split('T')[0],
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <>
          <button
            onClick={() => openDetailModal(row)}
            className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
          >
            Detail
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <TableComponent
          title="Bookings"
          data={bookings}
          columns={columns}
          exportable={true}
          showSearch={true}
        />
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Booking Details (ID: {selectedBooking.id})
            </h2>
            <p>
              <strong>Full Name:</strong> {selectedBooking.fullName}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedBooking.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.email}
            </p>
            <p>
              <strong>Unit Number:</strong> {selectedBooking.Unit?.unitNumber || "N/A"}
            </p>
            <p>
              <strong>Unit Size:</strong> {selectedBooking.Unit?.size || "N/A"} sqm
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
                { new Date(selectedBooking.startDate).toISOString().split('T')[0]}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
            { new Date(selectedBooking.endDate).toISOString().split('T')[0]}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModals}
                className="bg-gray-500 px-4 py-2 rounded text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete booking ID {selectedBooking.id}?
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModals}
                className="bg-gray-500 px-4 py-2 rounded text-white hover:bg-gray-600"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for messages */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={modalMessageType}
        message={modalMessage}
      />
    </div>
  );
};

export default BookingPage;
