import React from 'react';
import { Box, Button } from '@mui/material';

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
        <Box>
            {activeStep !== 0 && (
            <Button sx={{mr:2, ml:2}} variant="contained" onClick={onBack}>
                Back
            </Button>
            )}
            {activeStep !== 2 && (
            <Button sx={{mr:2, ml:2}} variant="contained" onClick={onNext} disabled={!enableNextButton}>
                Next
            </Button>
            )}
            {activeStep === 2 && (
            <Button sx={{mr:2, ml:2}} variant="contained" onClick={onSubmit} disabled={!enableSubmitButton}>
                Submit
            </Button>
            )}
        </Box>
    );
};

export default StepperButtons;
