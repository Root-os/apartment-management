// src/components/common/DisplayDate.js
import React, { useContext } from 'react';
import { CalendarContext } from '../../context/calendarContext';
import normalizeDate from '../../utils/normalizedDate'; 

const DisplayDate = ({ date, fallback = 'N/A' }) => {
  const { formatDateForDisplay } = useContext(CalendarContext);

  if (!date) return fallback;

  // Normalize date first
  const normalized = normalizeDate(date);

  // Format for display
  const formatted = formatDateForDisplay(normalized);

  return <>{formatted || fallback}</>;
};

export default DisplayDate;
