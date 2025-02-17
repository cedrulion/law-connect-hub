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

        const lawyerAppointments = response.data.filter(
          (appointment) => appointment.lawyerId._id === loggedInUser._id
        );
        setAppointments(lawyerAppointments);

        const latestAppointments = lawyerAppointments.slice(-5);
        setNotifications(latestAppointments);

        const pendingRequests = lawyerAppointments.filter(
          (appointment) => appointment.status === 'PENDING'
        );
        setAppointmentRequests(pendingRequests);

        setLoading(false);
      } catch (err) {
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
    console.log('Add new appointment clicked');
  };

  const highlightDates = ({ date, view }) => {
    if (view === 'month') {
      const appointmentDates = appointments.map(appointment => new Date(appointment.date).toDateString());
      if (appointmentDates.includes(date.toDateString())) {
        return 'highlight';
      }
    }
    return null;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-blue-600 text-xl">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-600 text-xl">Error: {error}</div>
    </div>;
  }

  return (
    <div className="p-6 text-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      <style>
        {`
          .highlight {
            background-color: #3b82f6 !important;
            color: white !important;
            border-radius: 50%;
          }
          .react-calendar {
            border: none;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            border-radius: 0.5rem;
            padding: 1rem;
          }
          .react-calendar__tile--active {
            background: #3b82f6 !important;
            color: white !important;
          }
          .react-calendar__tile:enabled:hover {
            background-color: #93c5fd !important;
          }
        `}
      </style>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Welcome back, {loggedInUser.fullName}</h1>
          <p className="text-blue-600 mt-2">Have a great day ahead!</p>
        </div>
        <div className="flex space-x-4">
          <div 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center hover:bg-blue-50 cursor-pointer border border-blue-100" 
            onClick={handleAppointmentClick}
          >
            <FaCalendarCheck className="text-2xl text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-blue-900 font-medium">Requested Appointments</p>
              <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <button className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center hover:bg-blue-50 border border-blue-100">
          <FaBell className="text-3xl text-blue-600" />
          <p className="ml-3 text-xl text-blue-900 font-medium">Notifications</p>
        </button>
        <button className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center hover:bg-blue-50 border border-blue-100">
          <FaBlog className="text-3xl text-blue-600" />
          <p className="ml-3 text-xl text-blue-900 font-medium">Blogspot</p>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Notifications</h2>
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Appointment Requests</h3>
          {appointmentRequests.length === 0 ? (
            <p className="text-gray-600">No pending appointment requests.</p>
          ) : (
            <div className="space-y-4">
              {appointmentRequests.map(request => (
                <div key={request._id} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="ml-4 flex-grow">
                    <p className="text-lg font-bold text-blue-900">{request.lawyerId.fullName}</p>
                    <p className="text-sm text-gray-600">{new Date(request.date).toLocaleString()}</p>
                    <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      request.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status === 'Confirmed' ? (
                        <FaCheck className="mr-2" />
                      ) : (
                        <FaTimes className="mr-2" />
                      )}
                      {request.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Appointment Date</h2>
          <Calendar
            className="mb-6"
            tileClassName={highlightDates}
          />
          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments scheduled.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map(appointment => (
                <div key={appointment._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-bold text-blue-900">{appointment.clientId.fullName}</p>
                  <p className="text-sm text-gray-600">{new Date(appointment.date).toLocaleString()}</p>
                  <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lawoverview;