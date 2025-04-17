import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table'
import LoadingComponent from '../../../components/loading';
import Modal from '../../../components/Modal';

const ViewMyRequest = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [requestToFeedback, setRequestToFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch withdrawal requests data
  const fetchData = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authorization token not found.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}withdrawal-request/tenant/my-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setWithdrawalRequests(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch withdrawal requests.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingComponent/>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleFeedbackClick = (request) => {
    setRequestToFeedback(request);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token not found.');
        return;
      }

      // Ensure we are making a PUT request
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}withdrawal-request/feedback`, {
        requestId: requestToFeedback.id,
        tenantFeedback: feedback,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if feedback submission was successful
      if (response.data.message === "Tenant feedback submitted.") {
        // Update the request in the list after feedback submission
        setWithdrawalRequests((prevData) =>
          prevData.map((request) =>
            request.id === requestToFeedback.id ? response.data.request : request
          )
        );
        setIsFeedbackModalOpen(false);
        setRequestToFeedback(null);
        setFeedback('');
        setModalOpen(true);
        setMessageType('success');  
        setMessage('Feedback added successfully');
      } else {
        // setError('Failed to submit feedback.');
        setModalOpen(true);
        setMessageType('error');
        setMessage('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // setError('Failed to submit feedback.');
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to submit feedback, something went wrong');
    }finally{
      setIsLoading(false);
    }
  };

  const columns = [
    { label: 'Reason', key: 'reason' },
    {
      key: 'terminationDate',
      label: 'Termination Date',
      render: (row) => new Date(row.terminationDate).toISOString().split('T')[0]
    },
    { label: 'Status', key: 'status' },
    { label: 'Admin Response', key: 'adminResponse' },
    { label: 'Deposit Refund Status', key: 'depositRefundStatus' },
    { label: 'Tenant Feedback', key: 'tenantFeedback' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleFeedbackClick(row)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Feedback
          </button>
        </div>
      ),
    }
  ];

  const handleAddClick = () => {
    window.location.href = '/app/withdraw-request-add';
   };

  return (
    <div>
      <TableComponent
        title="Withdrawal Requests"
        data={withdrawalRequests}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />

      {isFeedbackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Submit Feedback</h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-1 bg-base-100 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              rows="4"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setIsFeedbackModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleFeedbackSubmit} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isLoading}
              >
                {isLoading ? 'submitting...':'Submit'}
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

export default ViewMyRequest;
