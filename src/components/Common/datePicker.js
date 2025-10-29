import React, { useState, useContext } from "react";
import SmartDateInput from "./smartDatePicker";
import { CalendarContext } from "../../context/calendarContext";

const TestDatePickerPage = () => {
  const [date, setDate] = useState(""); // stores Gregorian date
  const { isGregorian, setIsGregorian } = useContext(CalendarContext);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Test SmartDateInput</h1>

      {/* Toggle calendar type */}
      <div className="mb-4">
        <label className="mr-2">Use Gregorian Calendar?</label>
        <input
          type="checkbox"
          checked={isGregorian}
          onChange={(e) => setIsGregorian(e.target.checked)}
        />
      </div>

      {/* SmartDateInput */}
      <SmartDateInput
        value={date}
        onChange={(gcDate) => {
          console.log("Selected Gregorian date:", gcDate);
          setDate(gcDate);
        }}
        placeholder="Pick a date"
      />

      <div className="mt-4">
        <strong>Current date state:</strong> {date || "none"}
      </div>
    </div>
  );
};

export default TestDatePickerPage;
