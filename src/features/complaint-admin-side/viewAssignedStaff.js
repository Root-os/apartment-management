import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
// import NoImageIcon from '../../assets/no-image-icon.png'; // Assuming you have a no-image icon in your assets

const ComplaintsPage = () => {
  const [employees, setEmployees] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch employees data from API using Axios
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data.users); // Assuming the response contains a 'users' array
      } catch (err) {
        setError('Error fetching employees');
        console.error(err);
      }
    };

    fetchEmployees();
  }, [token]);

  // Fetch tenants data from API using Axios
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/tenant', {
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

  // Fetch complaints data for the selected employee
  const fetchComplaints = async (employeeId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://apartment.houseethiopia.com/api/complaints/assigned/${employeeId}`, {
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

  // Handle employee selection change
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

  // Define columns for TableComponent
  const columns = [

    { label: 'Tenant Name', key: 'tenantId', render: (row) => getTenantNameById(row.tenantId) },
    { label: 'Description', key: 'description' },
    { label: 'Urgency', key: 'urgency' },
    { label: 'Status', key: 'status' },
    { label: 'Assigned Employee', key: 'assignedEmployeeId', render: (row) => getEmployeeNameById(row.assignedEmployeeId) },
    { label: 'Images', key: 'images', render: (row) => renderImages(row.images) },
  ];

  const renderImages = (images) => {
    try {
      const imageArray = JSON.parse(images);
      if (imageArray.length === 0) {
        return <p className="w-16 h-16 object-cover">No Image</p>;
      }
      return imageArray.map((image, index) => (
        <img key={index} src={`https://apartment.houseethiopia.com/${image}`} alt={`Complaint Image ${index + 1}`} className="w-16 h-16 object-cover" />
      ));
    } catch (error) {
      return <p className="w-16 h-16 object-cover">No Image </p>;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="employee" className="block text-lg font-medium text-white-700">Select Employee</label>
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

      {loading && <div>Loading...</div>}
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