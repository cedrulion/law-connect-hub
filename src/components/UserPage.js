import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex justify-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">User Management</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search users..."
              className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div 
              key={user._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between max-w-sm w-full overflow-hidden"
            >
              {/* User Info */}
              <div className="flex items-start space-x-4">
                <div className="text-blue-500 text-3xl">
                  <FaUserEdit />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h2 className="text-xl font-bold text-gray-800 truncate">{user.fullName}</h2>
                  <p className="text-gray-600 break-words truncate max-w-full">{user.email}</p>
                  <p className="text-gray-500 text-sm">{user.role}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-4">

                <button 
                  className="text-red-500 hover:text-red-600 transition-colors duration-200"
                  onClick={() => deleteUser(user._id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
