import React, { useContext } from "react";
import { CalendarContext } from "../../context/calendarContext";
import { EthiopianDatePicker } from "ethiopian-date-picker-and-converter";
import { toGregorian } from "ethiopian-calendar-new";

const SmartDateInput = ({ value, onChange, className = "", ...rest }) => {
  const { isGregorian } = useContext(CalendarContext);

  if (isGregorian) {
    return (
      <input
        type="date"
        value={value || ""}
        onChange={(e) => {
          console.log("Gregorian input changed:", e.target.value);
          onChange(e.target.value);
        }}
        className={`mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${className}`}
        {...rest}
      />
    );
  }

  return (
    <div className="relative z-[1000] mt-2">
      <EthiopianDatePicker
        value={value || null} // controlled value
onDateChange={(ecDate) => {
  console.log("Raw Ethiopian date:", ecDate);

  // Parse string like "19 ጥቅምት 2018"
  const parts = ecDate.split(" ");
  if (parts.length !== 3) return;

  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);

  // Ethiopian months
  const months = [
    "መስከረም",
    "ጥቅምት",
    "ኅዳር",
    "ታኅሣሥ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዝያ",
    "ግንቦት",
    "ሰኔ",
    "ሀምሌ",
    "ነሐሴ",
    "ጳጉሜን",
  ];

  const month = months.indexOf(monthName) + 1;
  if (!month || !day || !year) return;

  const gc = toGregorian(year, month, day);
  console.log("toGregorian output:", gc); // { year, month, day }

  // ✅ Use correct property names
  const formatted = `${gc.year}-${String(gc.month).padStart(2,"0")}-${String(gc.day).padStart(2,"0")}`;
  console.log("Converted Gregorian date:", formatted);

  onChange(formatted);
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
