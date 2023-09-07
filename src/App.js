
import React ,{ useEffect, useReducer, useState } from 'react';
import './App.css';
import axios from './axios';
import {  Route , Routes } from 'react-router-dom';
import HomePage from './routes/HomePage';
import Single_product from './routes/Single_product';
import Navbar from './components/Navbar';
import Auth from './authentication/Auth';
import Login from './authentication/Login';
import Vendor from './authentication/vendor/Vendor';
// import VendorDetails from './authentication/vendor/VendorDetails';







function App() {

  
 


  return (
    <>
    
      {/* <Router> */}
        <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path={`/products/:id`} element={<Single_product/>}/>
          <Route path='/sign-up' element={<Auth />}/>
          <Route path='/log-in' element={<Login />}/>
          <Route path='/become-a-seller' element={<Vendor/>}/>
        

          
          
        </Routes>
      {/* </Router> */}
      {/* <HomePage/> */}
        
    </>
  );
}

export default App;
