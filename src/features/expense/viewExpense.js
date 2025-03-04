import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [expenseTypeId, setExpenseTypeId] = useState('');
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch expense data from the API
    axios.get(`${process.env.REACT_APP_BASE_URL}expense`)
      .then((response) => {
        // Map response to desired data format
        const expenseData = response.data.map(expense => ({
          id: expense.id,
          amount: expense.amount,
          date: new Date(expense.date).toLocaleDateString(), // Format date
          description: expense.description,
          expenseType: expense.expenseType.name, // Extract expenseType name
        }));

        setExpenses(expenseData);

        // Set columns based on your needs
        setColumns([
          { label: 'Amount', key: 'amount' },
          { label: 'Date', key: 'date' },
          { label: 'Description', key: 'description' },
          { label: 'Expense Type', key: 'expenseType' },
          {
            label: 'Actions',
            key: 'actions',
            render: (row) => (
              <>
                <button
                  onClick={() => handleEditClick(row)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(row)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </>
            ),
          },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching expenses:', error);
      });

    // Fetch expense types from API
    axios.get(`${process.env.REACT_APP_BASE_URL}expense-type`)
      .then((response) => {
        setExpenseTypes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching expense types:', error);
      });
  }, []);

  // Handle edit button click
  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setAmount(expense.amount);
    setDate(new Date(expense.date).toISOString().split('T')[0]); // Convert date to YYYY-MM-DD format
    setDescription(expense.description);
    setExpenseTypeId(expense.expenseTypeId);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedExpense = {
        amount,
        date,
        description,
        expenseTypeId,
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}expense/${selectedExpense.id}`, updatedExpense);
      const updatedData = expenses.map((expense) =>
        expense.id === selectedExpense.id ? response.data : expense
      );
      setExpenses(updatedData);
      setIsEditModalOpen(false);
      setSelectedExpense(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Expense updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update expense');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}expense/${selectedExpense.id}`);
      setExpenses(expenses.filter((expense) => expense.id !== selectedExpense.id));
      setIsDeleteModalOpen(false);
      setSelectedExpense(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Expense deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete expense');
    } finally {
      setLoading(false);
    }
  };
 const handleAddClick = () => {window.location.href = '/expense-add';} 
  return (
    <div >
      <TableComponent
        title="Expenses"
        data={expenses}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-white-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-white-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
              <div className="mb-4">
                <label htmlFor="expenseTypeId" className="block text-sm font-medium text-white-700">
                  Expense Type
                </label>
                <select
                  id="expenseTypeId"
                  value={expenseTypeId}
                  onChange={(e) => setExpenseTypeId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Expense Type</option>
                  {expenseTypes.map((expenseType) => (
                    <option key={expenseType.id} value={expenseType.id}>
                      {expenseType.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disable={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
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
          <div className="bg-base-300 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this expense?</h2>
            <div className="flex justify-end space-x-4 ">
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