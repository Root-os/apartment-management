import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

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
  const [pageLoading, setPageLoading] = useState(true);

  // Function to fetch expenses and expense types
  const fetchData = async () => {
    try {
      const expenseResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}expense`);
      const expenseData = expenseResponse.data.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description,
        expenseType: expense.expenseType.name,
        expenseTypeId: expense.expenseType.id,
      }));
      setExpenses(expenseData);

      setColumns([
        { label: 'Amount', key: 'amount' },
        { label: 'Date', key: 'date' },
        { label: 'Description', key: 'description' },
        { label: 'Expense Type', key: 'expenseType' },
        {
          label: 'Actions',
          key: 'actions',
          render: (row) => (
            <div className="flex justify-end space-x-2">
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
            </div>
          ),
        },
      ]);

      const expenseTypeResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}expense-type`);
      setExpenseTypes(expenseTypeResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setAmount(expense.amount);
    
    // Convert the date into 'yyyy-mm-dd' format correctly
    const localDate = new Date(expense.date).toLocaleDateString('en-CA');  // 'en-CA' gives 'yyyy-mm-dd'
    setDate(localDate);  // Set the state with the correctly formatted date
    
    setDescription(expense.description);
    setExpenseTypeId(expense.expenseTypeId || '');
    setIsEditModalOpen(true);
  };
  

  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedExpense = {
        amount,
        date,
        description,
        expenseTypeId,
      };

      // Update the expense via API
      await axios.put(`${process.env.REACT_APP_BASE_URL}expense/${selectedExpense.id}`, updatedExpense);

      // Refetch all expenses to ensure the table reflects the latest data
      const expenseResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}expense`);
      const updatedExpenseData = expenseResponse.data.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description,
        expenseType: expense.expenseType.name,
        expenseTypeId: expense.expenseType.id,
      }));
      setExpenses(updatedExpenseData);

      // Refetch expense types for the dropdown
      const expenseTypeResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}expense-type`);
      setExpenseTypes(expenseTypeResponse.data);

      setIsEditModalOpen(false);
      setSelectedExpense(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Expense updated successfully');
    } catch (error) {
      console.error('Error while updating expense:', error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update expense');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddClick = () => {
    window.location.href = '/app/expense-add';
  };

  return (
    <div>
      {pageLoading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="Expenses"
          data={expenses}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
          onAdd={handleAddClick}
        />
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-4 sm:p-6 rounded-md w-full max-w-lg mx-4 sm:mx-0">
            <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-white-700">
                  Expense Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  min="0"
                  step="0.5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-white-700">
                  Expense Date
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
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this expense?</h2>
            <div className="flex justify-end space-x-4">
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