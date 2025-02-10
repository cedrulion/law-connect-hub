import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaTrashAlt, FaEye, FaCalendarAlt, FaUser, FaExclamationCircle } from 'react-icons/fa';

const UserAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
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

    fetchAppointments();
  }, [token, loggedInUser._id]);

  const handleCancel = async (appointmentId) => {
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${appointmentId}`, { status: 'CANCELLED' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map(appointment =>
        appointment._id === appointmentId ? { ...appointment, status: 'CANCELLED' } : appointment
      ));
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error cancelling appointment');
    }
  };

  const openModal = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAppointmentToCancel(null);
  };

  const handleAppointmentClick = (appointmentId) => {
    navigate(`/dashboard/appointments/${appointmentId}`);
  };

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">Error: {error}</div>;
  }

  return (
    <div className="p-6 text-gray-800 bg-gray-100 min-h-screen" style={{ fontFamily: 'roboto' }}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Your Appointments</h1>
        {appointments.length === 0 ? (
          <p className="text-gray-600 text-center">No appointments found.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map(appointment => (
              <div
                key={appointment._id}
                className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-300 transition-shadow duration-200"
              >
                <div className="mb-4">
                  
                  <p className="text-lg font-semibold text-gray-700">
                    <FaUser className="inline mr-2 text-green-600" />
                    Lawyer: {appointment.lawyerId.fullName}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <FaCalendarAlt className="inline mr-2 text-yellow-600" />
                    Date: {new Date(appointment.date).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <FaExclamationCircle className="inline mr-2 text-red-600" />
                    Status: {appointment.status}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  {appointment.status === 'PENDING' && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors duration-200"
                      onClick={() => openModal(appointment._id)}
                    >
                      <FaTrashAlt className="mr-2" />
                      Cancel
                    </button>
                  )}
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => handleAppointmentClick(appointment._id)}
                  >
                    <FaEye className="mr-2" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Cancel Appointment Confirmation"
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Are you sure you want to cancel this appointment?</h2>
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2">No</button>
          <button
            onClick={() => handleCancel(appointmentToCancel)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Yes, Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserAppointmentsPage;
