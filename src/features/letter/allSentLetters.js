import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { CalendarContext } from '../../context/calendarContext';
import SmartDateInput from '../../components/Common/smartDatePicker';



const AllSendLetterPage = () => {
  const [letters, setLetters] = useState([]);
  const [letterTypes, setLetterTypes] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [letterTypeId, setLetterTypeId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const { formatDateForDisplay } = useContext(CalendarContext);

  useEffect(() => {
  const handleClick = () => setOpenDropdownId(null);
  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, []);

  
  const fetchLetters = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}letter`)
      .then((response) => {
        const formattedLetters = response.data.map((letter) => ({
          ...letter,
          letterDate: letter.letterDate ? new Date(letter.letterDate).toISOString().split('T')[0] : "",
        }));
        setLetters(formattedLetters);
      })
      .catch((error) => {
        console.error("There was an error fetching the letters:", error);
      });
  };

  useEffect(() => {
    fetchLetters();
    axios
      .get(`${process.env.REACT_APP_BASE_URL}letter-type`)
      .then((response) => setLetterTypes(response.data))
      .catch((error) => console.error("Error fetching letter types:", error));
    axios
      .get(`${process.env.REACT_APP_BASE_URL}tenant`)
      .then((response) => setTenants(response.data))
      .catch((error) => console.error("Error fetching tenants:", error));
  }, []);

  const handleEditClick = (letter) => {
    setSelectedLetter(letter);
    setLetterTypeId(letter.letterTypeId.toString());
    setTenantId(letter.tenantId.toString());
    setLetterDate(letter.Date ? letter.Date.split("T")[0] : "");
    setDescription(letter.description);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleDeleteClick = (letter) => {
    setSelectedLetter(letter);
    setIsDeleteModalOpen(true);
  };

  const handleDetailClick = (letter) => {
    setSelectedLetter(letter);
    setIsDetailModalOpen(true);
    setIsEditModalOpen(false);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedLetter = {
        letterTypeId: parseInt(letterTypeId),
        tenantId: parseInt(tenantId),
        letterDate: letterDate,
        description: description,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}letter/${selectedLetter.id}`,
        updatedLetter
      );
      const updatedLetterType = letterTypes.find((lt) => lt.id === parseInt(letterTypeId));
      const updatedTenant = tenants.find((t) => t.id === parseInt(tenantId));
      const updatedLetterWithRelations = {
        ...response.data.letter,
        LetterType: updatedLetterType || selectedLetter.LetterType,
        Tenant: updatedTenant || selectedLetter.Tenant,
      };
      setLetters(letters.map((letter) =>
        letter.id === selectedLetter.id ? updatedLetterWithRelations : letter
      ));
      setIsEditModalOpen(false);
      setSelectedLetter(null);
      setModalOpen(true);
      setMessageType("success");
      setMessage(response.data.message || "Letter updated successfully");
    } catch (error) {
      setModalOpen(true);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Unable to update letter");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
     await axios.delete(`${process.env.REACT_APP_BASE_URL}letter/${selectedLetter.id}`);
      fetchLetters();
      setIsDeleteModalOpen(false);
      setSelectedLetter(null);
      setMessageType("success");
      setMessage("Letter deleted successfully");
    } catch (error) {
      setMessageType("error");
      setMessage("Unable to delete letter");
    } finally {
      setLoading(false);
    }
  };

 const handleRespondClick = (letter) => {
  navigate(`/app/letter-response/${letter.id}`);
};


  const handleGeneratePdf = (letter) => {
    navigate("/app/letters-in-pdf", { state: { letterDetails: letter } });
  };

  const columns = [
    { key: "LetterType.name", label: "Letter Type", render: (row) => row.LetterType?.name },
    { key: "Tenant.fullName", label: "Tenant", render: (row) => row.Tenant?.fullName },
    { key: "description", label: "Description" },
 {
  label: "Actions",
  key: "actions",
  render: (row) => (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpenDropdownId(openDropdownId === row.id ? null : row.id)}
        className="text-blue-600 font-medium hover:underline inline-flex items-center"
      >
        Actions <span className="ml-1">▼</span>
      </button>

      {openDropdownId === row.id && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button
            onClick={() => { handleEditClick(row); setOpenDropdownId(null); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => { handleDeleteClick(row); setOpenDropdownId(null); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => { handleDetailClick(row); setOpenDropdownId(null); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Detail
          </button>
          <button
            onClick={() => { handleGeneratePdf(row); setOpenDropdownId(null); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-indigo-600"
          >
            Letter
          </button>
          <button
            onClick={() => { handleRespondClick(row); setOpenDropdownId(null); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-green-600"
          >
            Response
          </button>
        </div>
      )}
    </div>
  )
}


  ];

  const handleAddClick = () => {
    window.location.href = "/app/send-Letter";
  };

  return (
    <div className="container mx-auto p-6">
      <TableComponent
        title="Letters List"
        data={letters}
        columns={columns}
        exportable={true}
        showSearch={true}
        onAdd={handleAddClick}
      />

      {isEditModalOpen && (
        <div className="mt-20 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-base-100 p-6 rounded-md w-full max-w-lg md:max-w-2xl lg:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Letter</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="letterTypeId" className="block text-sm font-medium text-white-700">
                  Letter Type
                </label>
                <select
                  id="letterTypeId"
                  value={letterTypeId}
                  onChange={(e) => setLetterTypeId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Letter Type</option>
                  {letterTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="tenantId" className="block text-sm font-medium text-white-700">
                  Tenant
                </label>
                <select
                  id="tenantId"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>{tenant.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="letterDate" className="block text-sm font-medium text-white-700">
                  Date
                </label>
                <SmartDateInput
                  id="letterDate"
                  value={letterDate}
                  onChange={(gcDate) => setLetterDate(gcDate)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-white-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete this letter?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-base-100 p-6 rounded-md w-full max-w-lg md:max-w-2xl lg:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Letter Details</h2>
            <div className="mb-4 space-y-2">
              <p><strong>Letter Type:</strong> {selectedLetter.LetterType.name}</p>
              <p><strong>Tenant:</strong> {selectedLetter.Tenant.fullName}</p>
              <p><strong>Description:</strong> {selectedLetter.description}</p>
              <p><strong>Date:</strong> {selectedLetter.Date ? formatDateForDisplay(selectedLetter.Date) : '-'}</p>
              <p><strong>Status:</strong> {selectedLetter.status}</p>
              <p><strong>Tenant Phone:</strong> {selectedLetter.Tenant.phoneNumber}</p>
              <p><strong>Tenant Email:</strong> {selectedLetter.Tenant.email}</p>
              <p><strong>Tenant National ID:</strong> {selectedLetter.Tenant.nationalId}</p>
              {/* <p><strong>Lease Start:</strong> {new Date(selectedLetter.Tenant.leaseStartDate).toISOString().split('T')[0]}</p>
              <p><strong>Lease End:</strong> {new Date(selectedLetter.Tenant.leaseEndDate).toISOString().split('T')[0]}</p> */}
              <p><strong>Payment Status:</strong> {selectedLetter.Tenant.paymentStatus}</p>
              <p><strong>Additional Notes:</strong> {selectedLetter.Tenant.additionalNotes}</p>
              <p><strong>Advance:</strong> {selectedLetter.Tenant.advance}</p>
              <p><strong>TIN:</strong> {selectedLetter.Tenant.tin}</p>
            </div>
            <div className="flex justify-end">
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

export default AllSendLetterPage;