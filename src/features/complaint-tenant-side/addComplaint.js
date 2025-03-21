import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard'
import Modal from '../../components/Modal'


const AddComplaint = () => {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('low');
  const [files, setFiles] = useState([]); // Store the actual files
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success')
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}tenant`)
      .then((response) => {
        setTenants(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tenants:', error);
      });
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + files.length <= 5) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
    event.target.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('tenantId', tenantId);
    formData.append('description', description);
    formData.append('urgency', urgency);

    files.forEach((file) => {
      formData.append('images', file); // Append the actual file
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}complaints/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      // setMessage(response.data.message);
      setLoading(false);
      setModalOpen(true)
      setMessageType('success')
      setMessage('Complaint added successfully')

      setDescription('');
      setTenantId('');
      setUrgency('low');
      setFiles([]);
      window.location.href='/app/complain-tenant-view';
    } catch (error) {
      setLoading(false);

      setModalOpen(true)
      setMessageType('error')
      setMessage('Error submitting complaint.');
      
      // console.error('Error submitting complaint:', error);
    }
  };

  return (
    <>
      <TitleCard title="Add Complain">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div>
          <label htmlFor="urgency" className="block text-sm font-medium">
            Urgency
          </label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-base-100"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium">
            Upload Images (Up to 5)
          </label>

          <div className="space-y-2">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
            {files.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 w-full p-2 border border-gray-300 rounded-md">
                Selected Files: {files.map((file) => file.name).join(', ')}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
      <Modal
      isOpen={modalOpen}
      onClose={()=> setModalOpen(false)}
      messageType={messageType}
      message={message}
      />
      </TitleCard>
    </>
  );
};

export default AddComplaint;