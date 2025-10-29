import React, { useContext } from "react";
import { CalendarContext } from "../../context/calendarContext";

const CalendarToggle = () => {
  const { isGregorian, toggleCalendar } = useContext(CalendarContext);

  return (
    <div className="flex items-center gap-2 p-2">
      <span>{isGregorian ? "Gregorian" : "Ethiopian"}</span>
      <button
        onClick={toggleCalendar}
        className="px-2 py-1 bg-blue-500 text-white rounded"
      >
        Toggle Calendar
      </button>
    </div>
  );
};

export default CalendarToggle;
