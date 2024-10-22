import React from 'react';
import GlobalToolbar from '../components/common/GlobalToolbar';
import ProviderComponent from '../components/common/ProviderComponent';
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