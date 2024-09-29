import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Tabs, Tab, IconButton, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GlobalService, MainService, Provider, SubService } from '../api/model';
import { createService, getAllGlobalServices, getServicesByProviderId } from '../api/services-api-call';

interface ServicesInformationProps {
	provider: Provider | null;
	ownPage: boolean;
	creatingProfile: boolean;
	token: string;
}

const ServicesInformation: React.FC<ServicesInformationProps> = ({provider, ownPage, creatingProfile, token}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	
	// State for managing the service tabs
	/*const [serviceTabs, setServiceTabs] = useState<ServiceTab[]>([
		{ id: 0, label: 'Manicure', content: 'Manicure services description...' },
		{ id: 1, label: 'Hairdressing', content: 'Hairdressing services description...' }
	]);*/

	const [currentService, setCurrentService] = useState<MainService>();
	const [services, setServices] = useState<MainService[]>([]);
	const [globalServices, setGlobalServices] = useState<GlobalService[]>([]);


	useEffect(() => {
		const fetchData = async () => {
			try {
				if (provider !== null) {
					var providedServices = await getServicesByProviderId(provider.id.toString());
					if(providedServices.length > 0) {
						setCurrentService(providedServices[0])
					}
					setServices(providedServices)
				}
				setGlobalServices(await getAllGlobalServices())

			} catch (error) {
				console.error('Error:', error);
			}
		};
		
		fetchData();
		return () => {};
	}, [provider, provider?.id]);

	// Handle tab change
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		for (var service of services) {
			if (service.id === newValue) {
				setCurrentService(service)
				break;
			}
		}
	};

	// Add a new service tab when the + icon is clicked
	const addNewTab = async (globalService: GlobalService) => {
		console.log("add tab:")
		console.log(globalService)
		setAnchorEl(null);
		var newService = await createService({
			id: null, 
			description: "", 
			globalService: globalService, 
			providerId: provider!.id, 
			subServices: []
		}, token)
		setServices([...services, newService])
		
		setCurrentService(newService)
		console.log(newService)
	};
	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(null);
	};

	return (
		<Card sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
				<Tabs value={currentService?.id} onChange={handleTabChange} aria-label="service tabs">
					{services.map((service) => (
					<Tab key={service.id} label={service.globalService.name} />
					))}
				</Tabs>
				{ownPage && !creatingProfile && (
					<>
						<IconButton 
						onClick={handleMenuOpen}
						aria-label="create-service"
						aria-haspopup="true"
						aria-controls="create-service-menu"
						sx={{ ml: 'auto' }}>
							<AddIcon />
						</IconButton>
						<Menu
							id="create-service-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							{globalServices.map((globalService) => (
							<MenuItem key={globalService.id} onClick={() => addNewTab(globalService)}>{globalService.name}</MenuItem>
							))}
						</Menu>
					</>
				)}

			</Box>

			{/* Tab Content */}
			<Box sx={{ flexGrow: 1, p: 3 }}>
				<Typography variant="body1">
					{currentService?.description ?? "Select a service to view details."}
				</Typography>
			</Box>
		</Card>
	);
};

export default ServicesInformation;