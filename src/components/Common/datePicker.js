import React, { useState, useEffect, useRef } from "react";
import { toGregorian, toEthiopian } from "ethiopian-date";

const EthiopianDatePicker = ({ value, onChange, isGregorian }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [ecDate, setEcDate] = useState({ year: 2018, month: 1, day: 1 }); // default EC date
  const ref = useRef();

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update EC date when `value` (Gregorian) changes
  useEffect(() => {
    if (value && !isGregorian) {
      const g = new Date(value);
      const [y, m, d] = toEthiopian(g.getFullYear(), g.getMonth() + 1, g.getDate());
      setEcDate({ year: y, month: m, day: d });
    }
  }, [value, isGregorian]);

  const handleSelectDay = (day) => {
    setEcDate({ ...ecDate, day });
    const [gYear, gMonth, gDay] = toGregorian(ecDate.year, ecDate.month, day);
    onChange(`${gYear}-${String(gMonth).padStart(2, "0")}-${String(gDay).padStart(2, "0")}`);
    setShowCalendar(false);
  };

  // Simple month days (30 days for demonstration)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        className="w-full p-3 border rounded-md bg-base-100 focus:ring-2 focus:ring-blue-500"
        readOnly
        value={
          isGregorian
            ? value
            : `${ecDate.year}-${String(ecDate.month).padStart(2, "0")}-${String(ecDate.day).padStart(2, "0")}`
        }
        onClick={() => setShowCalendar(!showCalendar)}
        placeholder={isGregorian ? "YYYY-MM-DD" : "YYYY-MM-DD (Ethiopian)"}
      />
      {showCalendar && !isGregorian && (
        <div className="absolute top-full mt-1 p-2 bg-white shadow-lg rounded-md z-50 w-64">
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => handleSelectDay(d)}
                className={`p-2 rounded hover:bg-blue-500 hover:text-white ${
                  ecDate.day === d ? "bg-blue-500 text-white" : ""
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EthiopianDatePicker;
