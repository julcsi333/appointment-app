import React, { ReactNode, useEffect, useState } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography, SelectChangeEvent, Paper } from '@mui/material';
import { GlobalService, Provider, SortByTactic } from '../api/model';
import { getAllGlobalServices, getSubServicesByGlobalServiceId } from '../api/services-api-call';
import { getProvidersByForm } from '../api/provider-api-call';

interface Props {
	setProviders: (providers: Provider[]) => void;
}

const SearchForm: React.FC<Props> = ({setProviders}) => {
	const [providerName, setProviderName] = useState<string>('');
	const [globalService, setGlobalService] = useState<GlobalService | undefined>(undefined);
	const [globalServices, setGlobalServices] = useState<GlobalService[]>([]);
	const [subServices, setSubServices] = useState<string[]>([]);
	const [subService, setSubService] = useState('');
	const [sortBy, setSortBy] = useState<SortByTactic>(SortByTactic.POPULARITY);

	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const services = await getAllGlobalServices();
				setGlobalServices(services)
			} catch (error) {
				console.error('Error:', error);
			}
		};
	
		fetchData();
	
		return () => {};
	}, []);

	const handleServiceChange = async (event: SelectChangeEvent<string>, child: ReactNode) => {
		const value = event.target.value
		if (value !== null && value !== undefined && value !== '') {
			const gs = globalServices.find(gs => gs.id === Number(value))!
			setGlobalService(gs);
			setSubServices(await getSubServicesByGlobalServiceId(gs.id));
		} else {
			setGlobalService(undefined);
			setSubServices([])
		}
		setSubService(''); // clear sub-service when service changes
		
	};

	const searchProviders = async () => {
		setProviders(await getProvidersByForm(providerName, globalService?.id, subService, sortBy))
	}
	const handleProviderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setProviderName(event.target.value)
	};
	return (
		<Paper sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500, mt: 2, p: 3, boxShadow: 3, minWidth: '60vh', maxHeight:'45vh'}}>
			<Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
				Search Providers
			</Typography>

			{/* Search Bar */}
			<TextField 
				label="Provider Name" 
				variant="outlined" 
				fullWidth 
				value={providerName}
				onChange={handleProviderNameChange}
			/>

			{/* Service Selection */}
			<FormControl fullWidth>
				<InputLabel>Service</InputLabel>
				<Select
				value={globalService != null ? String(globalService.id) : ''}
				onChange={handleServiceChange}
				label="Service"
				>
				{globalServices.map((gs: GlobalService) => (
					<MenuItem key={gs.id} value={gs.id}>{gs.name}</MenuItem>
				))}
				</Select>
			</FormControl>

			{/* Sub-Service Selection - Depends on Service */}
			<FormControl fullWidth>
				<InputLabel>Sub-Service</InputLabel>
				<Select
				value={subService}
				onChange={(e) => setSubService(e.target.value as string)}
				label="Subservice"
				disabled={globalService === null} // disable if no service is selected
				>
					{subServices.map((subServiceName: string) => (
						<MenuItem key={subServiceName} value={subServiceName}>{subServiceName}</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* Sort By Selection */}
			<FormControl fullWidth>
				<InputLabel>Sort By</InputLabel>
				<Select
				value={sortBy}
				onChange={(e) => setSortBy(e.target.value as SortByTactic)}
				label="Sort By"
				>
				<MenuItem value={SortByTactic.POPULARITY}>Popularity</MenuItem>
				<MenuItem value={SortByTactic.PRICE_AVG}>Average Price</MenuItem>
				<MenuItem value={SortByTactic.PRICE_LOWEST}>Lowest Price</MenuItem>
				</Select>
			</FormControl>

			{/* Search Button */}
			<Button 
				variant="contained" 
				color="primary" 
				fullWidth 
				sx={{ mt: 2 }}
				onClick={searchProviders}
			>
				Search
			</Button>
		</Paper>
	);
};

export default SearchForm;