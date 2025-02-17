import React, { useEffect, useState } from 'react';
import { FaHome, FaReceipt, FaCalendarAlt, FaUserTie, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const SimpleAlert = ({ children, variant = 'error' }) => (
  <div className={`p-4 rounded-md ${
    variant === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-700'
  }`}>
    {children}
  </div>
);

const Sidebar = ({ onClose }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const navItems = {
    CLIENT: [
      { path: '/dashboard/overview', label: 'Overview', icon: <FaHome />, description: 'View your dashboard overview' },
      { path: '/dashboard/lawyer', label: 'Lawyers', icon: <FaUserTie />, description: 'Browse available lawyers' },
      { path: '/dashboard/user/appointments', label: 'Appointments', icon: <FaCalendarAlt />, description: 'Manage your appointments' },
      { path: '/dashboard/message', label: 'Messages', icon: <FaEnvelope />, description: 'View your messages' },
      { path: '/dashboard/case', label: 'Cases', icon: <FaEnvelope />, description: 'View your cases' },
    ],
    LAWYER: [
      { path: '/dashboard/law-overview', label: 'Overview', icon: <FaHome />, description: 'View your lawyer dashboard' },
      { path: '/dashboard/message', label: 'Messages', icon: <FaEnvelope />, description: 'Manage client communications' },
      { path: '/dashboard/cases', label: 'Cases', icon: <FaEnvelope />, description: 'Manage client cases' },
    ],
    ADMIN: [
      { path: '/dashboard/listuser', label: 'Manage Users', icon: <FaUserTie />, description: 'Manage system users' },
      { path: '/dashboard/statistics', label: 'Statistics', icon: <FaReceipt />, description: 'View system statistics' },
    ],
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true);
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
          throw new Error('No user data found');
        }
        setUserRole(loggedInUser.role);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 bottom-0 left-0 w-60 bg-white shadow-lg flex items-center justify-center">
        <FaSpinner className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 bottom-0 left-0 w-60 bg-white shadow-lg p-4">
        <SimpleAlert>{error}</SimpleAlert>
      </div>
    );
  }

  return (
    <aside 
      className="fixed top-0 bottom-0 left-0 w-60 bg-white shadow-lg flex flex-col transition-transform duration-200 ease-in-out"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-5 bg-indigo-600 text-white">
        <h1 className="text-2xl font-bold text-center">LawConnect</h1>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto">
        <ul className="px-3 space-y-1">
          {navItems[userRole]?.map(({ path, label, icon, description }) => {
            const isActive = location.pathname === path;
            
            return (
              <li key={path}>
                <Link
                  to={path}
                  onClick={onClose}
                  className={`
                    group flex items-center px-3 py-2 rounded-md transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  title={description}
                >
                  <span className={`mr-3 transition-colors duration-200
                    ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}
                  `}>
                    {icon}
                  </span>
                  <span className="flex-1">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Logged in as {userRole?.toLowerCase()}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;