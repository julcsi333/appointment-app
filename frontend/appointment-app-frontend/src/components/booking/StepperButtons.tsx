import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';

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
                <>
                    {enableSubmitButton ? (
                        <Button sx={{mr:2, ml:2}} variant="contained" onClick={onSubmit} disabled={!enableSubmitButton}>
                            Submit
                        </Button>
                    ):(
                        <Tooltip title="You must complete your profile to book an appointment!">
                            <span>
                                <Button sx={{mr:2, ml:2}} variant="contained" disabled>
                                    Submit
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                </>
            )}
        </Box>
    );
};

export default StepperButtons;
