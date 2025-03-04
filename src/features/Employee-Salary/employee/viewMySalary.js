import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from './TableComponent'; // Assuming this is the correct path for TableComponent
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Assuming this is the correct path for DeleteConfirmationModal

const MySalaryPayments = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch salary data on component mount
  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/salary-payments/my-history');
        setSalaryData(response.data.data);
      } catch (err) {
        setError('An error occurred while fetching salary data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/salary-payments/${id}`);
      // Remove the deleted item from the state
      setSalaryData(salaryData.filter(item => item.id !== id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('An error occurred while deleting the salary payment.');
      setIsDeleteModalOpen(false);
    }
  };

  // Handle open delete confirmation modal
  const openDeleteModal = (salary) => {
    setSelectedSalary(salary);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    { label: 'Employee ID', key: 'employeeId' },
    { label: 'Amount', key: 'amount' },
    { label: 'Payment From Date', key: 'paymentFromDate' },
    { label: 'Payment To Date', key: 'paymentToDate' },
    { label: 'Payment Method', key: 'paymentMethod' },
    { label: 'Status', key: 'status' },
    { label: 'Pension Contribution', key: 'pensionContribution' },
    { label: 'Income Tax', key: 'incomeTax' },
    { label: 'Net Salary', key: 'netSalary' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => openDeleteModal(row)} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Loading State */}
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <TableComponent
          title="Salary Payments"
          data={salaryData}
          columns={columns}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedSalary && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDelete}
          data={selectedSalary}
        />
      )}
    </div>
  );
};

export default MySalaryPayments;
