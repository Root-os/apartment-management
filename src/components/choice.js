import React from 'react';
import { useNavigate } from 'react-router-dom';

const Choice = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Select Your Login Type</h1>
            <div className="flex space-x-4">
                <button
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                    onClick={() => navigate('/tenant-login')}
                >
                    As Tenant
                </button>
                <button
                    className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                    onClick={() => navigate('/login')}
                >
                    As Employee 
                </button>
            </div>
        </div>
    );
};

export default Choice;
