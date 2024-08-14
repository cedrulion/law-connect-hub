import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearchLocation, FaBlog, FaCalendarCheck, FaUserAlt, FaFileAlt, FaEnvelope } from 'react-icons/fa';
import Modal from './Modal';  // Import the Modal component
import AppointmentForm from './AppointmentForm';  // Import the AppointmentForm component
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
    { id: 1, icon: <FaFileAlt />, user: 'John Doe', action: 'added a pdf file to your shared repo', time: '2 hours ago' },
    { id: 2, icon: <FaEnvelope />, user: 'Muhire', action: 'sent you a message', time: '3 hours ago' },
  ];

  return (
    <div className="p-6 font-sans text-gray-800 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back <span>{loggedInUser.fullName}</span></h1>
          <p className="text-sm">Have a great day...</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-white p-4 rounded shadow-md flex items-center hover:bg-gray-300 cursor-pointer" onClick={() => handleAppointmentClick()}>
            <FaCalendarCheck className="text-xl text-gray-600" />
            <div className="ml-2">
              <p className="text-sm">Appointments</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
          </div>
          <button className="bg-black text-white p-4 rounded shadow-md flex items-center">
            Extensive search
          </button>
        </div>
      </div>

      <div className="mt-6 flex">
        <button className="flex-1 bg-gray-200 p-6 rounded shadow-md flex items-center justify-center mr-2"
        onClick={() => navigate('/dashboard/map-search')}            
>
          <FaSearchLocation className="text-3xl text-gray-600" />
          <p className="ml-2 text-xl">Map searching</p>
        </button>
        <button
      className="flex-1 bg-gray-200 p-6 rounded shadow-md flex items-center justify-center ml-2"
      onClick={() => navigate('/dashboard/blog')}
         >
           <FaBlog className="text-3xl text-gray-600" />
           <p className="ml-2 text-xl">Blogspot</p>
           </button> 

      </div>

      <div className="mt-6 flex">
        <div className="flex-1 bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          {notifications.map(notification => (
            <div key={notification.id} className="flex items-center mb-4">
              <div className="bg-gray-200 p-4 rounded-full">
                {notification.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm"><strong>{notification.user}</strong> {notification.action}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-1/4 bg-white p-6 rounded shadow-md ml-6">
          <h2 className="text-xl font-bold mb-4">Suggested legal counselors</h2>
          {legalCounselors.map((counselor, index) => (
            <div key={index} className="flex items-center mb-4 cursor-pointer" onClick={() => handleCounselorClick(counselor)}>
              <FaUserAlt className="text-2xl text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-bold">{counselor.fullName}</p>
                <p className="text-xs text-gray-500">{counselor.address}</p>
                <p className="text-xs text-gray-500">{counselor.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap">
        {appointments.map(appointment => (
          <div key={appointment._id} className="bg-white p-4 rounded shadow-md m-2 cursor-pointer">
            <p className="text-sm"><strong>Lawyer:</strong> {appointment.lawyerId.fullName}</p>
            <p className="text-sm"><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
            <p className="text-sm"><strong>Status:</strong> {appointment.status}</p>
          </div>
        ))}
      </div>

      <Modal show={showModal} onClose={closeModal} counselor={selectedCounselor} onRequestAppointment={handleRequestAppointment} />
      {showAppointmentForm && <AppointmentForm counselor={selectedCounselor} onClose={closeAppointmentForm} />}
    </div>
  );
};

export default Overview;
