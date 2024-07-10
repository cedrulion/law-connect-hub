// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Join from './components/Join';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
       <Routes>
       <Route  path="/" element={<LandingPage/>} ></Route>
        <Route  path="/landingpage" element={<LandingPage/>} ></Route>
          <Route  path="/join" element={<Join/>} ></Route>
          <Route  path="/signup" element={<Signup/>} ></Route>
        </Routes>
    </Router>
  );
}

export default App;
