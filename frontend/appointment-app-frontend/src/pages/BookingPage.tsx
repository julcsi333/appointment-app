import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography} from '@mui/material';
import ProviderInformation from '../components/ProviderInformation';
import { Provider } from '../components/api/model';
import { getProvider } from '../components/api/provider-api-call';
import ProviderNotFound from '../components/ProviderNotFound';
import BookingForm from '../components/booking/BookingForm';
import GlobalToolbar from '../components/GlobalToolbar';


const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [provider, setProvider] = useState<Provider | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getProvider(id as string);
            setProvider(data);
        } catch (error) {
            console.error('Error:', error);
        }
        };
    
        fetchData();

        return () => {

        };
    }, [id]);
  
    return (
      <div>
        <GlobalToolbar />
        {provider === null && <ProviderNotFound />}
        {provider !== null && (
            <div>
                <Typography variant="h4">Book Appointment</Typography>
                <ProviderInformation provider={provider} showBookbutton={false} />
                <BookingForm id={provider.id} />
            </div>
        )}
      </div>
    );
  };
  
  export default BookingPage;