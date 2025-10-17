import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';

const ComplaintsPage = () => {
  const [employees, setEmployees] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/employee`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data.users);
      } catch (err) {
        setError('Error fetching employees');
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  // Fetch tenants data
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTenants(response.data);
      } catch (err) {
        setError('Error fetching tenants');
        console.error(err);
      }
    };

    fetchTenants();
  }, [token]);

  // Fetch complaints for selected employee
  const fetchComplaints = async (employeeId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}complaints/assigned/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaints(response.data);
    } catch (err) {
      setError('Error fetching complaints');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
    if (employeeId) {
      fetchComplaints(employeeId);
    } else {
      setComplaints([]);
    }
  };

  // Get employee name by ID
  const getEmployeeNameById = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    return employee ? employee.fname : 'Unknown';
  };

  // Get tenant name by ID
  const getTenantNameById = (id) => {
    const tenant = tenants.find((tenant) => tenant.id === id);
    return tenant ? tenant.fullName : 'Unknown';
  };

  // Render images
  const renderImages = (images) => {
    if (!images || images.length === 0) {
      return <p className="text-gray-500">No Image</p>;
    }

    return images.map((image, index) => {
      // Use the full URL directly from the API response
      const imageUrl = image.startsWith('http') ? image : `${process.env.REACT_APP_BASE_URL}${image}`;
      return (
        <img
          key={index}
          src={imageUrl}
          alt={`Complaint Image ${index + 1}`}
          className="w-16 h-16 object-cover rounded"
          onError={(e) => {
            e.target.src = '/no-image-icon.png'; // Fallback image
            e.target.alt = 'Image not available';
          }}
        />
      );
    });
  };

  // Table columns
  const columns = [
    { label: 'Tenant Name', key: 'tenantId', render: (row) => getTenantNameById(row.tenantId) },
    { label: 'Description', key: 'description' },
    { label: 'Urgency', key: 'urgency' },
    { label: 'Status', key: 'status' },
    { label: 'Assigned Employee', key: 'assignedEmployeeId', render: (row) => getEmployeeNameById(row.assignedEmployeeId) },
    { label: 'Images', key: 'images', render: (row) => renderImages(row.images) },
  ];

  return (
    <div>
      {pageLoading ? (
        <LoadingComponent />
      ) : (
        <div className="mb-4">
          <label htmlFor="employee" className="block text-lg font-medium text-white-700">
            Select Employee
          </label>
          <select
            id="employee"
            value={selectedEmployeeId}
            onChange={handleEmployeeChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select an Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fname}
              </option>
            ))}
          </select>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && complaints.length === 0 && selectedEmployeeId && (
        <div className="text-white-700">This employee is not assigned to a complaint.</div>
      )}
      <TableComponent
        title="Assigned Employee"
        data={complaints}
        columns={columns}
        showSearch={true}
        exportable={true}
      />
    </div>
  );
};

export default ComplaintsPage;