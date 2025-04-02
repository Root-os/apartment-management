import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/card';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const ServiceTypesPage = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}service-type`)
      .then((response) => {
        setServiceTypes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the service types:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Handle edit button click
  const handleEditClick = (serviceType) => {
    setSelectedServiceType(serviceType);
    setName(serviceType.name);
    setDescription(serviceType.description);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (serviceType) => {
    setSelectedServiceType(serviceType);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedServiceType = {
        name,
        description,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}service-type/${selectedServiceType.id}`,
        updatedServiceType
      );
      const updatedData = serviceTypes.map((serviceType) =>
        serviceType.id === selectedServiceType.id ? response.data : serviceType
      );
      setServiceTypes(updatedData);
      setIsEditModalOpen(false);
      setSelectedServiceType(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Service type updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update service type');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}service-type/${selectedServiceType.id}`
      );
      setServiceTypes(
        serviceTypes.filter((serviceType) => serviceType.id !== selectedServiceType.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedServiceType(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Service type deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete service type');
    } finally {
      setLoading(false);
    }
  };

  // Filter service types based on search query
  const filteredServiceTypes = serviceTypes.filter((serviceType) =>
    serviceType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
      <h1 className="text-3xl font-bold">Service Types</h1>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search Service Types"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
           className="mt-4 bg-base-100 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredServiceTypes.length > 0 ? (
            filteredServiceTypes.map((serviceType) => (
              <Card
                key={serviceType.id}
                title={serviceType.name}
                content={serviceType.description}
                actions={[
                  {
                    label: 'Edit',
                    type: 'primary',
                    onClick: () => handleEditClick(serviceType),
                  },
                  {
                    label: 'Delete',
                    type: 'secondary',
                    onClick: () => handleDeleteClick(serviceType),
                  },
                ]}
              />
            ))
          ) : (
            <p className="text-white">No service types found</p>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Service Type</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white-700">
                  Service Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                >
                  Save
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
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this service type?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
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

export default ServiceTypesPage;
