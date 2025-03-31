import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './Root';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="950950758438-h4f1u6g5vfp7foh79c0c0tq9dssd0ti6.apps.googleusercontent.com">
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
