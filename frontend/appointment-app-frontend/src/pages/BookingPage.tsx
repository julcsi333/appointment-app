import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography} from '@mui/material';
import ProviderInformation from '../components/ProviderInformation';
import { Provider, User } from '../components/api/model';
import { getProvider } from '../components/api/provider-api-call';
import ProviderNotFound from '../components/ProviderNotFound';
import BookingForm from '../components/booking/BookingForm';
import GlobalToolbar from '../components/GlobalToolbar';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserByExternalId } from '../components/api/user-api-call';


const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [provider, setProvider] = useState<Provider | null>(null);
    const {
        user,
        getAccessTokenSilently,
      } = useAuth0();
    const [currentUserData, setCurrentUserData] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const providerData = await getProvider(id as string);
                setProvider(providerData);
                
                const token = await getAccessTokenSilently();
                console.log(`User: ${user}`)
                console.log(`User sub: ${user?.sub}`)
                const userData = await getUserByExternalId(user!.sub!, token);
                console.log(`User data: ${userData}`)
                setCurrentUserData(userData);
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchData();

        return () => {

        };
    }, [getAccessTokenSilently, id, user]);
  
    return (
      <div>
        <GlobalToolbar />
        {provider === null && <ProviderNotFound />}
        {provider !== null && (
            <div>
                <Typography variant="h4">Book Appointment</Typography>
                <ProviderInformation provider={provider} showBookbutton={false} />
                <BookingForm id={provider.id} enableSubmit={currentUserData?.name !== null && currentUserData?.phoneNumber !== null}/>
            </div>
        )}
      </div>
    );
  };
  
  export default BookingPage;