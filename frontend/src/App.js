import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, BrowserRouter as Router, Routes} from "react-router-dom"
import React from 'react';
import LandingPage from './pages/landingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/'  element={<LandingPage/>}/>
        <Route path='/login'  element={<Login/>}/>
        <Route path='/signUp'  element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
