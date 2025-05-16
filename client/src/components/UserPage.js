import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaTrashAlt, FaSearch, FaEye, FaDownload } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

const UserPage = () => {
  // State for user data, search query, filtered results, and sort options.
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortField, setSortField] = useState('fullName');
  const [sortOrder, setSortOrder] = useState('asc');

  const navigate = useNavigate();

  // Fetch users on component mount.
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users whenever searchQuery, users, sortField, or sortOrder change.
  useEffect(() => {
    let tempUsers = [...users];

    // Filter based on search query.
    if (searchQuery) {
      tempUsers = tempUsers.filter((user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort the filtered users.
    tempUsers.sort((a, b) => {
      const fieldA = a[sortField]?.toLowerCase();
      const fieldB = b[sortField]?.toLowerCase();
      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(tempUsers);
  }, [searchQuery, users, sortField, sortOrder]);

  /**
   * Fetches all users from the backend API.
   */
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  /**
   * Deletes a user by their ID and refreshes the user list.
   * @param {string} userId - The ID of the user to be deleted.
   */
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the user list after deletion.
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  /**
   * Generates a PDF containing the details of all filtered users.
   */
  const downloadAllUsersPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('User List', 14, 22);
    doc.setFontSize(12);

    // Define starting coordinates.
    let yPosition = 32;
    const lineHeight = 10;

    // Add table header
    doc.text('Name', 14, yPosition);
    doc.text('Email', 80, yPosition);
    doc.text('Role', 150, yPosition);
    yPosition += lineHeight;

    // Add a line under header.
    doc.setLineWidth(0.5);
    doc.line(14, yPosition - 5, 200, yPosition - 5);

    // Loop through filtered users and add their details.
    filteredUsers.forEach((user, index) => {
      // Check if we need to add a new page
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(user.fullName, 14, yPosition);
      doc.text(user.email, 80, yPosition);
      doc.text(user.role, 150, yPosition);
      yPosition += lineHeight;
    });

    // Save the generated PDF.
    doc.save('User_List.pdf');
  };

  /**
   * Navigates to the user detail page.
   * @param {string} userId - The ID of the user.
   */
  const handleViewUser = (userId) => {
    navigate(`/dashboard/users/${userId}`);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex justify-center"
      style={{ fontFamily: 'Roboto, sans-serif' }}
    >
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">User Management</h1>

        {/* Search, Sort, and Download PDF Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="flex items-center w-full sm:w-1/2 mb-4 sm:mb-0">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full appearance-none bg-transparent border-none text-gray-700 py-1 px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="border border-gray-300 rounded p-2"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="fullName">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
            </select>
            <select
              className="border border-gray-300 rounded p-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button
              onClick={downloadAllUsersPDF}
              className="flex items-center text-green-500 hover:text-green-600 transition-colors duration-200 ml-2"
              title="Download PDF for All Users"
            >
              <FaDownload className="mr-1" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>

        {/* User List */}
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between max-w-sm w-full overflow-hidden"
              >
                {/* User Info */}
                <div className="flex items-start space-x-4">
                  <div className="text-blue-500 text-3xl">
                    <FaUserEdit />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 truncate">{user.fullName}</h2>
                    <p className="text-gray-600 break-words truncate">{user.email}</p>
                    <p className="text-gray-500 text-sm">{user.role}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => handleViewUser(user._id)}
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-200"
                    title="View User"
                  >
                    <FaEye className="mr-1" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200"
                    title="Delete User"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
