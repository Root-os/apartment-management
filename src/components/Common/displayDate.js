// src/components/common/DisplayDate.js
import React, { useContext } from 'react';
import { CalendarContext } from '../../context/calendarContext';

const DisplayDate = ({ date, fallback = 'N/A' }) => {
  const { formatDateForDisplay } = useContext(CalendarContext);

  if (!date) return fallback;
  return <>{formatDateForDisplay(date)}</>;
};

export default DisplayDate;
