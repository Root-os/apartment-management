import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBuilding, FaBook, FaTicketAlt, FaQuestionCircle, FaImage, FaShoppingCart, FaUsers, FaCogs, FaHandsHelping, FaSlidersH, FaUserTie } from 'react-icons/fa';

const Dashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardVisibility = {
    apartments: true,
    blogs: true,
    bookings: false,
    categories: true,
    contacts: true,
    faqs: true,
    galleries: true,
    partners: true,
    resources: true,
    reviews: true,
    services: true,
    sliders: true,
    testimonies: true,
    users: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://website.smartbingogames.com/api/about/dashboard');
        setCounts(response.data); // Store the counts in state
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchData();
  }, []);

  // Dynamic color generation
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Icons mapping based on the counts data
  const iconMapping = {
    aboutCompanies: <FaBuilding size={30} />,
    apartments: <FaBuilding size={30} />,
    blogs: <FaBook size={30} />,
    bookings: <FaTicketAlt size={30} />,
    categories: <FaQuestionCircle size={30} />,
    contacts: <FaImage size={30} />,
    faqs: <FaQuestionCircle size={30} />,
    galleries: <FaImage size={30} />,
    partners: <FaUserTie size={30} />,
    resources: <FaCogs size={30} />,
    reviews: <FaHandsHelping size={30} />,
    services: <FaCogs size={30} />,
    sliders: <FaSlidersH size={30} />,
    testimonies: <FaTicketAlt size={30} />,
    users: <FaUsers size={30} />,
  };

  // If still loading, show a loading spinner or placeholder
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a more fancy loading spinner if needed
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {counts &&
        Object.keys(counts).map((key) => {
          if (!cardVisibility[key]) {
            return null; // Skip rendering the card if it's disabled
          }

          const count = counts[key];
          return (
            <div
              key={key}
              className="card hover:shadow-xl transition-all transform hover:scale-105"
              style={{ backgroundColor: generateRandomColor() }}
            >
              <div className="card-body p-6 mt-10">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="text-black">{iconMapping[key]}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </h3>
                    <p className="text-lg text-black">{count}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Dashboard;
