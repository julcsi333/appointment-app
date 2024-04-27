import React from 'react';
import GlobalToolbar from '../components/GlobalToolbar';
import ProviderComponent from '../components/ProviderComponent';
import '../App.css';

export const HomePage: React.FC = () => {
  return (
    <div className="Home-page">
      <GlobalToolbar />
      <ProviderComponent />
    </div>
  );
};

export default HomePage;