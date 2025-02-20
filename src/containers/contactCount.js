import React, { useEffect, useState } from 'react';
import InboxIcon from '@heroicons/react/24/outline/InboxIcon';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';

function ContactCount() {
    const [contactCount, setContactCount] = useState(0); 
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [hasNewMessages, setHasNewMessages] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContactCount = async () => {
            try {
                const response = await axios.get('https://website.smartbingogames.com/api/contact/count');
                
                const newCount = response.data.count;

                const previousCount = localStorage.getItem('previousContactCount') || 0;
                const newMessages = newCount - previousCount; // Calculate how many new messages

                if (newMessages > 0) {
                    setHasNewMessages(true); // If there are new messages, mark as true
                    setNewMessagesCount(newMessages); // Update the count of new messages
                } else {
                    setHasNewMessages(false); // If no new messages, mark as false
                    setNewMessagesCount(0); // Reset new messages count
                }

                setContactCount(newCount);
            } catch (error) {
                console.error('Error fetching contact count:', error);
            }
        };

        fetchContactCount();
    }, []);

    const handleNotificationClick = () => {
        navigate('./contact-view');  
        setHasNewMessages(false); 
        localStorage.setItem('previousContactCount', contactCount);// Save the current count to localStorage
    };

    return (
        <button className="btn btn-ghost ml-4 btn-circle" onClick={handleNotificationClick}>
            <div className="indicator">
                <InboxIcon className="h-6 w-6" /> 
                {hasNewMessages && (
                    <span className="indicator-item badge badge-secondary badge-sm">
                        {newMessagesCount}
                    </span>
                )}
            </div>
        </button>
    );
}

export default ContactCount;
