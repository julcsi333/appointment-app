import { useState, useEffect } from 'react';
import {getProviders} from '../api/provider-api-call';
import { Provider } from '../api/model';
import { List, ListItem } from '@mui/material';
import ProviderInformation from './ProviderInformation';
import { useAuth0 } from '@auth0/auth0-react';

const ProviderComponent = () => {
  const [resultList, setResultList] = useState<Provider[]>([]);
  const {
    isAuthenticated
  } = useAuth0();
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
          <List>
            {resultList.map((provider, index) => (
              <ListItem key={provider.id}>
                <ProviderInformation provider={provider} showBookbutton={isAuthenticated} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default ProviderComponent;