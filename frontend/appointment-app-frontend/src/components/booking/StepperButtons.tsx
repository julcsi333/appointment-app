import React from 'react';
import { Button } from '@mui/material';

interface StepperButtonsProps {
    activeStep: number;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
    enableSubmitButton: boolean
}

const StepperButtons : React.FC<StepperButtonsProps> = ({ activeStep, onBack, onNext, onSubmit, enableSubmitButton }) => {
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
            <Button variant="contained" onClick={onSubmit} disabled={!enableSubmitButton}>
                Submit
            </Button>
            )}
        </div>
    );
};

export default StepperButtons;
