import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './context/tokenContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <GoogleOAuthProvider clientId="117548762376-7cf97d3gggob8p1sf7qu36rrmdglusaj.apps.googleusercontent.com">
    <UserProvider>
    <App />
    </UserProvider>
    </GoogleOAuthProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
