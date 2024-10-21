import React from 'react';
import { Typography, Card, CardContent, CardMedia, styled, Paper, Box } from '@mui/material';
import { Provider } from './api/model';
import AppointmentButton from './AppointmentButton';

interface ProviderInformationProps {
    provider: Provider;
    showBookbutton: boolean;
}

const handleAppointmentClick = () => {
    console.log('Appointment clicked');
  };

const StyledCard = styled(Card)({
    height: '100%', // Ensure the card takes up full height of the ListItem
    minWidth: '100vh',
    display: 'flex', // Use flexbox layout
    flexDirection: 'row', // Arrange child elements in a column
    justifyContent: 'space-around'
  });

const ProviderInformation: React.FC<ProviderInformationProps>  = ({ provider, showBookbutton }) => {
    const profileImageUrl = '/images/profile/'+provider.id
    return (
      <center className='margin'>
        <Box display="inline-block">
          <Paper>
            <Card sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 150 }}
                image={profileImageUrl === undefined ? "https://idea7.co.uk/wp-content/uploads/2021/02/placeholder-250x250-1.png" : profileImageUrl}
                alt={provider.name}
                
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {provider.name}
                </Typography>
                <Typography color="textSecondary">
                  Phone Number: {provider.phoneNumber}
                </Typography>
                <Typography color="textSecondary">
                  Business Address: {provider.businessAddress}
                </Typography>
                {showBookbutton && <AppointmentButton providerId={provider.id}/>}
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </center>
    );
  };
  
  export default ProviderInformation;