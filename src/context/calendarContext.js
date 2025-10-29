import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toEthiopian, toGregorian } from "ethiopian-date";

export const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [isGregorian, setIsGregorian] = useState(true);

  // Load current calendar from backend
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}setting/calendar`)
      .then((res) => {
        setIsGregorian(res.data.isGregorian);
      })
      .catch(() => {
        // fallback to Gregorian if API fails
        setIsGregorian(true);
      });
  }, []);

  // Toggle and update backend
  const toggleCalendar = async () => {
    const newValue = !isGregorian;
    setIsGregorian(newValue);
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}setting/calendar`, { isGregorian: newValue });
    } catch (err) {
      console.error("Failed to update calendar setting:", err);
    }
  };

  // Safe parsing of date
  const parseDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d) ? null : d;
  };

  // Convert date to display format (Gregorian or Ethiopian)
const formatDateForDisplay = (date) => {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d)) return "";

  if (isGregorian) {
    return d.toISOString().split("T")[0];
  }

  // The library returns an array [year, month, day]
  const [year, month, day] = toEthiopian(d.getFullYear(), d.getMonth() + 1, d.getDate());
  console.log("📅 Converting to Ethiopian:", d, "→", [year, month, day]);

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

  // Convert date from user input to Gregorian before saving
const convertToGregorian = (date) => {
  if (!date) return "";
  if (isGregorian) return date;

  const parts = date.split("-").map(Number);
  if (parts.length !== 3) return "";

  const [year, month, day] = parts;
  const [gYear, gMonth, gDay] = toGregorian(year, month, day);
  console.log("🔄 Converting Ethiopian to Gregorian:", { year, month, day }, "→", [gYear, gMonth, gDay]);

  return `${gYear}-${String(gMonth).padStart(2, "0")}-${String(gDay).padStart(2, "0")}`;
};

useEffect(() => {
  console.log(`🗓️ Calendar mode changed: ${isGregorian ? "Gregorian" : "Ethiopian"}`);
}, [isGregorian]);


  return (
    <CalendarContext.Provider
      value={{
        isGregorian,
        toggleCalendar,
        formatDateForDisplay,
        convertToGregorian
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
