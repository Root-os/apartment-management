// TotalBookings.js
import React, { useEffect, useState } from 'react';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TotalBookings() {
    const [totalBookings, setTotalBookings] = useState(0); // State to store the total bookings
    const [newBookingsCount, setNewBookingsCount] = useState(0);
    const [hasNewBookings, setHasNewBookings] = useState(false);
    const navigate = useNavigate(); // For navigation when the icon is clicked

    // Fetch totalBookings from the API
    useEffect(() => {
        const fetchTotalBookings = async () => {
            try {
                const response = await axios.get('');
                const newCount = response.data.totalBookings; // Total bookings from API

                // Get the previous count from localStorage
                const previousCount = localStorage.getItem('previousBookingCount') || 0;
                const newBookings = newCount - previousCount; // Calculate the difference for new bookings

                if (newBookings > 0) {
                    setHasNewBookings(true); // If there are new bookings, set to true
                    setNewBookingsCount(newBookings); // Set the count of new bookings
                } else {
                    setHasNewBookings(false); // No new bookings, set to false
                    setNewBookingsCount(0); // Reset the new bookings count
                }

                setTotalBookings(newCount);
            } catch (error) {
                console.error('Error fetching total bookings:', error);
            }
        };

        fetchTotalBookings();
    }, [])
    const handleNotificationClick = () => {
        navigate('./bookApartment-view');
        setHasNewBookings(false); 
        localStorage.setItem('previousBookingCount', totalBookings);
    };

    return (
        <button className="btn btn-ghost ml-4 btn-circle" onClick={handleNotificationClick}>
            <div className="indicator">
                <BellIcon className="h-6 w-6" />
                {hasNewBookings && (
                    <span className="indicator-item badge badge-secondary badge-sm">
                        {newBookingsCount} {/* Display the number of new bookings */}
                    </span>
                )}
            </div>
        </button>
    );
}

export default TotalBookings;
