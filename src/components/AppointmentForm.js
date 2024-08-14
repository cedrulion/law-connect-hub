import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AppointmentForm = ({ counselor, onClose }) => {
  const [date, setDate] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Retrieved Token:', storedToken);
    setToken(storedToken);
  }, []);

  const handleSubmit = async (e) => {
   const token = localStorage.getItem('token');
   console.log('Token:', token);

    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/appointments',
        { lawyerEmail: counselor.email, date },
        {
           headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Appointment requested successfully:', response.data);
      onClose();
    } catch (error) {
      console.error('Error requesting appointment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg relative w-3/4 max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Request Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded shadow-md">
            Submit
          </button>
        </form>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
          <FaTimes size={24} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentForm;
