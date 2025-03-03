import routes from '../routes/sidebar';
// import tenantRoutes from '../routes/tenantSideBar';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarSubmenu from './SidebarSubmenu';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useDispatch } from 'react-redux';
import {useEffect, useState} from 'react'


function LeftSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const [expandedIndex, setExpandedIndex] = useState(null)

  const handleExpand = (index) => {
    // If the clicked tab is already expanded, close it
    setExpandedIndex(expandedIndex === index ? null : index)
  }

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

    const handleRoutes=()=>{
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        if(token && role === 'admin'){
            return routes
        }else if(token && role === 'employee')
        {
//return employeeRoutes
        }
        else if(token && role === 'tenant'){
// return tenantRoutes
        }
    }

    return (
        <div className="drawer-side z-30">
            <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
            <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
                <button
                    className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
                    onClick={() => close()}
                >
                    <XMarkIcon className="h-5 inline-block w-5" />
                </button>

                {/* Logo */}
                <li className="mb-2 font-semibold text-xl">
                    <div>
                        <img className="mask mask-squircle w-10" src="/logoams.png" alt="AMS Logo" />
                        Apartment Management System
                    </div>
                </li>

                {/* Render Routes */}
                {routes.map((route, k) => {
                    return (
                        <li key={k}>
                            {route.submenu ? (
                                <SidebarSubmenu
                                key={k} 
                                submenu ={route.submenu}
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
                                        `${isActive ? 'font-semibold bg-base-200' : 'font-normal'}`
                                    }
                                    onClick={handleLinkClick} // Close sidebar when any link is clicked
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
