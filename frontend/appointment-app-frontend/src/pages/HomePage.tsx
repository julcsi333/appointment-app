import React from 'react';
import ToolbarComponent from '../components/ToolbarComponent';
import ProviderComponent from '../components/provider-list';
import '../App.css';

export const HomePage: React.FC = () => {
  return (
    <div className="Home-page">
        <ToolbarComponent />
      <ProviderComponent />
    </div>
  );
};

export default HomePage;