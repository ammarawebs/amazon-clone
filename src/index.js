import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AppProvider } from './context/ProductContext';
import { HashRouter as Router } from "react-router-dom";



// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
// <Router>
//     <AppProvider>
    
//     <App />
    
//     </AppProvider>
//     </Router>

//   </React.StrictMode>
// );


ReactDOM.render(
  <React.StrictMode>
  <Router basename="/" hashType="noslash">
  <AppProvider>
    <App/>
    </AppProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

