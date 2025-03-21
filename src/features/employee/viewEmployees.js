import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "../../components/table"; 
import LoadingComponent from "../../components/loading";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token is missing in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}auth/employee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data.users);
      } catch (err) {
        setError("Failed to fetch employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    { key: "fname", label: "First Name" },
    { key: "lname", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    
  ];

  if (loading) {
    return <LoadingComponent/>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleAdd = () => {
    window.location.href= '/app/add-employee';
  }

  return (
    <div>
      <TableComponent
        title="Employee List"
        data={employees}
        columns={columns}
        exportable={true}
        showSearch={true}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default EmployeeList;
