import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [contractTerms, setContractTerms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}vendors`)
      .then((response) => {
        setVendors(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the vendors:", error);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}service-type`)
      .then((response) => {
        setServiceTypes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the service types:", error);
      });
  }, []);

  // Handle edit button click
  const handleEditClick = (vendor) => {
    setSelectedVendor(vendor);
    setFname(vendor.fname);
    setLname(vendor.lname);
    setPhone(vendor.phone);
    setEmail(vendor.email);
    setAddress(vendor.address);
    setServiceTypeId(vendor.serviceTypeId);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsDeleteModalOpen(true);
  };

  // Handle detail button click
  const handleDetailClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsDetailModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("serviceTypeId", serviceTypeId);
    if (contractTerms) {
      formData.append("contractTerms", contractTerms);
    }
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}vendors/${selectedVendor.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedData = vendors.map((vendor) =>
        vendor.id === selectedVendor.id ? response.data : vendor
      );
      setVendors(updatedData);
      setIsEditModalOpen(false);
      setSelectedVendor(null);

      setModalOpen(true);
      setMessageType("success");
      setMessage("Vendor updated successfully");
    } catch (error) {
      setModalOpen(true);
      setMessageType("error");
      setMessage("Unable to update vendor");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}vendors/${selectedVendor.id}`
      );
      setVendors(vendors.filter((vendor) => vendor.id !== selectedVendor.id));
      setIsDeleteModalOpen(false);
      setSelectedVendor(null);

      setModalOpen(true);
      setMessageType("success");
      setMessage("Vendor deleted successfully");
    } catch (error) {
      setModalOpen(true);
      setMessageType("error");
      setMessage("Unable to delete vendor");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Full Name",
      render: (row) => `${row.fname} ${row.lname}`,
    },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    {
      key: "ServiceType.name",
      label: "Service Type",
      render: (row) => row.ServiceType?.name,
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium min-w-[80px] w-full md:w-auto"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium min-w-[80px] w-full md:w-auto"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(row)}
            className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium min-w-[80px] w-full md:w-auto"
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <TableComponent
        title="Vendors List"
        data={vendors}
        columns={columns}
        exportable={true}
        showSearch={true}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="mt-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="bg-base-100 p-6 rounded-md w-full max-w-lg mx-4 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Vendor</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="fname"
                  className="block text-sm font-medium text-white-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="fname"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lname"
                  className="block text-sm font-medium text-white-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lname"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white-700"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-white-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="serviceTypeId"
                  className="block text-sm font-medium text-white-700"
                >
                  Service Type
                </label>
                <select
                  id="serviceTypeId"
                  value={serviceTypeId}
                  onChange={(e) => setServiceTypeId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Service Type
                  </option>
                  {serviceTypes.map((serviceType) => (
                    <option key={serviceType.id} value={serviceType.id}>
                      {serviceType.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contractTerms"
                  className="block text-sm font-medium text-white-700"
                >
                  Contract Terms (PDF/DOC) (Optional)
                </label>
                <input
                  type="file"
                  id="contractTerms"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setContractTerms(e.target.files[0])}
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete this vendor?
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="bg-base-100 p-6 rounded-md w-full max-w-lg mx-4 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <h2 className="text-2xl font-bold mb-4">Vendor Details</h2>
            <div className="mb-4">
              <p>
                <strong>Full Name:</strong> {selectedVendor.fname}{" "}
                {selectedVendor.lname}
              </p>
              <p>
                <strong>Phone:</strong> {selectedVendor.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedVendor.email}
              </p>
              <p>
                <strong>Address:</strong> {selectedVendor.address}
              </p>
              <p>
                <strong>Service Type:</strong>{" "}
                {selectedVendor.ServiceType?.name}
              </p>
              <p>
  <strong>Contract Terms:</strong>{" "}
  {selectedVendor.contractTerms ? (
    <a
    href={`${
      selectedVendor.contractTerms.includes("http")
        ? selectedVendor.contractTerms
        : `${process.env.REACT_APP_BASE}/${selectedVendor.contractTerms}`
    }`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:text-blue-800 underline"
  >
    See Document
  </a>
  
  ) : (
    "No document available"
  )}
</p>

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

export default VendorsPage;