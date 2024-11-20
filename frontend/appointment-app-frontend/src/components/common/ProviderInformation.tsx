import React from 'react';
import { Typography, Card, CardContent, Box } from '@mui/material';
import { Provider } from '../api/model';
import AppointmentButton from './AppointmentButton';
import ProfileAvatar from './ProfileAvatar';
import { useNavigate } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface ProviderInformationProps {
    provider: Provider;
    showBookbutton: boolean;
}

const ProviderInformation: React.FC<ProviderInformationProps>  = ({ provider, showBookbutton }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/services/providers/${provider.id}`);
    };

    return (
      <center>
            <Card onClick={handleClick} sx={{boxShadow: 3, p:1, minWidth:'70vh', maxWidth:'100vh', display: 'flex', alignItems: 'center', maxHeight:'18vh', cursor: 'pointer', "&:hover": {boxShadow:6}}}>
              <Box sx={{ flexShrink: 0, mr: 2 }}>
                <ProfileAvatar user={provider} ownPage={false} token={""}/>
              </Box>
              <CardContent sx={{ flex: 1 }}>
                <Typography align='left' variant="h5" component="h2">
                  {provider.name}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'left'}}>
                  <EmailIcon sx={{ mr: 1, color: 'gray' }} />
                  <Typography color="textSecondary">{provider.email}</Typography>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'left'}}>
                  <PhoneIcon sx={{ mr: 1, color: 'gray' }} />
                  <Typography color="textSecondary">{provider.phoneNumber}</Typography>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'left'}}>
                  <LocationOnIcon sx={{ mr: 1, color: 'gray' }} />
                  <Typography color="textSecondary">{provider.businessAddress}</Typography>
                </Box>
              </CardContent>
              {showBookbutton && (
                  <Box sx={{ alignSelf:'flex-end' }}>
                      <AppointmentButton providerId={provider.id}/>
                  </Box>
                )}
            </Card>
      </center>
    );
  };
  
  export default ProviderInformation;