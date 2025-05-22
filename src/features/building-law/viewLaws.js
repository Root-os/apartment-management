import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuildingRulesPage = () => {
  const [rules, setRules] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [editRule, setEditRule] = useState(null);
  const [deleteRule, setDeleteRule] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchRules = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/building-law');
      setRules(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    const filtered = rules.filter(rule =>
      rule.description.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filtered);
    setCurrentPage(1);
  }, [search, rules]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/building-law/${editRule.id}`, {
        description: editRule.description,
      });
      fetchRules();
      setEditRule(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/building-law/${deleteRule.id}`);
      fetchRules();
      setDeleteRule(null);
    } catch (err) {
      console.error(err);
    }
  };

  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search rules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-1/3"
        />
        <button
          onClick={() => navigate('/app/law-letter')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print Letter View
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((rule, index) => (
            <tr key={rule.id}>
              <td className="px-4 py-2 border">{index + 1 + (currentPage - 1) * rowsPerPage}</td>
              <td className="px-4 py-2 border">{rule.description}</td>
          <td className="px-4 py-2 border">
            <div className="flex items-center justify-end space-x-2">
                <button
                onClick={() => setEditRule(rule)}
                className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
                >
                Edit
                </button>
                <button
                onClick={() => setDeleteRule(rule)}
                className="bg-red-500 text-white px-2 py-1 text-sm rounded"
                >
                Delete
                </button>
            </div>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          :
          <select
            className="ml-2 border rounded px-2 py-1"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[5, 10, 15].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <span>
             {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-1/3">
            <h2 className="text-lg font-semibold mb-4">Edit Rule</h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={4}
              value={editRule.description}
              onChange={(e) => setEditRule({ ...editRule, description: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditRule(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-1/3">
            <h2 className="text-lg font-semibold mb-4">Delete Rule</h2>
            <p>Are you sure you want to delete this rule?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setDeleteRule(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingRulesPage;
