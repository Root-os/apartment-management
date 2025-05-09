import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import DeleteConfirmationModal from '../../components/editDeleteModal';
import LoadingComponent from '../../components/loading';

const SalaryPayments = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSalaryDetail, setSelectedSalaryDetail] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns = [
    { 
      label: 'Employee Name', 
      key: 'employeeName',
      render: (row) =>
        row.User ? `${row.User.fname} ${row.User.lname}` : 'N/A',
    },
    
    { label: 'Amount', key: 'amount' },
    // { label: 'Payment From Date', key: 'paymentFromDate',
    //   render: (row) => {
    //     if (row.paymentFromDate) {
    //       const date = new Date(row.paymentFromDate);
    //       return date.toLocaleDateString('en-US'); 
    //     }
    //     return 'N/A';
    //   }
    // },
    // { label: 'Payment To Date', key: 'paymentToDate',
    //   render: (row) => {
    //     if (row.paymentToDate) {
    //       const date = new Date(row.paymentToDate);
    //       return date.toLocaleDateString('en-US'); 
    //     }
    //     return 'N/A';
    //   }
    // },
    { label: 'Payment Method', key: 'paymentMethod' },
    { label: 'Status', key: 'status' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className='flex space-x-2'>
          <button
            onClick={() => handleEdit(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteConfirmation(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetail(row)}
           className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Details
          </button>
        </div>
      ),
    },
  ];
  
  useEffect(() => {
    setLoading(true);
    const fetchSalaryData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}salary-payments/all`, {

          headers: { Authorization: `Bearer ${token}` },
        });
        setSalaryData(response.data.data);
      } catch (err) {
        setError('An error occurred while fetching salary data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  

  const handleEdit = (salary) => {
    setSelectedSalary(salary);
    setPaymentMethod(salary.paymentMethod);
    setStatus(salary.status);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const updatedSalary = {
        paymentMethod,
        status,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}salary-payments/${selectedSalary.id}`,
        updatedSalary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update the data in the state after successful update
      const updatedData = salaryData.map((item) =>
        item.id === selectedSalary.id ? { ...item, paymentMethod, status } : item
      );
      setSalaryData(updatedData);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Salary payment updated successfully');
      setIsEditModalOpen(false);
      setSelectedSalary(null);
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update salary payment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setSelectedSalary(null);
  };

  // Handle the delete confirmation modal
  const handleDeleteConfirmation = (salary) => {
    setSelectedSalary(salary);
    setIsDeleteModalOpen(true);
  };

  // Delete the salary payment from the server
  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}salary-payments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Remove the deleted item from the state
      const updatedData = salaryData.filter((item) => item.id !== id);
      setSalaryData(updatedData);

      setMessageType('success');
      setMessage('Salary payment deleted successfully');
      setModalOpen(true);
    } catch (err) {
      setMessageType('error');
      setMessage('Unable to delete salary payment.');
      setModalOpen(true);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false); // Close the delete modal
    }
  };

  const handleDetail = (salary) => {
    setSelectedSalaryDetail(salary);
    setIsDetailModalOpen(true);
  };
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSalaryDetail(null);
  };

  return (
    <>
        {loading ? (
        <LoadingComponent/>
      ) : (
        <TableComponent
          title="All Employee Salary Payments"
          data={salaryData}
          columns={columns}
        />
      )}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Salary Payment</h2>
            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-white-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-white-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedSalaryDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Salary Payment Details</h2>
            <div className="mb-4">
            <p><strong>Employee Name:</strong> {selectedSalaryDetail.User ? `${selectedSalaryDetail.User.fname} ${selectedSalaryDetail.User.lname}` : 'N/A'}</p>
              <p><strong>Amount:</strong> {selectedSalaryDetail.amount}</p>
              <p><strong>Payment From Date:</strong> {new Date(selectedSalaryDetail.paymentFromDate).toISOString().split('T')[0]}</p>
              <p><strong>Payment To Date:</strong> {new Date(selectedSalaryDetail.paymentToDate).toISOString().split('T')[0]}</p>
              <p><strong>Payment Method:</strong> {selectedSalaryDetail.paymentMethod}</p>
              <p><strong>Status:</strong> {selectedSalaryDetail.status}</p>
              <p><strong>Pension Contribution:</strong> {selectedSalaryDetail.pensionContribution}</p>
              <p><strong>Income Tax:</strong> {selectedSalaryDetail.incomeTax}</p>
              <p><strong>Net Salary:</strong> {selectedSalaryDetail.netSalary}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseDetailModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Success/Error Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        data={selectedSalary}
      />
    </>
  );
};
export default SalaryPayments;
