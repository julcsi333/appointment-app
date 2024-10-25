import React, { ReactNode, useState } from 'react';
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography, SelectChangeEvent, Paper } from '@mui/material';

const SearchForm: React.FC = () => {
	const [service, setService] = useState('');
	const [subService, setSubService] = useState('');
	const [sortBy, setSortBy] = useState('');

	const handleServiceChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
		setService(event.target.value as string);
    	setSubService(''); // clear sub-service when service changes
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
			/>

			{/* Service Selection */}
			<FormControl fullWidth>
				<InputLabel>Service</InputLabel>
				<Select
				value={service}
				onChange={handleServiceChange}
				label="Service"
				>
				<MenuItem value="service1">Service 1</MenuItem>
				<MenuItem value="service2">Service 2</MenuItem>
				<MenuItem value="service3">Service 3</MenuItem>
				</Select>
			</FormControl>

			{/* Sub-Service Selection - Depends on Service */}
			<FormControl fullWidth>
				<InputLabel>Sub-Service</InputLabel>
				<Select
				value={subService}
				onChange={(e) => setSubService(e.target.value as string)}
				label="Sub-Service"
				disabled={!service} // disable if no service is selected
				>
				{/* Conditionally render sub-services based on selected service */}
				{service === 'service1' && (
					<>
					<MenuItem value="sub1">Sub-Service 1A</MenuItem>
					<MenuItem value="sub2">Sub-Service 1B</MenuItem>
					</>
				)}
				{service === 'service2' && (
					<>
					<MenuItem value="sub1">Sub-Service 2A</MenuItem>
					<MenuItem value="sub2">Sub-Service 2B</MenuItem>
					</>
				)}
				{/* Add more sub-services as needed */}
				</Select>
			</FormControl>

			{/* Sort By Selection */}
			<FormControl fullWidth>
				<InputLabel>Sort By</InputLabel>
				<Select
				value={sortBy}
				onChange={(e) => setSortBy(e.target.value as string)}
				label="Sort By"
				>
				<MenuItem value="rating">Rating</MenuItem>
				<MenuItem value="popularity">Popularity</MenuItem>
				<MenuItem value="distance">Distance</MenuItem>
				</Select>
			</FormControl>

			{/* Search Button */}
			<Button 
				variant="contained" 
				color="primary" 
				fullWidth 
				sx={{ mt: 2 }}
			>
				Search
			</Button>
		</Paper>
	);
};

export default SearchForm;