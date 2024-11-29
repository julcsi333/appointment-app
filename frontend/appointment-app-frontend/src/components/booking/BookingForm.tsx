import React, { useEffect, useState } from 'react';
import { Box, Card, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import ServiceSelector from './ServiceSelector';
import DatePicker from './DatePicker';
import StepperProgressBar from './StepperProgressBar';
import StepperButtons from './StepperButtons';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAuth0 } from "@auth0/auth0-react";
import { bookAppointment } from '../api/appointment-api-call';
import { MainService, Provider, SubService } from '../api/model';
import { getServicesByProviderId, getSubServicesByMainServiceId } from '../api/services-api-call';

interface BookingFormProps {
    token: string;
    provider: Provider;
    user_id: number | null;
    enableSubmit: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ token, provider, user_id, enableSubmit }) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [selectedService, setSelectedService] = useState<MainService | undefined>();
    const [selectedSubService, setSelectedSubService] = useState<SubService | undefined>();
    const [services, setServices] = useState<MainService[]>([]);
    const [subservices, setSubservices] = useState<SubService[]>([]);
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
    const [enableNextButton, setEnableNextButton] = useState<boolean>(false);
    const {
        getAccessTokenSilently
    } = useAuth0();

    useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getServicesByProviderId(provider.id.toString());
                setServices(data)
			} catch (error) {
				console.error('Error:', error);
			}
		};
		fetchData();
		return () => {};
	}, [provider]);


    const handleServiceSelect = async (service: MainService) => {
        setSelectedService(service)
        const data = await getSubServicesByMainServiceId(service.id);
        setSubservices(data)
        setSelectedSubService(undefined)
        setEnableNextButton(false);
    };
    const handleSubServiceSelect = (service: SubService | undefined) => {
        if (service) {
            setSelectedSubService(service)
            setEnableNextButton(true);
        } else {
            setSelectedSubService(undefined)
            setEnableNextButton(false);
        }
        
    };

    const handleTimeSelect = (time: Dayjs | null) => {
        setSelectedTime(time);
        if (time != null) {
            setEnableNextButton(true);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
        setEnableNextButton(true);
    };

    const handleNext = () => {
        setActiveStep(activeStep + 1);
        if(activeStep !== 2) {
            setEnableNextButton(false);
        }
    };
    dayjs.extend(utc);
    const handleSubmit = async () => {
        const token = await getAccessTokenSilently();
        bookAppointment({id: null, providerId: provider.id, customerId: user_id!, date: dayjs.utc(selectedTime!.format('YYYY-MM-DDTHH:mm:ss')), subServiceId: selectedService!.id}, token)
        // Send booking information to backend
        console.log('Booking submitted:', {
            providerId: provider.id,
            selectedService,
            selectedTime,
            accessToken: token,
        });
    };

    return (
        <Stack alignItems='center' sx={{ml: 4, mr: 4}}>
            <StepperProgressBar activeStep={activeStep} />
            <Card sx={{padding:3, display: 'flex', flexDirection: 'column', justifyContent:'space-between', height: '100%', alignItems: 'center', minWidth: '80vh', maxWidth: '100vh', minHeight:'35vh', maxHeight: '60vh'}}>
                {/* Display current state based on active step */}
                {activeStep === 0 && (
                    <ServiceSelector prevSelectedService={selectedService} prevSelectedSubService={selectedSubService} services={services} subservices={subservices} id={provider.id} onServiceSelect={handleServiceSelect} onSubServiceSelect={handleSubServiceSelect}/>
                )}
                {activeStep === 1 && (
                    <DatePicker prevSelectedDate={selectedTime} onTimeSelect={handleTimeSelect} selectedService={selectedSubService!} id={provider.id} />
                )}
                {activeStep === 2 && (
                    <Box
                        sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '100%',
                        }}
                    >
                        <Typography
                        variant="h6"
                        sx={{
                            marginBottom: 4,
                        }}
                        >
                        Confirm Booking
                        </Typography>
                    
                        {/* Table layout */}
                        <Table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginBottom: 2,
                        }}
                        >
                        <TableBody>
                        <TableRow>
                                <TableCell style={{ fontWeight: 500, padding: '8px' }}>Provider name:</TableCell>
                                <TableCell style={{ padding: '8px' }}>
                                    {provider.name}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: 500, padding: '8px' }}>Service:</TableCell>
                                <TableCell style={{ padding: '8px' }}>
                                    {selectedService!.globalService.name} - {selectedSubService!.name}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: 500, padding: '8px' }}>Date:</TableCell>
                                <TableCell style={{ padding: '8px' }}>
                                    {selectedTime?.toDate().toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: 500, padding: '8px' }}>Time:</TableCell>
                                <TableCell style={{ padding: '8px' }}>
                                    {selectedTime?.format('HH:mm')}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: 500, padding: '8px' }}>Location:</TableCell>
                                <TableCell style={{ padding: '8px' }}>
                                    {provider.businessAddress}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </Box>
                )}
                {/* Back, forward and submit buttons */}
                <StepperButtons activeStep={activeStep} onBack={handleBack} onNext={handleNext} enableNextButton={enableNextButton} onSubmit={handleSubmit} enableSubmitButton={enableSubmit}/>

            </Card>

        </Stack>
    );
};

export default BookingForm;
