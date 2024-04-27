import React from 'react';
import { Button } from '@mui/material';

interface StepperButtonsProps {
    activeStep: number;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;

}

const StepperButtons : React.FC<StepperButtonsProps> = ({ activeStep, onBack, onNext, onSubmit }) => {
    return (
        <div>
            {activeStep !== 0 && (
            <Button variant="contained" onClick={onBack}>
                Back
            </Button>
            )}
            {activeStep !== 2 && (
            <Button variant="contained" onClick={onNext}>
                Next
            </Button>
            )}
            {activeStep === 2 && (
            <Button variant="contained" onClick={onSubmit}>
                Submit
            </Button>
            )}
        </div>
    );
};

export default StepperButtons;
