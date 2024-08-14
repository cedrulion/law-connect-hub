import React, { useState } from 'react';
import { FaCaretDown, FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md text-black">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search here..."
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center relative">
        <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
          <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center bg-gray-200">
            <FaUserCircle className="text-xl text-gray-700" />
          </div>
          <span className="font-semibold text-black ml-2">{loggedInUser.fullName}</span>
          <FaCaretDown className="ml-2 text-xl" />
        </div>
        {dropdownVisible && (
          <div className="absolute right-0 mt-32 w-48 bg-white rounded-md shadow-lg z-50">
            <div className="py-2">
               <Link to="/dashboard/profile" 
                className="flex items-center w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200"
              >
                <FaUser className="mr-2 text-gray-700" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200"
              >
                <FaSignOutAlt className="mr-2 text-gray-700" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
