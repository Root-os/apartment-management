import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]); // To store the list of expenses
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // To store error messages
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [selectedExpense, setSelectedExpense] = useState(null); // For editing selected expense
  const [expenseName, setExpenseName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  // Fetch expenses data when the component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/expense-type');
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
      await axios.put(`https://apartment.houseethiopia.com/api/expense-type/${selectedExpense.id}`, {
        name: expenseName,
        description: expenseDescription,
      });
      // Update the expense in the state after editing
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === selectedExpense.id ? { ...expense, name: expenseName, description: expenseDescription } : expense
        )
      );
      closeModal();
    } catch (err) {
      setError('Error updating expense');
    }
  };

  // Handle Delete request
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/expense-type/${id}`);
      // Remove the deleted expense from the state
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
    } catch (err) {
      setError('Error deleting expense');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Expense Types</h1>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Loading Message */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-base-100 text-white">
            <tr>
              <th className="p-3 border-b text-left">Name</th>
              <th className="p-3 border-b text-left">Description</th>
              <th className="p-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b ">
                <td className="p-3">{expense.name}</td>
                <td className="p-3">{expense.description}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-base-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
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
                  className="bg-indigo-600 text-white px-4 py-1 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensePage;
