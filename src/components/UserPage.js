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
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6" style={{ fontFamily: 'roboto' }}>
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>
        
        <div className="mb-6">
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search users..."
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user._id} className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-gray-600 text-3xl mr-4">
                  <FaUserEdit />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-500 text-sm">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-500 hover:text-blue-600">
                  <FaUserEdit />
                </button>
                <button 
                  className="text-red-500 hover:text-red-600"
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
