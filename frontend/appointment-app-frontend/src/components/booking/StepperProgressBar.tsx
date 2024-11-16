import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

interface StepperProgressBarProps {
    activeStep: number;
}

const StepperProgressBar: React.FC<StepperProgressBarProps> = ({ activeStep }) => {
    return (
        <Stepper sx={{width: '100%', mt: 4, mb: 4}} activeStep={activeStep}>
            <Step>
                <StepLabel>Select Service</StepLabel>
            </Step>
            <Step>
                <StepLabel>Select Date and Time</StepLabel>
            </Step>
            <Step>
                <StepLabel>Confirm Booking</StepLabel>
            </Step>
        </Stepper>
    );
};

export default StepperProgressBar;
