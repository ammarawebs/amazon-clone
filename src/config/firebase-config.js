
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'




const firebaseConfig = {
  apiKey: "AIzaSyBL79gQlA-fRX4tGSg7xf65SZ2LvDmT8CU",
  authDomain: "product-listing-e56c0.firebaseapp.com",
  projectId: "product-listing-e56c0",
  storageBucket: "product-listing-e56c0.appspot.com",
  messagingSenderId: "903833310515",
  appId: "1:903833310515:web:1840e0abf70e74bf751a46",
  measurementId: "G-BTFQM3E514"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
