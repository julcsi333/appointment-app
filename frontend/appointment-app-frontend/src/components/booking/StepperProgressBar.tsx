import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

interface StepperProgressBarProps {
    activeStep: number;
}

const StepperProgressBar: React.FC<StepperProgressBarProps> = ({ activeStep }) => {
    return (
        <Stepper activeStep={activeStep}>
            <Step>
                <StepLabel>Choose Service</StepLabel>
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
