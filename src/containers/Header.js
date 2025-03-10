import { themeChange } from 'theme-change';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil';
import TotalBookings from '../containers/countBooking';
import ContactCount from '../containers/contactCount';
import { NavLink, Link, useLocation } from 'react-router-dom';

function Header() {
    const dispatch = useDispatch();
    const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme'));

    useEffect(() => {
        themeChange(false);
        if (currentTheme === null) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setCurrentTheme('dark');
            } else {
                setCurrentTheme('light');
            }
        }
    }, []);

    // Opening right sidebar for notification
    const openNotification = () => {
        dispatch(openRightDrawer({ header: 'Notifications', bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION }));
    };

    async function logoutUser() {
        const token = localStorage.getItem('token');
        if (token) {
            await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        }
        localStorage.clear();
        window.location.href = '/';
    }

    // Define pages for the dropdown
    const pages = [
        { name: 'Add Tenant', path: '/app/tenant-add' },
        { name: 'View Unit', path: '/app/unit-view' },
        { name: 'Notiffication', path: '/app/all-notfication' },
        { name: 'Complains', path: '/app/complain-fromT-view' },
        { name: 'Stocks', path: '/app/view-stocks' },
    ];

    return (
        <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
            {/* Menu toggle for mobile view or small screen */}
            <div className="flex-1">
                <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                    <Bars3Icon className="h-5 inline-block w-5" />
                </label>
                <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
            </div>

            <div className="flex-none">
                {/* Pages Dropdown */}
                <div className="dropdown mr-4">
                    <label tabIndex={0} className="btn btn-ghost">
                        Pages
                    </label>
                    <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        {pages.map((page) => (
                            <li key={page.path}>
                                <Link to={page.path}>{page.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Light and dark theme selection toggle */}
                <label className="swap">
                    <input type="checkbox" />
                    <SunIcon
                        data-set-theme="light"
                        data-act-class="ACTIVECLASS"
                        className={'fill-current w-6 h-6 ' + (currentTheme === 'dark' ? 'swap-on' : 'swap-off')}
                    />
                    <MoonIcon
                        data-set-theme="dark"
                        data-act-class="ACTIVECLASS"
                        className={'fill-current w-6 h-6 ' + (currentTheme === 'light' ? 'swap-on' : 'swap-off')}
                    />
                </label>
                

                {/* Profile icon, opening menu on click */}
                <div className="dropdown dropdown-end ml-4">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src="https://placeimg.com/80/80/people" alt="profile" />
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li className="justify-between">
                            <Link to={'/app/view-settings'}>
                                 Settings
                                <span className="badge">New</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/app/bill-type-view'}>Bill History</Link>
                        </li>
                        <div className="divider mt-0 mb-0"></div>
                        <li>
                            <a onClick={logoutUser}>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;