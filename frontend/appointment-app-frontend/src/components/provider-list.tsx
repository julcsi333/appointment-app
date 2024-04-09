import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import {getProviders} from './api/provider-api-call';
import {Provider} from './api/model';
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  height: '100%', // Ensure the card takes up full height of the ListItem
  minWidth: '100vh',
  display: 'flex', // Use flexbox layout
  flexDirection: 'row', // Arrange child elements in a column
  justifyContent: 'space-around'
});

const StyledList = styled(List)({
});

const StyledCardContent = styled(CardContent)({
});


const ProviderComponent = () => {
  const [resultList, setResultList] = useState<Provider[]>([]);

  const handleAppointmentClick = () => {
    console.log('Appointment clicked');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProviders();
        setResultList(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();

    return () => {

    };
  }, []);


  return (
    <div>
      {resultList.length > 0 && (
        <div>
          <StyledList>
            {resultList.map((item, index) => (
              <ListItem key={item.name}>
                <StyledCard>
                  <StyledCardContent>
                    <Typography variant="h5" component="h2">
                      {item.name}
                    </Typography>
                    <Typography color="textSecondary">
                      {item.phoneNumber}
                    </Typography>
                    <Typography color="textSecondary">
                      {item.businessAddress}
                    </Typography>
                  </StyledCardContent>
                  <StyledCardContent>
                    {/* Picture in the future */}
                    <Button color="inherit" onClick={handleAppointmentClick}>Appointment</Button>
                  </StyledCardContent>
                </StyledCard>
              </ListItem>
            ))}
          </StyledList>
        </div>
      )}
    </div>
  );
};

export default ProviderComponent;