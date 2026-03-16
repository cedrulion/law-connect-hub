import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearchLocation, FaBlog, FaCalendarCheck, FaUserAlt, FaFileAlt, FaEnvelope } from 'react-icons/fa';
import Modal from './Modal';
import AppointmentForm from './AppointmentForm';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const [legalCounselors, setLegalCounselors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLegalCounselors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/legal-counselors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLegalCounselors(response.data);
      } catch (error) {
        console.error('Error fetching legal counselors:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userAppointments = response.data.filter(
          (appointment) => appointment.clientId._id === loggedInUser._id
        );
        setAppointments(userAppointments);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching appointments');
        setLoading(false);
      }
    };

    fetchLegalCounselors();
    fetchAppointments();
  }, [token, loggedInUser._id]);

  const handleCounselorClick = (counselor) => {
    setSelectedCounselor(counselor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCounselor(null);
  };

  const handleRequestAppointment = (counselor) => {
    setShowModal(false);
    setShowAppointmentForm(true);
  };

  const closeAppointmentForm = () => {
    setShowAppointmentForm(false);
  };

  const handleAppointmentClick = () => {
    navigate(`/dashboard/user/appointments`);
  };

  const notifications = [
    { id: 1, icon: <FaFileAlt />, user: 'Bizimana', action: 'added a pdf file to your shared repo', time: '2 hours ago' },
    { id: 2, icon: <FaEnvelope />, user: 'Muhire', action: 'sent you a message', time: '3 hours ago' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-purple-600 text-xl">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-600 text-xl">Error: {error}</div>
    </div>;
  }

  return (
    <div className="p-6 text-gray-800 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen font-sans">
      <div className="p-6 flex justify-between items-center bg-white rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back, <span className="font-extrabold">{loggedInUser.fullName}</span>
          </h1>
          <p className="text-purple-600 mt-2">Have a great day ahead!</p>
        </div>
        <div className="flex space-x-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-xl shadow-lg flex items-center hover:from-purple-600 hover:to-blue-600 cursor-pointer transition-all duration-300 text-white" 
            onClick={handleAppointmentClick}
          >
            <FaCalendarCheck className="text-xl" />
            <div className="ml-2">
              <p className="text-sm">Appointments</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
          </div>
          <button className="bg-black text-white p-4 rounded-xl shadow-lg flex items-center hover:bg-gray-800 transition-colors duration-300">
            Extensive search
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <button 
          onClick={() => navigate('/dashboard/map-search')}
          className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl shadow-lg flex items-center justify-center hover:from-green-500 hover:to-emerald-600 transition-all duration-300 text-white"
        >
          <FaSearchLocation className="text-3xl" />
          <p className="ml-2 text-xl font-semibold">Map searching</p>
        </button>
        <button
          onClick={() => navigate('/dashboard/blog')}
          className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 rounded-xl shadow-lg flex items-center justify-center hover:from-orange-500 hover:to-pink-600 transition-all duration-300 text-white"
        >
          <FaBlog className="text-3xl" />
          <p className="ml-2 text-xl font-semibold">Blogspot</p>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-6">
        <div className="col-span-3 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">Notifications</h2>
          {notifications.map(notification => (
            <div key={notification.id} className="flex items-center mb-4 p-4 hover:bg-purple-50 rounded-lg transition-colors duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full text-white">
                {notification.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm">
                  <strong className="text-purple-600">{notification.user}</strong> {notification.action}
                </p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">Book appointment with available lawyers</h2>
          {legalCounselors.map((counselor, index) => (
            <div 
              key={index} 
              className="flex items-center mb-4 p-4 cursor-pointer hover:bg-purple-50 rounded-lg transition-colors duration-300"
              onClick={() => handleCounselorClick(counselor)}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full text-white">
                <FaUserAlt className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold text-purple-600">{counselor.fullName}</p>
                <p className="text-xs text-gray-500">{counselor.address}</p>
                <p className="text-xs text-gray-500">{counselor.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onClose={closeModal} counselor={selectedCounselor} onRequestAppointment={handleRequestAppointment} />
      {showAppointmentForm && <AppointmentForm counselor={selectedCounselor} onClose={closeAppointmentForm} />}
    </div>
  );
};

export default Overview;