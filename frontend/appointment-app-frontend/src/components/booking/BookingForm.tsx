import React, { useState } from 'react';
import { Typography } from '@mui/material';
import ServiceSelector from './ServiceSelector';
import DatePicker from './DatePicker';
import StepperProgressBar from './StepperProgressBar';
import StepperButtons from './StepperButtons';
import { Dayjs } from 'dayjs';
import { useAuth0 } from "@auth0/auth0-react";

interface BookingFormProps {
    id: string;
    enableSubmit: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ id, enableSubmit }) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
    const {
        getAccessTokenSilently
      } = useAuth0();

    const handleServiceSelect = (service: string) => {
        setSelectedService(service);
        //setActiveStep(1);
      };

    const handleTimeSelect = (time: Dayjs | null) => {
        setSelectedTime(time);
        //setActiveStep(3);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };
    
    const handleSubmit = async () => {
        const token = await getAccessTokenSilently();
        // Send booking information to backend
        console.log('Booking submitted:', {
            providerId: id,
            selectedService,
            selectedTime,
            accessToken: token,
        });
    };

    return (
        <div>
            <StepperProgressBar activeStep={activeStep} />

            {/* Display current state based on active step */}
            {activeStep === 0 && (
                <ServiceSelector onServiceSelect={handleServiceSelect} selectedService={selectedService}/>
            )}
            {activeStep === 1 && (
                <DatePicker onTimeSelect={handleTimeSelect} selectedService={selectedService} id={id} />
            )}
            {activeStep === 2 && (
                <div>
                    <Typography variant="h6">Confirm Booking</Typography>
                    <Typography variant="body1">Service: {selectedService}</Typography>
                    <Typography variant="body1">Date: {selectedTime?.toDate().toLocaleDateString()}</Typography>
                    <Typography variant="body1">Time: {selectedTime?.toDate().toLocaleTimeString()}</Typography>
                </div>
            )}

            {/* Back, forward and submit buttons */}
            <StepperButtons activeStep={activeStep} onBack={handleBack} onNext={handleNext} onSubmit={handleSubmit} enableSubmitButton={enableSubmit}/>
        </div>
    );
};

export default BookingForm;
