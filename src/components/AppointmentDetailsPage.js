import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaExclamationCircle } from 'react-icons/fa';

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching appointment details');
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-800 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-lg">
          <FaExclamationCircle className="inline mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans text-gray-800 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Appointment Details</h1>
        <div className="mb-4">
          <p className="text-lg">
            <FaUser className="inline mr-2 text-blue-600" />
            <strong>Client :</strong> {appointment.clientId.fullName}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <FaUser className="inline mr-2 text-green-600" />
            <strong>Lawyer :</strong> {appointment.lawyerId.fullName}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <FaCalendarAlt className="inline mr-2 text-yellow-600" />
            <strong>Date:</strong> {new Date(appointment.date).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-lg">
            <FaExclamationCircle className="inline mr-2 text-red-600" />
            <strong>Status:</strong> {appointment.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
