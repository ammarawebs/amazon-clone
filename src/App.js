
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
import ProtectedRoutes from './routes/ProtectedRoutes';
import UserDashboard from './routes/UserDashboard';
import AdminDashboard from './routes/AdminDashboard/AdminDashboard';
import SellerDashboard from './routes/SellerDashboard';
import UserManagementContent from './routes/AdminDashboard/UserManagementContent';
import ProductManagement from './routes/AdminDashboard/ProductManagement';
import SingleProductEdit from './routes/AdminDashboard/SingleProductEdit';
// import VendorDetails from './authentication/vendor/VendorDetails';


function App() {
  
   

  return (
    <>
    
    
        <Navbar/>
        <Routes>

          <Route element={<ProtectedRoutes/>}>
            
            
            <Route path='/user-dashboard' element={<UserDashboard />}/>
            <Route path='/seller-dashboard' element={<SellerDashboard />}/>

          </Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route path="user-management" element={<UserManagementContent />} />
            <Route path="product-management" element={<ProductManagement/>}/>
            <Route path={`edit-product/:id`}  element={<SingleProductEdit/>} />
          </Route>
          
          <Route path='/' element={<HomePage />}/>
          <Route path={`/products/:id`} element={<Single_product/>}/>
          <Route path='/sign-up' element={<Auth />}/>
          <Route path='/log-in' element={<Login />}/>
          <Route path='/become-a-seller' element={<Vendor/>}/>

   

        
          
          
          
        </Routes>
  
      {/* <HomePage/> */}
        
    </>
  );
}

export default App;