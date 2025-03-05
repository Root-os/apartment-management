import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddVendor = () => {
  // State variables for form inputs
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [contractTerms, setContractTerms] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch service types on component mount
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}service-type`)
      .then((response) => {
        setServiceTypes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the service types:', error);
      });
  }, []);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages before submitting
    setMessage('');
    setError('');
    
    // Check if all fields are filled
    if (!fname || !lname || !phone || !email || !address || !serviceTypeId ) {
      setError('All fields are required');
      return;
    }

    // Set loading state to true when sending the request
    setLoading(true);

    const formData = new FormData();
    formData.append('fname', fname);
    formData.append('lname', lname);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('serviceTypeId', serviceTypeId);
    formData.append('contractTerms', contractTerms);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}vendors`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFname('');
      setLname('');
      setPhone('');
      setEmail('');
      setAddress('');
      setServiceTypeId('');
      setContractTerms(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Vendor added successfully.');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Vendor"  >
      {/* Form to input vendor data */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fname" className="block text-sm font-medium text-white-700">First Name</label>
          <input
            type="text"
            id="fname"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lname" className="block text-sm font-medium text-white-700">Last Name</label>
          <input
            type="text"
            id="lname"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-white-700">Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-white-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-white-700">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="serviceTypeId" className="block text-sm font-medium text-white-700">Service Type</label>
          <select
            id="serviceTypeId"
            value={serviceTypeId}
            onChange={(e) => setServiceTypeId(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          >
            <option value="" disabled>Select Service Type</option>
            {serviceTypes.map(serviceType => (
              <option key={serviceType.id} value={serviceType.id}>{serviceType.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="contractTerms" className="block text-sm font-medium text-white-700">Contract Terms (PDF/DOC)</label>
          <input
            type="file"
            id="contractTerms"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setContractTerms(e.target.files[0])}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </TitleCard>
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)} 
      messageType={messageType} 
      message={message}
    />
   </>
  );
};

export default AddVendor;