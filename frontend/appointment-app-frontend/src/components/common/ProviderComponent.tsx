import { useState, useEffect } from 'react';
import {getProviders} from '../api/provider-api-call';
import { Provider } from '../api/model';
import { Box } from '@mui/material';
import SearchForm from '../provider-list/SearchForm';
import ProviderList from '../provider-list/ProviderList';

const ProviderComponent = () => {
	const [resultList, setResultList] = useState<Provider[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getProviders();
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