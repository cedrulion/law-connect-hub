// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Join from './components/Join';
import JoinClient from './components/JoinClient';
import Signup from './components/Signup';
import Overview from './components/Overview';
import Lawoverview from './components/Lawoverview';
import Message from './components/Message';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import DashboardLayout from './components/DashboardLayout';
import AppointmentDetailsPage from './components/AppointmentDetailsPage';
import UserAppointmentsPage from './components/UserAppointmentsPage'; 
import LawyerAppointmentsPage from './components/LawyerAppointmentsPage'; 
import ProfilePage from './components/ProfilePage';
import BlogPage from './components/BlogPage';
import MapSearch from './components/MapSearch';
import LegalCounselorsPage from './components/LegalCounselorsPage'; 

function App() {
  return (
    <Router>
       <Routes>
       <Route  path="/" element={<LandingPage/>} ></Route>
        <Route  path="/landingpage" element={<LandingPage/>} ></Route>
          <Route  path="/join" element={<Join/>} ></Route>
           <Route  path="/join-client" element={<JoinClient/>} ></Route>
          <Route  path="/signup" element={<Signup/>} ></Route>
          <Route  path="/sidebar" element={<Sidebar/>} ></Route>
       
          <Route  path="/message" element={<Message/>} ></Route>
          <Route  path="/law-overview" element={<Lawoverview/>} ></Route>
           <Route  path="/login" element={<Login/>} ></Route> 
           <Route  path="/dashboard" element={<DashboardLayout/>} >
              <Route  path="overview" element={<Overview/>} />
             <Route  path="law-overview" element={<Lawoverview/>} />
             <Route path="appointments/:id" element={<AppointmentDetailsPage />} />
            <Route path="user/appointments" element={<UserAppointmentsPage />} /> 
            <Route path="lawyer/appointments" element={<LawyerAppointmentsPage />} />
             <Route path="profile" element={<ProfilePage />} /> 
             <Route  path="message" element={<Message/>} />
              <Route path="appointment" element={<LegalCounselorsPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="map-search" element={<MapSearch />} />
                </Route>
          
        </Routes>
    </Router>
  );
}

export default App;
