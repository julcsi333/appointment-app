import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import ProfilePage from './pages/ProfilePage';
import ServicesPage from './pages/ServicesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/book/providers/:id" Component={withAuthenticationRequired(BookingPage)} />
        <Route path="/profile" Component={withAuthenticationRequired(ProfilePage)} />
        <Route path="/services/providers/:id" Component={ServicesPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
