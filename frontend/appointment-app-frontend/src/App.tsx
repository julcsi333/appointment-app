import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import { withAuthenticationRequired } from '@auth0/auth0-react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/book/providers/:id" Component={withAuthenticationRequired(BookingPage)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
