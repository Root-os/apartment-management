import React, { useContext, useRef, useEffect } from "react";
import { CalendarContext } from "../../context/calendarContext";
import { EthiopianDatePicker } from "ethiopian-date-picker-and-converter";
import { toGregorian } from "ethiopian-calendar-new";

const SmartDateInput = ({ value, onChange, className = "", ...rest }) => {
  const { isGregorian } = useContext(CalendarContext);
  const pickerRef = useRef(null);

  // Reset input when calendar mode switches
  useEffect(() => {
    if (pickerRef.current) pickerRef.current.value = "";
  }, [isGregorian]);

  if (isGregorian) {
    // === GREGORIAN DATE PICKER ===
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${className}`}
        {...rest}
      />
    );
  }

  // === ETHIOPIAN DATE PICKER ===
  return (
    <div className="relative z-[1000] mt-2">
      <EthiopianDatePicker
        ref={pickerRef}
        onDateChange={(ecDate) => {
          if (!ecDate || !ecDate.year) return;
          const [gy, gm, gd] = toGregorian(ecDate.year, ecDate.month, ecDate.day);
          const formatted = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
          onChange(formatted); // send Gregorian format to parent form
        }}
        placeholder="Select Ethiopian Date"
        containerClassName="relative w-full"
        inputClassName="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 bg-base-100"
        popupClassName="absolute top-full mt-2 bg-white shadow-lg rounded-md border border-gray-200 w-[18rem] z-[9999]"
        {...rest}
      />
    </div>
  );
};

export default SmartDateInput;
