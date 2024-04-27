import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import ProviderComponent from '../components/ProviderComponent';

export const MainPage: React.FC = () => {
  return (
    <div className="App">
        <header className="App-header">
            <h1>Main Page</h1>
            <Link to="/home">
                <button>Go to Home</button>
            </Link>
        </header>
        <body>
            <ProviderComponent />
        </body>
    </div>
  );
};

export default MainPage;