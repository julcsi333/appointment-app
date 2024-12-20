import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Config, getAuthConfig } from "./config/config";
import { Auth0Provider } from '@auth0/auth0-react';
import { Box, styled } from '@mui/material';

const config : Auth0Config = getAuthConfig();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  
  <div className='Background-component'>
  <React.StrictMode>
    <Auth0Provider
        domain={config.domain}
        clientId={config.clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: config.audience,
          scope: config.scope
        }}
      >
        <App />
    </Auth0Provider>
  
  </React.StrictMode>
  </div>
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
