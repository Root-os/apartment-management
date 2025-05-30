import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Choice = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Array of card data with updated subtitles
    const cards = [
        { 
            title: 'BIRRA MALL Management System', 
            subtitle: 'Manage leasing, tenants, and operations for Birra Mall', 
            bgColor: 'bg-green-700',
            url:process.env.REACT_APP_BIRRA_MALL
        },
        { 
            title: 'BIRRA TOWER Management System', 
            subtitle: 'Oversee facilities and services for Birra Tower', 
            bgColor: 'bg-yellow-900',
            url:process.env.REACT_APP_BIRRA_TOWER 
        },
        { 
            title: 'BIRRA PLAZA Management System', 
            subtitle: 'Handle plaza operations and tenant coordination', 
            bgColor: 'bg-teal-700' ,
            url:process.env.REACT_APP_BIRRA_PLAZA
        },
        { 
            title: 'BIRRA GROUP Website Management System', 
            subtitle: 'Update and manage the Birr Group website content', 
            bgColor: 'bg-teal-700',
            url:process.env.REACT_APP_BIRR_GROUP
        },
        { 
            title: 'BIRRA GROUP INVENTORY System', 
            subtitle: 'Track and manage inventory for Birra Group', 
            bgColor: 'bg-blue-900',
            comingSoon: true,
            url:process.env.REACT_APP_BIRRA_INVENTORY
        },
        { 
            title: 'NAFISIFE INTERNATIONAL BUSINESS WEBSITE MANAGEMENT', 
            subtitle: 'Administer Nifesife’s international business website', 
            bgColor: 'bg-teal-700',
            comingSoon: true ,
            url:process.env.REACT_APP_NAFISIFE
        },
        { 
            title: 'BIRRA APARTMENT WEBSITE MANAGEMENT', 
            subtitle: 'Control apartment trading and listings online', 
            highlight: 'ADMIN CONTROL', 
            bgColor: 'bg-yellow-900',
            url:process.env.REACT_APP_BIRRA_APARTMENT, 
        },
    ];

    const handleLoginClick = (card) => {
        if (card.comingSoon) {
            setIsModalOpen(true);
        } else {
            window.location.href = card.url; // Redirect to the respective URL
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div
            className="flex flex-col min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: 'url("/bg.jpg")',
            }}
        >
            {/* Navbar */}
            <nav className="marquee-wrapper text-white">
                <div className=" h1 marquee-content text-xl font-bold">
                    Birra Group Trading PLC
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow text-white bg-black bg-opacity-50 p-6">
          
                {/* Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-lg shadow-lg text-white ${card.bgColor} flex flex-col items-center justify-center h-64 ${
                                card.highlight ? 'border-4 border-red-500' : ''
                            }`}
                        >
                            <h2 className="text-3xl font-bold text-center">{card.title}</h2>
                            <p className="text-base mt-3 text-center">{card.subtitle}</p>
                            {card.highlight && (
                                <p className="text-xl font-semibold mt-3">{card.highlight}</p>
                            )}
                            <button
                                className="mt-6 px-6 py-2 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                                onClick={() => handleLoginClick(card)}
                            >
                                Login
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coming Soon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 text-center max-w-sm">
                        <h2 className="text-2xl font-bold text-black mb-4">Coming Soon</h2>
                        <p className="text-black mb-6">This feature is under development and will be available soon!</p>
                        <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-black bg-opacity-60 text-white text-center py-4">
                Developed by Abyssinia Software Technology PLC
            </footer>
        </div>
    );
};

export default Choice;