import { useState, useEffect } from 'react';
import {getProviders} from '../api/provider-api-call';
import { Provider } from '../api/model';
import { Box, List, ListItem, Paper } from '@mui/material';
import ProviderInformation from './ProviderInformation';
import { useAuth0 } from '@auth0/auth0-react';
import SearchForm from '../provider-list/SearchForm';
import ProviderList from '../provider-list/ProviderList';

const ProviderComponent = () => {
  const [resultList, setResultList] = useState<Provider[]>([]);
  const {
    isAuthenticated
  } = useAuth0();

  useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getProviders();
				data.push({businessAddress:'mock address', bio:'mock bio', id:99, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:100, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:101, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:102, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:103, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:104, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:105, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:106, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:107, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:107, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:108, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				data.push({businessAddress:'mock address', bio:'mock bio', id:109, name:'mock name', phoneNumber:'01234556677', email:'adsadasd@gmail.com'})
				setResultList(data)
			} catch (error) {
				console.error('Error:', error);
			}
		};
	
		fetchData();
	
		return () => {};
	}, []);

  const setProviders = (providers: Provider[]) => {
    setResultList(providers)
  }
  return (
    <div>
        <div>
          <Box sx={{display: 'flex', justifyContent:'space-around', alignItems:'top' }}>
            <SearchForm setProviders={setProviders}/>
            <ProviderList providers={resultList}/>

          </Box>
        </div>
    </div>
  );
};

export default ProviderComponent;