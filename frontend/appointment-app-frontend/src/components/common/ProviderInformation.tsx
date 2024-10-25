import React from 'react';
import { Typography, Card, CardContent, CardMedia, styled, Paper, Box } from '@mui/material';
import { Provider } from '../api/model';
import AppointmentButton from './AppointmentButton';
import ProfileAvatar from './ProfileAvatar';

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
    //const profileImageUrl = '/images/profile/'+provider.id
    return (
      <center>
            <Card sx={{boxShadow: 3, p:1, minWidth:'70vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxHeight:'18vh' }}>
              <ProfileAvatar user={provider} ownPage={false} token={""}/>
              <CardContent >
                <Typography align='left' variant="h5" component="h2">
                  {provider.name}
                </Typography>
                <Typography align='left' color="textSecondary">
                  Phone Number: {provider.phoneNumber}
                </Typography>
                <Typography align= 'left' color="textSecondary">
                  Business Address: {provider.businessAddress}
                </Typography>
                <Box sx={{mt:2}}>
                  {showBookbutton && <AppointmentButton providerId={provider.id}/>}
                </Box>
              </CardContent>
            </Card>
      </center>
    );
  };
  
  export default ProviderInformation;