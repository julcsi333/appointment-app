import React, { useState } from 'react';
import { Typography } from '@mui/material';
import ServiceSelector from './ServiceSelector';
import DatePicker from './DatePicker';
import StepperProgressBar from './StepperProgressBar';
import StepperButtons from './StepperButtons';
import { Dayjs } from 'dayjs';
import { useAuth0 } from "@auth0/auth0-react";
import { bookAppointment } from '../api/appointment-api-call';

interface BookingFormProps {
    id: string;
    user_id: string | null;
    enableSubmit: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ id, user_id, enableSubmit }) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
    const [enableNextButton, setEnableNextButton] = useState<boolean>(false);
    const {
        getAccessTokenSilently
      } = useAuth0();

    const handleServiceSelect = (service: string) => {
        setSelectedService(service);
        setEnableNextButton(true);
        //setActiveStep(1);
      };

    const handleTimeSelect = (time: Dayjs | null) => {
        setSelectedTime(time);
        setEnableNextButton(true);
        //setActiveStep(3);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleNext = () => {
        setActiveStep(activeStep + 1);
        if(activeStep !== 2) {
            setEnableNextButton(false)
        }
    };
    
    const handleSubmit = async () => {
        const token = await getAccessTokenSilently();
        bookAppointment(id, {customerId: user_id!, date: selectedTime!, serviceId: selectedService}, token)
        // Send booking information to backend
        console.log('Booking submitted:', {
            providerId: id,
            selectedService,
            selectedTime,
            accessToken: token,
        });
    };

    return (
        <>
            <StepperProgressBar activeStep={activeStep} />
            <center className='margin'>
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
                <StepperButtons activeStep={activeStep} onBack={handleBack} onNext={handleNext} enableNextButton={enableNextButton} onSubmit={handleSubmit} enableSubmitButton={enableSubmit}/>
            </center>

        </>
    );
};

export default BookingForm;
