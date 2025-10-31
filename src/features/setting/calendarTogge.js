import React, { useContext } from "react";
import { CalendarContext } from "../../context/calendarContext";
import { CalendarDays } from "lucide-react";

const CalendarToggle = () => {
  const { isGregorian, toggleCalendar } = useContext(CalendarContext);

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-3 w-fit mx-auto">
      {/* Calendar Label */}
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-gray-700">
          {isGregorian ? "Gregorian Calendar" : "Ethiopian Calendar"}
        </span>
      </div>

      {/* Professional Toggle Switch */}
      <div
        onClick={toggleCalendar}
        className={`relative inline-flex h-6 w-12 items-center rounded-full cursor-pointer transition-colors duration-300 ${
          isGregorian ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
            isGregorian ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
    </div>
  );
};

export default CalendarToggle;
