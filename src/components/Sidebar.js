import React, { useEffect, useState } from 'react';
import { FaHome, FaReceipt, FaCalendarAlt, FaUserTie, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [activeItem, setActiveItem] = useState('/dashboard/overview');

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
    <div className="fixed top-0 bottom-0 left-0 w-60 bg-white shadow-lg z-50" style={{ fontFamily: 'roboto' }}>
      <div className="p-5 bg-indigo-600 text-white text-center text-2xl font-bold">
        LawConnect
      </div>
      <nav className="mt-10">
        {userRole === 'CLIENT' && (
          <>
            <Link
              to="/dashboard/overview"
              onClick={() => handleItemClick('/dashboard/overview')}
              className={`flex items-center p-3 mb-2 rounded-md ${
                activeItem === '/dashboard/overview' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
              } transition duration-150`}
            >
              <FaHome className="mr-3" />
              Overview
            </Link>
            <Link
              to="/dashboard/lawyer"
              onClick={() => handleItemClick('/dashboard/lawyer')}
              className={`flex items-center p-3 mb-2 rounded-md ${
                activeItem === '/dashboard/lawyer' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
              } transition duration-150`}
            >
              <FaUserTie className="mr-3" />
              Lawyers
            </Link>
            <Link
              to="/dashboard/user/appointments"
              onClick={() => handleItemClick('/dashboard/user/appointments')}
              className={`flex items-center p-3 mb-2 rounded-md ${
                activeItem === '/dashboard/user/appointments' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
              } transition duration-150`}
            >
              <FaCalendarAlt className="mr-3" />
              Appointments
            </Link>
            <Link
              to="/dashboard/message"
              onClick={() => handleItemClick('/dashboard/message')}
              className={`flex items-center p-3 mb-2 rounded-md ${
                activeItem === '/dashboard/message' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
              } transition duration-150`}
            >
              <FaEnvelope className="mr-3" />
              Messages
            </Link>
          </>
        )}
        {userRole === 'LAWYER' && (
          <>
            <Link
              to="/dashboard/law-overview"
              onClick={() => handleItemClick('/dashboard/law-overview')}
              className={`flex items-center p-3 mb-2 rounded-md ${
                activeItem === '/dashboard/law-overview' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
              } transition duration-150`}
            >
              <FaHome className="mr-3" />
              Overview
            </Link>
            <Link
              to="/dashboard/message"
              onClick={() => handleItemClick('/dashboard/message')}
              className={`flex items-center p-3 mb-2 rounded-md ${
                activeItem === '/dashboard/message' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
              } transition duration-150`}
            >
              <FaEnvelope className="mr-3" />
              Messages
            </Link>
          </>
        )}
       {userRole === 'ADMIN' && (
          <>
            <Link
              to="/dashboard/listuser"
              onClick={() => handleItemClick('/dashboard/listuser')}
              className={`flex items-center p-3 mb-2 rounded-md ${
                activeItem === '/dashboard/listuser' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
              } transition duration-150`}
            >
              <FaHome className="mr-3" />
              Manage-user
            </Link>
            <Link
              to="/dashboard/statistics"
              onClick={() => handleItemClick('/dashboard/statistics')}
              className={`flex items-center p-3 mb-2 rounded-md ${
                activeItem === '/dashboard/statistics' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
              } transition duration-150`}
            >
              <FaEnvelope className="mr-3" />
              Statistics
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
