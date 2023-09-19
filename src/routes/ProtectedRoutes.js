import React from 'react'
import {Outlet , Navigate} from 'react-router-dom'
import { auth ,db } from "../config/firebase-config";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect } from 'react'
import { useProductContext } from '../context/ProductContext';

const ProtectedRoutes = () => {

 const {dispatch , user} = useProductContext()


if(auth?.currentUser?.email){
  return user.role === 'buyer' ? <Outlet /> : <Navigate to="/" />;
}
else{
  return <Navigate to="/" />
}

 
 
  
}

export default ProtectedRoutes  