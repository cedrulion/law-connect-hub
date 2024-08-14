import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import {  FaCalendarAlt , FaUser, FaExclamationCircle} from 'react-icons/fa';
import Modal from 'react-modal';

// Initialize React Modal
Modal.setAppElement('#root');

const LawyerAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseStatus, setResponseStatus] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

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
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, loggedInUser._id]);

  const openModal = (appointment) => {
    setCurrentAppointment(appointment);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentAppointment(null);
    setResponseStatus('');
    setSuggestedDate('');
  };

  const handleRespond = async (response) => {
    try {
      await axios.post(
        'http://localhost:5000/api/appointments/respond',
        { appointmentId: currentAppointment._id, response, suggestedDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(appointments.map(appointment =>
        appointment._id === currentAppointment._id
          ? { ...appointment, status: response === 'ACCEPTED' ? 'ACCEPTED' : 'DECLINED' }
          : appointment
      ));
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error responding to appointment');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 font-sans text-gray-800 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Requested Appointments</h1>
        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments found.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {appointments.map(appointment => (
              <div key={appointment._id} className="bg-white p-4 rounded shadow-md">
                <div>
                  <p className="text-sm">
                    <FaUser className="inline mr-2 text-blue-600" />
                    <strong>Client:</strong> {appointment.clientId.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <FaUser className="inline mr-2 text-green-600" />
                    <strong>Lawyer:</strong> {appointment.lawyerId.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <FaCalendarAlt className="inline mr-2 text-yellow-600" />
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <FaExclamationCircle className="inline mr-2 text-red-600" />
                    <strong>Status:</strong> {appointment.status}
                  </p>
                </div>
                {appointment.status === 'PENDING' && (
                  <div className="mt-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => openModal(appointment)}
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Accept
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => openModal(appointment)}
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Response"
        className="bg-white p-6 rounded shadow-md max-w-lg mx-auto my-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Response</h2>
        <p>Are you sure you want to {responseStatus.toLowerCase()} this appointment?</p>
        {responseStatus === 'DECLINED' && (
          <div className="mt-4">
            <label htmlFor="suggestedDate" className="block text-sm font-medium text-gray-700">Suggested Date:</label>
            <input
              type="date"
              id="suggestedDate"
              value={suggestedDate}
              onChange={(e) => setSuggestedDate(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => handleRespond('ACCEPTED')}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Accept
          </button>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => handleRespond('DECLINED')}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Decline
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LawyerAppointmentsPage;
