import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaBell, FaBlog, FaCalendarCheck, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Lawoverview = () => {
  const [notifications, setNotifications] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched appointments:', response.data); // Debugging

        const lawyerAppointments = response.data.filter(
          (appointment) => appointment.lawyerId._id === loggedInUser._id
        );
        setAppointments(lawyerAppointments);

        // Notifications: Latest appointments
        const latestAppointments = lawyerAppointments.slice(-5); // Get the latest 5 appointments
        setNotifications(latestAppointments);

        // Appointment Requests: Appointments with status 'PENDING'
        const pendingRequests = lawyerAppointments.filter(
          (appointment) => appointment.status === 'PENDING'
        );
        setAppointmentRequests(pendingRequests);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err); // Debugging
        setError(err.response?.data?.message || 'Error fetching appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, loggedInUser._id]);

  const handleAppointmentClick = () => {
    navigate(`/dashboard/lawyer/appointments`);
  };

  const handleAddAppointment = () => {
    // Placeholder function for adding new appointments
    console.log('Add new appointment clicked');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 font-sans text-gray-800 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back {loggedInUser.fullName}</h1>
          <p className="text-sm">Have a great day...</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-white p-4 rounded shadow-md flex items-center hover:bg-gray-300 cursor-pointer" onClick={handleAppointmentClick}>
            <FaCalendarCheck className="text-xl text-gray-600" />
            <div className="ml-2">
              <p className="text-sm">Appointments</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
          </div>
          <button className="bg-black text-white p-4 rounded shadow-md flex items-center" onClick={handleAddAppointment}>
            + Add New Appointment
          </button>
        </div>
      </div>

      <div className="mt-6 flex">
        <button className="flex-1 bg-gray-200 p-6 rounded shadow-md flex items-center justify-center mr-2">
          <FaBell className="text-3xl text-gray-600" />
          <p className="ml-2 text-xl">Notifications</p>
        </button>
        <button className="flex-1 bg-gray-200 p-6 rounded shadow-md flex items-center justify-center ml-2">
          <FaBlog className="text-3xl text-gray-600" />
          <p className="ml-2 text-xl">Blogspot</p>
        </button>
      </div>

      <div className="mt-6 flex">
        <div className="flex-1 bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <h2 className=" font-semibold mb-4">Appointment Requests</h2>
          {appointmentRequests.length === 0 ? (
            <p>No pending appointment requests.</p>
          ) : (
            appointmentRequests.map(request => (
              <div key={request._id} className="flex items-center mb-4">
                <div className="ml-4">
                  <p className="text-sm font-bold">{request.lawyerId.fullName}</p>
                  <p className="text-xs text-gray-500">{new Date(request.date).toLocaleString()}</p>
                  <p className={`text-xs flex items-center ${request.status === 'Confirmed' ? 'text-green-500' : 'text-red-500'}`}>
                    {request.status === 'Confirmed' ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    {request.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-1/4 bg-white p-6 rounded shadow-md ml-6">
          <h2 className="text-xl font-bold mb-4">Appointment Date</h2>
          <Calendar className="mb-4" />
          {appointments.length === 0 ? (
            <p>No appointments scheduled.</p>
          ) : (
            appointments.map(appointment => (
              <div key={appointment._id} className="flex items-center mb-4">
                <div className="ml-4">
                  <p className="text-sm font-bold">{appointment.clientId.fullName}</p> {/* Assuming clientId has fullName */}
                  <p className="text-xs text-gray-500">{new Date(appointment.date).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{appointment.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Lawoverview;
