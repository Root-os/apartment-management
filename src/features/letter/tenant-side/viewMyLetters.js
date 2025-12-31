import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from "../../../components/table";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";
import { CalendarContext } from '../../../context/calendarContext';
import api from '../../../utils/api';

const TenantLettersPage = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { formatDateForDisplay } = useContext(CalendarContext);

  const handleRespondClick = (letter) => {
  if (letter.hasResponse) {
   navigate('/app/tenant-view-response', {
    state: { letterId: letter.id, description: letter.description }
  });
  } else {
   navigate('/app/new-letter-response', {
  state: { letterId: letter.id, description: letter.description }
  });

  }
};
  // Decode tenant ID from JWT
  const getTenantIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      return decodedPayload?.id;
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  };
  const tenantId = getTenantIdFromToken();

  const fetchTenantLetters = async () => {
  try {
    const token = localStorage.getItem("token"); // get token from storage
    if (!token) {
      setMessage("No token found. Please login.");
      setMessageType("error");
      setModalOpen(true);
      return;
    }

    const response = await api.get(
      `letter/my-letters`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && response.data.data.length > 0) {
      const tenantLetters = response.data.data[0].letters.map((letter) => ({
        ...letter,
        formattedDate: letter.Date?.split("T")[0] || "N/A",
        hasResponse: (letter.letterResponses || []).length > 0,
      }));
      setLetters(tenantLetters);
    } else {
      setLetters([]);
    }
  } catch (error) {
    setMessage("Failed to fetch letters.");
    setMessageType("error");
    setModalOpen(true);
    console.error(error);
  }
};



  useEffect(() => {
    fetchTenantLetters();
  }, [tenantId]);

  const handleDetailClick = (letter) => {
    setSelectedLetter(letter);
    setIsDetailModalOpen(true);
  };

  const columns = [
    { key: "unitNumber", label: "Unit", render: (row) => row.unit?.unitNumber },
    { key: "letterTypeName", label: "Letter Type", render: (row) => row.letterType?.name },
    { key: "description", label: "Description" },
    { key: "formattedDate", label: "Date", isDate: true },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
      <button
        onClick={() => handleDetailClick(row)}
        className="bg-blue-500 text-white px-3 py-1 rounded-md"
      >
        View
      </button>
      <button
        onClick={() => handleRespondClick(row)}
        className="bg-green-500 text-white px-3 py-1 rounded-md"
      >
        Respond
      </button>
    </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6"> 
      <TableComponent
        title="My Letters"
        data={letters}
        columns={columns}
        exportable={false}
        showSearch={true}
      />
      {isDetailModalOpen && selectedLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-base-100 p-6 rounded-md w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Letter Details</h2>
            <p><strong>Type:</strong> {selectedLetter.letterType?.name || 'N/A'}</p>

           <p><strong>Date:</strong> {formatDateForDisplay(selectedLetter.Date) || 'N/A'}</p>
            <p><strong>Description:</strong> {selectedLetter.description}</p>
            <p><strong>Status:</strong> {selectedLetter.status}</p>
            <div className="flex justify-end mt-4">
            <button
            onClick={() => setIsDetailModalOpen(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
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

export default TenantLettersPage;
