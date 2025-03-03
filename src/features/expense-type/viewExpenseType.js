import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [selectedExpense, setSelectedExpense] = useState(null); 
  const [expenseName, setExpenseName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}expense-type`);
        setExpenses(response.data);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Open modal with data to edit
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setExpenseName(expense.name);
    setExpenseDescription(expense.description);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedExpense(null);
    setExpenseName('');
    setExpenseDescription('');
  };

  // Handle Edit form submit (PUT request)
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}expense-type/${selectedExpense.id}`, {
        name: expenseName,
        description: expenseDescription,
      });
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === selectedExpense.id ? { ...expense, name: expenseName, description: expenseDescription } : expense
        )
      );
      closeModal();
      setModalOpen(true);
      setMessageType('success');
      setMessage('Expense updated successfully');
    } catch (err) {
     setModalOpen(true);
     setMessageType('error');
     setMessage('An error occurred while updating the expense.');
    }
  };

  // Handle delete button click
  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete request
  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}expense-type/${expenseToDelete.id}`);
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseToDelete.id));
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Expense deleted successfully');
    } catch (err) {
       setModalOpen(true);
       setMessageType('error');
      setMessage('An error occurred while deleting the expense.');
    }
  };

  const columns = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Description",
      key: "description",
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-blue-500 text-white px-4 py-1 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-1 rounded-md"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleAddClick = () => {window.location.href = '/app/expense-add'};

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <TableComponent
        title="Expense Types"
        data={expenses}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-base-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-300 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-white-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="w-full bg-base-100 p-2 border border-grey-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-white-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full bg-base-100 p-2 border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-base-400 text-white px-4 py-1 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Are you sure you want to delete this expense?</h2>
            <div className="flex justify-between">
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

export default ExpensePage;