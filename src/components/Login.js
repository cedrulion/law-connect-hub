import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bulb from '../Assets/bulb.jpg';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(3, 'Password must be at least 3 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/signin', values);
        const { token, loggedInUser } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser)); // Store loggedInUser
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Navigate based on the user's role
        if (loggedInUser.role === 'LAWYER') {
          navigate('/dashboard/law-overview');
        } else if (loggedInUser.role === 'CLIENT') {
          navigate('/dashboard/overview');
        } else {
          navigate('/dashboard/overview'); // Default navigation if role is unknown
        }
      } catch (error) {
        toast.error('Login failed. Please check your credentials and try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  return (
    <div>
      <header className="p-4 flex justify-between items-center bg-white shadow-md">
        <div className="text-red-800 font-bold text-xl">LawConnect</div>
        <nav className="flex space-x-4 font-semibold">
          <Link to="/services" className="text-red-900 hover:text-red-600">Services</Link>
          <Link to="/help" className="text-red-900 hover:text-red-600">Help</Link>
        </nav>
      </header>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <Link to="/" className="absolute top-16 left-6 text-black text-2xl text-black">
          <FaArrowLeft />
        </Link>
        <ToastContainer />
        <div className="flex justify-between gap-5 bg-white rounded-lg shadow-lg max-w-4xl w-full">
          <div className="p-8 w-full md:w-3/5">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-900">Log In</h2>
            <p className="text-center mb-6 text-gray-600">
              Welcome back! Please enter your details.
            </p>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                ) : null}
              </div>
              <button type="submit" className="w-full py-2 bg-green-600 rounded-md text-white font-bold hover:bg-blue-700">Login</button>
              <div className="mt-4 text-center">
                <Link to="/join" className="text-blue-600 hover:underline">Don't have an account? Sign Up</Link>
              </div>
            </form>
          </div>
          <div className="relative">
            <img src={bulb} alt="Background" className="object-cover h-full" />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex-col items-center justify-center p-8 md:flex rounded-r-lg">
              <h2 className="text-2xl font-bold text-white">Proceed to your Dashboard</h2>
              <p className="text-center text-white mt-2">Sign in to explore changes and updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
