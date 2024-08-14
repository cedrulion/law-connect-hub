import React, { useEffect, useState } from 'react';
import { FaHome, FaReceipt, FaBoxes, FaCogs, FaBell, FaChartLine } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Frame from '../Assets/Frame.png';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [activeItem, setActiveItem] = useState("/dashboard/overview");
  

  useEffect(() => {
    // Fetch user role from localStorage
    const fetchUserRole = () => {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (loggedInUser) {
        setUserRole(loggedInUser.role);
      }
    };

    fetchUserRole();
  }, []);

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 w-56 shadow-lg" style={{ fontFamily: 'inter' }}>
     <p className="text-center px-3 py-3">LawConnect </p>
      <nav className="mt-10">
        {userRole === 'CLIENT' && (
          <>
            <Link
              to="/dashboard/overview"
              onClick={() => handleItemClick('/dashboard/overview')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/overview' ? 'bg-gray-200 text-black' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/overview' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/overview' ? '4px solid #8155ff' : '',
              }}
            >
              <FaHome className="mr-3" /> Overview
            </Link>
            <Link
              to="/dashboard/message"
              onClick={() => handleItemClick('/dashboard/message')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/message' ? 'bg-gray-200 text-black' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/message' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/message' ? '4px solid #8155ff' : '',
              }}
            >
              <FaReceipt className="mr-3" /> Messages
            </Link>

          </>
        )}
        {userRole === 'LAWYER' && (
         <>
            <Link
              to="/dashboard/law-overview"
              onClick={() => handleItemClick('/dashboard/law-overview')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/law-overview' ? 'bg-gray-200 text-black' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/law-overview' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/' ? '4px solid #8155ff' : '',
              }}
            >
           <FaHome className="mr-3" /> Overview
            </Link>
             <Link
              to="/dashboard/message"
              onClick={() => handleItemClick('/dashboard/message')}
              className={`flex items-center p-2 mt-5 ${
                activeItem === '/dashboard/message' ? 'bg-gray-200 text-black' : ''
              }`}
              style={{
                paddingRight: activeItem === '/dashboard/message' ? '85px' : '',
                borderLeft: activeItem === '/dashboard/message' ? '4px solid #8155ff' : '',
              }}
            >
              <FaReceipt className="mr-3" /> Messages
            </Link>

          </>
 )}
      </nav>
    </div>
  );
};

export default Sidebar;