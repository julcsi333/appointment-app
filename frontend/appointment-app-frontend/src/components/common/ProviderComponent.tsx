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
				data.push(new Provider(99, 'Eloise Jones', '01234556677', 'eloise.jones@gmail.com', 'mock bio', '***'))
				data.push(new Provider(100, 'Clare Gentry', '01234556677', 'clare.gentry@gmail.com', 'mock bio', '***'))
				data.push(new Provider(101, 'Noah Turner', '01234556677', 'noah.turner@gmail.com', 'mock bio', '***'))
				data.push(new Provider(102, 'Tessa Byrd', '01234556677', 'tessa.b@gmail.com', 'mock bio', '***'))
				data.push(new Provider(103, 'mock name', '01234556677', 'adsadasd@gmail.com', 'mock bio', '***'))
				data.push(new Provider(104, 'mock name', '01234556677', 'adsadasd@gmail.com', 'mock bio', '***'))
				data.push(new Provider(105, 'mock name', '01234556677', 'adsadasd@gmail.com', 'mock bio', '***'))
				data.push(new Provider(106, 'mock name', '01234556677', 'adsadasd@gmail.com', 'mock bio', 'mock address'))
				data.push(new Provider(107, 'mock name', '01234556677', 'adsadasd@gmail.com', 'mock bio', 'mock address'))
				data.push(new Provider(108, 'mock name', '01234556677', 'adsadasd@gmail.com', 'mock bio', 'mock address'))
				data.push(new Provider(109, 'mock name', '01234556677', 'adsadasd@gmail.com', 'mock bio', 'mock address'))
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