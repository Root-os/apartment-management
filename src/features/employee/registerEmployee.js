import React, { useState } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";

const EmployeeRegistration = () => {
  const [employee, setEmployee] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    phone: "",
    salary: "",
    position: "",
    hireDate: "",
    shift: "day",
    department: "IT",
    employmentType: "full-time",
    emergencyContact: "",
    address: "",
    bankAccount: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem("token");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit handler for the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Token not found in local storage.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}auth/register/employee`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess("Employee registered successfully!");
        setError(null);
        // You can also reset the form if needed
        setEmployee({
          fname: "",
          lname: "",
          email: "",
          password: "",
          phone: "",
          salary: "",
          position: "",
          hireDate: "",
          shift: "day",
          department: "IT",
          employmentType: "full-time",
          emergencyContact: "",
          address: "",
          bankAccount: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(null);
    }
  };

  return (
    <>
    <TitleCard title="Register Employee" topMargin={'mt-1'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="fname">
              First Name
            </label>
            <input
              type="text"
              id="fname"
              name="fname"
              value={employee.fname}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="lname">
              Last Name
            </label>
            <input
              type="text"
              id="lname"
              name="lname"
              value={employee.lname}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={employee.password}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="salary">
              Salary
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="position">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={employee.position}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="hireDate">
              Hire Date
            </label>
            <input
              type="date"
              id="hireDate"
              name="hireDate"
              value={employee.hireDate}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
           <div><h2>The followings are Optional fields</h2></div>
          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="shift">
              Shift
            </label>
            <select
              id="shift"
              name="shift"
              value={employee.shift}
              onChange={handleChange}
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="day">Day</option>
              <option value="night">Night</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="department">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={employee.department}
              onChange={handleChange}
              required
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="employmentType">
              Employment Type
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={employee.employmentType}
              onChange={handleChange}
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="emergencyContact">
              Emergency Contact
            </label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={employee.emergencyContact}
              onChange={handleChange}
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={employee.address}
              onChange={handleChange}
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700" htmlFor="bankAccount">
              Bank Account
            </label>
            <input
              type="text"
              id="bankAccount"
              name="bankAccount"
              value={employee.bankAccount}
              onChange={handleChange}
              className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Register Employee
            </button>
          </div>
        </div>
      </form>
    </TitleCard>
    </>
  );
};

export default EmployeeRegistration;
