import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Tabs, Tab, IconButton, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GlobalService, MainService, Provider } from '../api/model';
import { createService, deleteService, getAllGlobalServices, getServiceById, getServicesByProviderId, updateService } from '../api/services-api-call';
import DeleteDialog from '../common/DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import ServiceDetails from './ServiceDetails';

interface ServicesInformationProps {
	provider: Provider | null;
	ownPage: boolean;
	creatingProfile: boolean;
	token: string;
}

const ServicesInformation: React.FC<ServicesInformationProps> = ({provider, ownPage, creatingProfile, token}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [currentTab, setCurrentTab] = useState<number>(0);
	const [currentService, setCurrentService] = useState<MainService | null>(null);
	const [services, setServices] = useState<MainService[]>([]);
	const [globalServices, setGlobalServices] = useState<GlobalService[]>([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);


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
		setCurrentTab(newValue)
		setCurrentService(services[newValue])
		/*for (var service of services) {
			if (service.id === newValue) {
				setCurrentService(service)
				break;
			}
		}*/
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
		setCurrentTab(services.length)
		
		setCurrentService(newService)
		console.log(newService)
	};
	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(null);
	};

	const handleDeleteService = async () => {
		setDeleteDialogOpen(false)
		await deleteService(currentService!.id, token);
		services.splice(currentTab, 1)
		setServices(services)
		if (services.length === 0) {
			setCurrentService(null)
			setCurrentTab(0)
		} else if (currentTab >= services.length) {
			setCurrentTab(services.length-1)
			setCurrentService(services[currentTab])
		} else {
			setCurrentService(services[currentTab])
		}
	};

	const saveDescription = async (description: string) => {
		const service = await getServiceById(currentService!.id.toString())
		service.description = description
		const updatedService = await updateService(service, token)
		setCurrentService(updatedService)
		var providedServices = await getServicesByProviderId(provider!.id.toString());
		setServices(providedServices)
	}

	return (
		<Card sx={{ minHeight:'70vh', display: 'flex', flexDirection: 'column' }}>
			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
				<Tabs value={currentTab} onChange={handleTabChange} aria-label="service tabs">
					{services.map((service, idx) => (
					<Tab
						key={service.id} 
						label={
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Typography>{service.globalService.name}</Typography>
								{ownPage && idx === currentTab && (
									<IconButton
										size="small"
										onClick={() => setDeleteDialogOpen(true)}
										sx={{ ml: 1 }}
										aria-label="delete-service"
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
								)}
							</Box>
						}
					/>
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
			<DeleteDialog deleteDialogOpen={deleteDialogOpen} dialogDescription={'Are you sure you want to delete this service? This action cannot be undone.'} confirmDelete={handleDeleteService} cancelDelete={() => setDeleteDialogOpen(false)} />
			{/* Tab Content */}
			{services.length !== 0 ? (
				<ServiceDetails mainService={currentService} ownPage={ownPage} token={token} saveDescription={saveDescription}/>
			) : (
				<center>
					<Typography sx={{ mt: 2, pl: 2 }} variant="h6">You have no services</Typography>
				</center>
				
			)}
			
		</Card>
	);
};

export default ServicesInformation;