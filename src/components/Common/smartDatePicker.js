import React, { useContext, useState, useRef, useEffect } from "react";
import { CalendarContext } from "../../context/calendarContext";
import { toEthiopian, toGregorian } from "ethiopian-date";
import moment from "moment";

const SmartDateInput = ({ 
  value, 
  onChange, 
  className = "", 
  ...rest 
}) => {
  const { isGregorian, convertToGregorian, formatDateForDisplay } = useContext(CalendarContext);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState({ year: 2016, month: 1 }); // Default Ethiopian date
  const pickerRef = useRef(null);

  // Ethiopian calendar constants
  const ethiopianMonths = [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", 
    "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", 
    "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ];

  const ethiopianWeekdays = ["ሰ", "ማ", "ረ", "ሐ", "አ", "ቅ", "እ"];

  // Convert Gregorian to Ethiopian using your library
const gregorianToEthiopian = (gregorianDate) => {
  if (!gregorianDate) return null;

  const normalized = gregorianDate.includes("T")
    ? gregorianDate.split("T")[0]
    : gregorianDate;

  const [y, m, d] = normalized.split("-");
  const date = new Date(Date.UTC(y, m - 1, d));

  if (isNaN(date)) return null;

  const [year, month, day] = toEthiopian(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate()
  );

  return { year, month, day };
};


  // Convert Ethiopian to Gregorian using your library
  const ethiopianToGregorian = (ethDate) => {
    if (!ethDate) return null;
    
    try {
      const [gYear, gMonth, gDay] = toGregorian(
        ethDate.year, 
        ethDate.month, 
        ethDate.day
      );
      
      return `${gYear}-${String(gMonth).padStart(2, "0")}-${String(gDay).padStart(2, "0")}`;
    } catch (error) {
      console.error("Error converting to Gregorian date:", error);
      return null;
    }
  };

  // Get Ethiopian month days
  const getEthiopianMonthDays = (year, month) => {
    const days = [];
    const totalDays = month === 13 ? (year % 4 === 3 ? 6 : 5) : 30;
    
    for (let day = 1; day <= totalDays; day++) {
      days.push({ day, month, year });
    }
    
    return days;
  };

  // Get current Ethiopian date
  const getCurrentEthiopianDate = () => {
    return gregorianToEthiopian(new Date().toISOString().split('T')[0]);
  };

  // Initialize selected date and current month
  useEffect(() => {
    if (value) {
      const ethDate = gregorianToEthiopian(value);
      if (ethDate) {
        setSelectedDate(ethDate);
        setCurrentMonth({ year: ethDate.year, month: ethDate.month });
      }
    } else {
      // Set default to current Ethiopian date
      const currentEth = getCurrentEthiopianDate();
      if (currentEth) {
        setCurrentMonth({ year: currentEth.year, month: currentEth.month });
      }
    }
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (ethDate) => {
    setSelectedDate(ethDate);
    const gregorianDate = ethiopianToGregorian(ethDate);
    if (gregorianDate) {
      onChange(gregorianDate);
    }
    setShowPicker(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      let newYear = prev.year;
      let newMonth = prev.month;
      
      if (direction === 'prev') {
        if (newMonth === 1) {
          newMonth = 13;
          newYear--;
        } else {
          newMonth--;
        }
      } else {
        if (newMonth === 13) {
          newMonth = 1;
          newYear++;
        } else {
          newMonth++;
        }
      }
      
      return { year: newYear, month: newMonth };
    });
  };

  const getDisplayValue = () => {
    if (!selectedDate) return "";
    return `${selectedDate.day} ${ethiopianMonths[selectedDate.month - 1]} ${selectedDate.year}`;
  };

  // Render Ethiopian Date Picker
  const renderEthiopianPicker = () => {
    const { year: ethYear, month: ethMonth } = currentMonth;
    const days = getEthiopianMonthDays(ethYear, ethMonth);

    return (
      <div 
        ref={pickerRef}
        className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-64"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center font-semibold">
            <span className="text-gray-800">{ethiopianMonths[ethMonth - 1]}</span>
            <span className="text-gray-600 ml-1">{ethYear}</span>
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Week days */}
        <div className="grid grid-cols-7 gap-1 p-2 border-b">
          {ethiopianWeekdays.map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 p-2">
          {days.map((date, index) => {
            const isSelected = selectedDate && 
              selectedDate.day === date.day && 
              selectedDate.month === date.month && 
              selectedDate.year === date.year;
            
            const isToday = () => {
              const today = getCurrentEthiopianDate();
              return today && 
                today.day === date.day && 
                today.month === date.month && 
                today.year === date.year;
            };
            
            return (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`
                  h-8 rounded text-sm transition-all duration-200
                  ${isSelected 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : isToday()
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                  ${date.month === 13 ? 'text-orange-600 font-medium' : ''}
                `}
              >
                {date.day}
              </button>
            );
          })}
        </div>

        {/* Today button */}
        <div className="p-2 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={() => {
              const todayEth = getCurrentEthiopianDate();
              if (todayEth) {
                handleDateSelect(todayEth);
              }
            }}
            className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
          >
            ዛሬ / Today
          </button>
        </div>
      </div>
    );
  };

  if (isGregorian) {
    return (
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
        {...rest}
      />
    );
  }

  return (
    <div className="relative">
      {/* Ethiopian Date Input */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={getDisplayValue()}
          placeholder="ቀን ይምረጡ"
          onClick={() => setShowPicker(true)}
          className={`
            mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md 
            shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            cursor-pointer transition-colors ${className}
          `}
          {...rest}
        />
        
        {/* Calendar icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Date Picker Dropdown */}
      {showPicker && renderEthiopianPicker()}
    </div>
  );
};

export default SmartDateInput;