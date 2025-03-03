import React, { useState } from 'react';

const Form = ({ onSubmit }) => {
  // States for form data
  const [formData, setFormData] = useState({
    textField: '',
    textArea: '',
    date: '',
    file: null,
    checkboxes: [],
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => {
      if (checked) {
        return { ...prevData, checkboxes: [...prevData.checkboxes, name] };
      } else {
        return {
          ...prevData,
          checkboxes: prevData.checkboxes.filter((item) => item !== name),
        };
      }
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // You can send formData to parent component or API
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Text Input */}
      <div className="flex flex-col">
        <label htmlFor="textField" className="text-sm font-medium text-gray-700">
          Text Field
        </label>
        <input
          type="text"
          id="textField"
          name="textField"
          value={formData.textField}
          onChange={handleInputChange}
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Text Area */}
      <div className="flex flex-col">
        <label htmlFor="textArea" className="text-sm font-medium text-gray-700">
          Text Area
        </label>
        <textarea
          id="textArea"
          name="textArea"
          value={formData.textArea}
          onChange={handleInputChange}
          rows="4"
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      {/* Date Picker */}
      <div className="flex flex-col">
        <label htmlFor="date" className="text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* File Upload */}
      <div className="flex flex-col">
        <label htmlFor="file" className="text-sm font-medium text-gray-700">
          File Upload
        </label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Checkboxes</label>
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="checkbox"
              id="checkbox1"
              name="checkbox1"
              checked={formData.checkboxes.includes('checkbox1')}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="checkbox1" className="ml-2 text-sm">
              Option 1
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="checkbox2"
              name="checkbox2"
              checked={formData.checkboxes.includes('checkbox2')}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="checkbox2" className="ml-2 text-sm">
              Option 2
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
