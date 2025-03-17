import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';

const CurrencySettingsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);  // To control modal visibility
  const [selectedSetting, setSelectedSetting] = useState(null);  // Selected setting to edit
  const [formData, setFormData] = useState({
    buildingName: '',
    buildingAddress: '',
    email: '',
    phoneNumber: '',
    postOfficeAddress: '',
    logos: null,
    seal: null,
  });

  // Fetch data from the API
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('https://apartment.houseethiopia.com/api/setting', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  const handleEditClick = (setting) => {
    if (!setting) return; // Check if the setting is valid
    
    // Set the selected setting to pre-fill the form and open the modal
    setSelectedSetting(setting);
    setFormData({
      buildingName: setting.buildingName || '',
      buildingAddress: setting.buildingAddress || '',
      email: setting.email || '',
      phoneNumber: setting.phoneNumber || '',
      postOfficeAddress: setting.postOfficeAddress || '',
      logos: null, // Reset file inputs
      seal: null,
    });
    setModalOpen(true);  // Open the modal
  };
  

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSetting(null);
  };

  const handleFileChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.files[0],  // Update the form data with the selected file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);

    const updatedData = new FormData();
    updatedData.append('buildingName', formData.buildingName);
    updatedData.append('buildingAddress', formData.buildingAddress);
    updatedData.append('email', formData.email);
    updatedData.append('phoneNumber', formData.phoneNumber);
    updatedData.append('postOfficeAddress', formData.postOfficeAddress);
    if (formData.logos) updatedData.append('logos', formData.logos);
    if (formData.seal) updatedData.append('seal', formData.seal);

    try {
      const response = await axios.put(
        `https://apartment.houseethiopia.com/api/setting/${selectedSetting.id}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
        }
      );

      setLoading(false);
      setData((prevData) =>
        prevData.map((setting) =>
          setting.id === selectedSetting.id ? response.data : setting
        )
      );
      setModalOpen(false);  // Close the modal after successful update
    } catch (error) {
      setLoading(false);
      setError('Error updating setting');
      console.error('Error updating setting:', error);
    }
  };

  // Define columns based on the API response
  const columns = [
    {
      key: 'buildingName',
      label: 'Building Name',
    },
    {
      key: 'buildingAddress',
      label: 'Building Address',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
    },
    {
      key: 'postOfficeAddress',
      label: 'Post Office Address',
    },
    {
      key: 'logos',
      label: 'Logo',
      render: (value) => (
        <img
          src={`https://apartment.houseethiopia.com/${value}`}
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
          src={`https://apartment.houseethiopia.com/${value}`}
          alt="Seal"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <button
          onClick={() => handleEditClick(row)}
          className="btn btn-primary"
        >
          Edit
        </button>
      ),
    },
  ];

  if (loading) return <LoadingComponent />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <TableComponent title="Settings" data={data} columns={columns} />
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Setting</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Building Name</label>
                <input
                  type="text"
                  value={formData.buildingName}
                  onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                />
              </div>
              <div>
                <label>Building Address</label>
                <input
                  type="text"
                  value={formData.buildingAddress}
                  onChange={(e) => setFormData({ ...formData, buildingAddress: e.target.value })}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <label>Post Office Address</label>
                <input
                  type="text"
                  value={formData.postOfficeAddress}
                  onChange={(e) => setFormData({ ...formData, postOfficeAddress: e.target.value })}
                />
              </div>
              <div>
                <label>Logos (Upload Image)</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'logos')}
                />
              </div>
              <div>
                <label>Seal (Upload Image)</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'seal')}
                />
              </div>
              <div>
                <button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Setting'}
                </button>
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySettingsPage;
