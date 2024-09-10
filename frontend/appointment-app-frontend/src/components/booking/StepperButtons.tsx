import React from 'react';
import { Button } from '@mui/material';

interface StepperButtonsProps {
    activeStep: number;
    onBack: () => void;
    onNext: () => void;
    enableNextButton: boolean;
    onSubmit: () => void;
    enableSubmitButton: boolean
}

const StepperButtons : React.FC<StepperButtonsProps> = ({ activeStep, onBack, onNext, enableNextButton, onSubmit, enableSubmitButton }) => {
    return (
        <div className="margin">
            {activeStep !== 0 && (
            <Button variant="contained" onClick={onBack}>
                Back
            </Button>
            )}
            {activeStep !== 2 && (
            <Button variant="contained" onClick={onNext} disabled={!enableNextButton}>
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
