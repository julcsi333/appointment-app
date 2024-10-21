import { Typography } from '@mui/material';
import React from 'react';

const ProviderNotFound: React.FC = () => {
  return (
    <div>
      <Typography variant="h2">Oops!</Typography>
      <Typography>Couldn't find the provider you were looking for!</Typography>
    </div>
  );
};

export default ProviderNotFound;