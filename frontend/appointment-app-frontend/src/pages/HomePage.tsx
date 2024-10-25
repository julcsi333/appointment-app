import React from 'react';
import GlobalToolbar from '../components/common/GlobalToolbar';
import ProviderComponent from '../components/common/ProviderComponent';

export const HomePage: React.FC = () => {
  return (
    <div>
      <GlobalToolbar />
      <ProviderComponent />
    </div>
  );
};

export default HomePage;