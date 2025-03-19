import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';  // Modal component for success/error messages

const CurrencySettingsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [formData, setFormData] = useState({
    buildingName: '',
    buildingAddress: '',
    email: '',
    phoneNumber: '',
    postOfficeAddress: '',
    logo: null, // New field for logo
    seal: null, // New field for seal
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.REACT_APP_BASE_URL}setting`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (setting) => {
    setSelectedSetting(setting);
    setFormData({
      buildingName: setting.buildingName,
      buildingAddress: setting.buildingAddress,
      email: setting.email,
      phoneNumber: setting.phoneNumber,
      postOfficeAddress: setting.postOfficeAddress,
      logo: null, // Reset the logo to null
      seal: null, // Reset the seal to null
    });
    setIsEditModalOpen(true);
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: file, // Update either logo or seal with the selected file
      }));
    }
  };

  const handleEditSubmit = () => {
    setButtonLoading(true);
    const token = localStorage.getItem('token');
    const formDataToSubmit = new FormData();
    
    // Append all fields
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key]);
    });

    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}setting/${selectedSetting.id}`,
        formDataToSubmit,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important to handle file uploads
          },
        }
      )
      .then(() => {
        setData(
          data.map((item) =>
            item.id === selectedSetting.id ? { ...item, ...formData } : item
          )
        );
        setIsEditModalOpen(false);
        setModalOpen(true);
        setMessageType('success');
        setMessage('Setting updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating setting:', error);
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to update setting.');
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  // Handle Delete Click
  const handleDeleteClick = (setting) => {
    setSelectedSetting(setting);
    setIsDeleteModalOpen(true); // Open delete confirmation modal
  };

  // Confirm Delete Action
  const handleDeleteConfirm = () => {
    setButtonLoading(true);
    const token = localStorage.getItem('token');
    
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}setting/${selectedSetting.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(() => {
        setData(data.filter((item) => item.id !== selectedSetting.id));
        setIsDeleteModalOpen(false); // Close delete modal
        setModalOpen(true);
        setMessageType('success');
        setMessage('Setting deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting setting:', error);
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to delete setting.');
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  const columns = [
    { key: 'buildingName', label: 'Building Name' },
    { key: 'buildingAddress', label: 'Building Address' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'postOfficeAddress', label: 'Post Office Address' },
    {
      key: 'logos',
      label: 'Logo',
      render: (value) => (
        <img
          src={`https://apartment.bruktiethiotour.com/${value}`}
          alt="Logo"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    {
      key: 'seal',
      label: 'Seal',
      render: (value) => (
        <img
          src={`https://apartment.bruktiethiotour.com/${value}`}
          alt="Seal"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (setting) => (
        <div className='flex justify-end space-x-2'>
          <button
            onClick={() => handleEditClick(setting)}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(setting)} // Trigger delete confirmation
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingComponent />;

  return (
    <div>
      <TableComponent 
        title="Settings" 
        data={data} 
        columns={columns} 
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-h-[80vh] flex flex-col bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Settings</h2>
            <div className="space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Building Name</label>
                <input
                  type="text"
                  value={formData.buildingName}
                  onChange={(e) =>
                    setFormData({ ...formData, buildingName: e.target.value })
                  }
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Building Address</label>
                <input
                  type="text"
                  value={formData.buildingAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, buildingAddress: e.target.value })
                  }
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Post Office Address</label>
                <input
                  type="text"
                  value={formData.postOfficeAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, postOfficeAddress: e.target.value })
                  }
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              {/* File Upload for Logo */}
              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Logo</label>
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, 'logo')}
                  className="w-full p-2 border rounded"
                />
                {formData.logo && (
                  <p className="mt-2 text-sm text-white-600">Logo selected: {formData.logo.name}</p>
                )}
              </div>

              {/* File Upload for Seal */}
              <div>
                <label className="block text-sm font-medium white-gray-700 mb-1">Seal</label>
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, 'seal')}
                  className="w-full p-2 border rounded"
                />
                {formData.seal && (
                  <p className="mt-2 text-sm text-white-600">Seal selected: {formData.seal.name}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setIsEditModalOpen(false)} // Close modal
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit} // Submit the edit
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this setting?</h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)} // Close the delete confirmation modal
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm} // Confirm the deletion
                className="px-4 py-2 bg-red-500 text-white rounded"
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          messageType={messageType}
          message={message}
        />
      )}
    </div>
  );
};

export default CurrencySettingsPage;
