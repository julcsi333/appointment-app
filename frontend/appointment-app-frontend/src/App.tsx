import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={MainPage} />
        <Route path="/home" Component={HomePage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
