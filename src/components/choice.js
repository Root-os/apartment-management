import React from 'react';
import { useNavigate } from 'react-router-dom';

const Choice = () => {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: 'url("/bg.jpg")', 
            }}
        >
            {/* Navbar */}
            <nav className="bg-black bg-opacity-60 text-white py-4 px-8">
                <h1 className="text-xl font-bold">Birra Group Trading PLC</h1>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow text-white bg-black bg-opacity-50">
                <h1 className="text-3xl font-bold mb-6">Select Your Login Type</h1>
                <div className="flex space-x-4">
                    <button
                        className="px-6 py-3 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                        onClick={() => navigate('/tenant-login')}
                    >
                        As Tenant
                    </button>
                    <button
                        className="px-6 py-3 bg-green-600 rounded-lg shadow-md hover:bg-green-700"
                        onClick={() => navigate('/login')}
                    >
                        As Employee
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black bg-opacity-60 text-white text-center py-4">
                Developed by Abyssinia Software Technology PLC
            </footer>
        </div>
    );
};

export default Choice;
