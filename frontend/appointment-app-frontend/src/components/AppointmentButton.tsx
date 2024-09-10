import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

interface AppointmentButtonProps {
    providerId: string | number;
  }

const AppointmentButton : React.FC<AppointmentButtonProps> = ({ providerId }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/book/providers/${providerId}`);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleButtonClick}>
      Book Appointment
    </Button>
  );
};

export default AppointmentButton;