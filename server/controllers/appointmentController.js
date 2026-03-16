const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Appointment = require('../models/Appointment');
const userModel = require("../models/userModel");

// Update your existing processPayment function
exports.processPayment = async (req, res) => {
  try {
    const { appointmentId, paymentMethod } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // In a real implementation, you would use Stripe's API to process the payment
    // For now, we'll simulate a successful payment
    // You can integrate actual Stripe payment processing here using your STRIPE_KEY
    
    // Simulate payment processing
    const paymentIntentId = 'pi_' + Math.random().toString(36).substring(2, 15);

    res.status(200).json({
      message: 'Payment processed successfully',
      paymentIntentId: paymentIntentId
    });

  } catch (error) {
    console.error("Payment Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Add this function to update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { appointmentId, paymentIntentId, paymentStatus } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: paymentStatus,
        paymentIntentId: paymentIntentId
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({
      message: `Payment status updated to ${paymentStatus}`,
      appointment
    });

  } catch (error) {
    console.error("Update Payment Status Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Your existing functions below - UNCHANGED
exports.requestAppointment = async (req, res) => {
  try {
    const { lawyerEmail, date } = req.body;
    const clientId = req.user._id;

    const client = await userModel.findOne({ _id: clientId, role: 'CLIENT' });
    if (!client) {
      return res.status(404).json({ message: 'Client not found.' });
    }

    const lawyer = await userModel.findOne({ email: lawyerEmail, role: 'LAWYER' });
    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found.' });
    }
    const lawyerId = lawyer._id;

    const existingAppointment = await Appointment.findOne({ clientId, lawyerId, date, status: 'ACCEPTED' });

    if (existingAppointment) {
      const suggestedDate = new Date(date);
      suggestedDate.setDate(suggestedDate.getDate() + 1);

      return res.status(400).json({
        message: 'Lawyer is not available on the requested date.',
        suggestedDate
      });
    }

    const appointment = new Appointment({ 
      clientId, 
      lawyerId, 
      date, 
      status: 'PENDING',
      paymentStatus: 'PENDING' 
    });
    await appointment.save();

    res.status(201).json({
      message: 'Appointment requested successfully.',
      appointment
    });
  } catch (error) {
    console.error("Request Appointment Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.respondToAppointment = async (req, res) => {
  try {
    const { appointmentId, response, suggestedDate } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appointment.status !== 'PENDING') {
      return res.status(400).json({ message: 'Appointment has already been responded to.' });
    }

    if (response === 'ACCEPTED') {
      appointment.status = 'ACCEPTED';
    } else if (response === 'DECLINED') {
      appointment.status = 'DECLINED';
      if (suggestedDate) {
        appointment.suggestedDate = suggestedDate;
      }
    } else {
      return res.status(400).json({ message: 'Invalid response.' });
    }

    await appointment.save();

    res.status(200).json({
      message: `Appointment ${response.toLowerCase()} successfully.`,
      appointment
    });
  } catch (error) {
    console.error("Respond to Appointment Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('clientId', 'fullName')
      .populate('lawyerId', 'fullName');
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Get All Appointments Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('clientId', 'fullName')
      .populate('lawyerId', 'fullName');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Get Appointment By Id Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ 
      $or: [{ clientId: userId }, { lawyerId: userId }]
    })
    .populate('clientId', 'fullName')
    .populate('lawyerId', 'fullName');

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user.' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Get Appointments By User Id Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully.' });
  } catch (error) {
    console.error("Delete Appointment Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentsForLoggedInUser = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);
    const appointments = await Appointment.find({
      $or: [{ clientId: userId }, { lawyerId: userId }]
    })
    .populate('clientId', 'fullName')
    .populate('lawyerId', 'fullName');

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user.' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Get Appointments For Logged In User Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};