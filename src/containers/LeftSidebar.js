import routes from '../routes/sidebar';
// import tenantRoutes from '../routes/tenantSideBar';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarSubmenu from './SidebarSubmenu';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useState, useEffect } from 'react';
import axios from 'axios';  // Don't forget to import axios

function LeftSidebar() {
    const location = useLocation();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [settingData, setSettingData] = useState(null);  // Add state for setting data

    const handleExpand = (index) => {
        // If the clicked tab is already expanded, close it
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Close the sidebar function
    const close = () => {
        document.getElementById('left-sidebar-drawer').click();
    };

    // Close the sidebar on any link click if the screen is small
    const handleLinkClick = () => {
        if (window.innerWidth <= 1024) {
            close();
        }
    };

    // Fetch setting data when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');  // Get token if needed for authorization

        // Fetch settings from the API
        axios
            .get(`${process.env.REACT_APP_BASE_URL}setting`, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Add the token to the header if necessary
                },
            })
            .then((response) => {
                // Assuming the response is an array with a single setting object
                if (Array.isArray(response.data)) {
                    setSettingData(response.data[0]);  // Set the first object from the response
                }
            })
            .catch((error) => {
                console.error('Error fetching setting data:', error);
            });
    }, []);  // Run this only once when the component mounts

    return (
        <div className="drawer-side z-30">
            <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
            <ul className="menu pt-2 w-80 min-h-full text-white bg-green-600">
                <button
                    className="btn btn-ghost bg-gray-200 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
                    onClick={() => close()}
                >
                    <XMarkIcon className="h-5 inline-block w-5 text-black" />
                </button>

                {/* Logo and Building Name */}
                <li className="mb-2 font-semibold text-xl text-white">
                    <div>
                        {/* Dynamically set the logo */}
                        {settingData && settingData.logos ? (
                            <img
                                className="mask mask-squircle w-10"
                                src={settingData.logos}
                                alt="Logo"
                            />
                        ) : (
                            <img
                                className="mask mask-squircle w-10"
                                src="/logoams.png"  // Fallback logo
                                alt="AMS Logo"
                            />
                        )}
                        {/* Dynamically set the building name */}
                        <span>{settingData ? settingData.buildingName : 'Apartment Management System'}</span>
                    </div>
                </li>

                {/* Render Routes */}
                {routes.map((route, k) => {
                    return (
                        <li key={k}>
                            {route.submenu ? (
                                <SidebarSubmenu
                                    key={k} 
                                    submenu={route.submenu}
                                    icon={route.icon}
                                    name={route.name}
                                    isExpanded={expandedIndex === k}
                                    onExpand={() => handleExpand(k)}
                                />
                            ) : (
                                <NavLink
                                    end
                                    to={route.path}
                                    className={({ isActive }) =>
                                        `${isActive ? 'font-semibold bg-green-700 text-white' : 'font-normal text-white'}`
                                    }
                                    onClick={handleLinkClick} 
                                >
                                    {route.icon} {route.name}
                                    {location.pathname === route.path ? (
                                        <span
                                            className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                                            aria-hidden="true"
                                        ></span>
                                    ) : null}
                                </NavLink>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default LeftSidebar;
