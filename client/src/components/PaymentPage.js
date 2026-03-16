import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaCreditCard, FaLock, FaArrowLeft, FaUser, FaCalendarAlt } from 'react-icons/fa';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [appointment, setAppointment] = useState(location.state?.appointment || null);
  const [loading, setLoading] = useState(!location.state?.appointment);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    // If appointment not passed in state, fetch it
    if (!appointment && id) {
      const fetchAppointment = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/appointments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAppointment(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching appointment');
        } finally {
          setLoading(false);
        }
      };
      fetchAppointment();
    } else {
      setLoading(false);
    }
  }, [id, appointment, token]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setCardExpiry(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number');
      setProcessing(false);
      return;
    }

    if (cardExpiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      setProcessing(false);
      return;
    }

    if (cardCvc.length < 3) {
      setError('Please enter a valid CVC');
      setProcessing(false);
      return;
    }

    try {
      // Process payment on backend
      const response = await axios.post(
        'http://localhost:5000/api/process-payment',
        { 
          appointmentId: appointment._id,
          paymentMethod: {
            cardNumber: cardNumber.replace(/\s/g, ''),
            cardExpiry,
            cardCvc,
            cardName
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update payment status to PAID
      await axios.post(
        'http://localhost:5000/api/update-payment-status',
        { 
          appointmentId: appointment._id,
          paymentIntentId: response.data.paymentIntentId,
          paymentStatus: 'PAID'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/user/appointments', { 
          state: { paymentSuccess: true } 
        });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      
      // Update payment status to FAILED
      try {
        await axios.post(
          'http://localhost:5000/api/update-payment-status',
          { 
            appointmentId: appointment._id,
            paymentStatus: 'FAILED'
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (updateErr) {
        console.error('Failed to update payment status:', updateErr);
      }
    } finally {
      setProcessing(false);
    }
  };

  const goBack = () => {
    navigate('/dashboard/user/appointments');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={goBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if already paid
  if (appointment?.paymentStatus === 'PAID') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Paid</h2>
          <p className="text-gray-600 mb-6">This appointment has already been paid for.</p>
          <button
            onClick={goBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Redirecting to appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={goBack}
          className="mb-4 ml-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Appointments
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Complete Your Payment</h1>
          </div>

          {/* Appointment Summary */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointment Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                <span className="font-medium mr-2">Lawyer:</span> {appointment?.lawyerId?.fullName || 'N/A'}
              </p>
              <p className="text-gray-700 flex items-center">
                <FaCalendarAlt className="mr-2 text-yellow-500" />
                <span className="font-medium mr-2">Date:</span> {appointment?.date ? new Date(appointment.date).toLocaleString() : 'N/A'}
              </p>
              <div className="border-t border-gray-200 my-3 pt-3">
                <p className="text-xl font-bold text-gray-800">
                  Total: ${(appointment?.amount || 5000) / 100}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cardholder Name */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="4242 4242 4242 4242"
                  maxLength="19"
                  required
                />
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FaLock className="mr-2 text-green-500" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="mr-2" />
                    Pay ${(appointment?.amount || 5000) / 100}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Test Cards Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Test Card: 4242 4242 4242 4242 | Any future expiry | Any 3-digit CVC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;