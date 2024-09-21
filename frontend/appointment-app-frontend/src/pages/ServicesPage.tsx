import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Tabs, Tab, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth0 } from '@auth0/auth0-react';
import GlobalToolbar from '../components/GlobalToolbar';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// A simple interface to define the service tab
interface ServiceTab {
  id: number;
  label: string;
  content: string;
}

const ServicesPage: React.FC = () => {
	// Sample business information
	const businessInfo = {
		name: 'Jane Doe',
		address: '123 Business St, Suite 456, New York, NY',
		phone: '(123) 456-7890',
		email: 'jane.doe@example.com',
		bio: 'Experienced hairstylist and manicurist with over 15 years of experience.'
	};

	// State for the currently selected tab
	const [currentTab, setCurrentTab] = useState<number>(0);
	
	// State for managing the service tabs
	const [serviceTabs, setServiceTabs] = useState<ServiceTab[]>([
		{ id: 0, label: 'Manicure', content: 'Manicure services description...' },
		{ id: 1, label: 'Hairdressing', content: 'Hairdressing services description...' }
	]);

	// Handle tab change
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
	};

	// Add a new service tab when the + icon is clicked
	const addNewTab = () => {
		const newTab: ServiceTab = {
		id: serviceTabs.length,
		label: `Service ${serviceTabs.length + 1}`,
		content: 'New service description...'
		};
		setServiceTabs([...serviceTabs, newTab]);
		setCurrentTab(newTab.id);
	};

	return (
		<div>
			<GlobalToolbar />
			<Box sx={{ p: 2 }}>
			{/* Business Information Card */}
			<Card sx={{ display: 'flex', mb: 3, p: 2 }}>
				<Avatar 
				alt={businessInfo.name}
				src="/path-to-image.jpg"
				sx={{ width: 150, height: 150, mr: 2 }}
				/>
				<CardContent>
				<Typography variant="h5">{businessInfo.name}</Typography>
				{/* Address with Icon */}
				<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
					<LocationOnIcon sx={{ mr: 1, color: 'gray' }} />
					<Typography variant="body1">{businessInfo.address}</Typography>
				</Box>
				 {/* Phone Number with Icon */}
				<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
					<PhoneIcon sx={{ mr: 1, color: 'gray' }} />
					<Typography variant="body1">{businessInfo.phone}</Typography>
				</Box>
				 {/* Email with Icon */}
				<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
					<EmailIcon sx={{ mr: 1, color: 'gray' }} />
					<Typography variant="body1">{businessInfo.email}</Typography>
				</Box>
				<Typography variant="body2" sx={{ mt: 1 }}>{businessInfo.bio}</Typography>
				</CardContent>
			</Card>

			{/* Services Section with Tabs */}
			<Card sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
				{/* Tabs */}
				<Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
				<Tabs value={currentTab} onChange={handleTabChange} aria-label="service tabs">
					{serviceTabs.map((tab) => (
					<Tab key={tab.id} label={tab.label} />
					))}
				</Tabs>
				{/* Add new service tab button */}
				<IconButton onClick={addNewTab} sx={{ ml: 'auto' }}>
					<AddIcon />
				</IconButton>
				</Box>

				{/* Tab Content */}
				<Box sx={{ flexGrow: 1, p: 3 }}>
				<Typography variant="body1">
					{serviceTabs[currentTab]?.content || "Select a service to view details."}
				</Typography>
				</Box>
			</Card>
			</Box>
		</div>
	);
};

export default ServicesPage;