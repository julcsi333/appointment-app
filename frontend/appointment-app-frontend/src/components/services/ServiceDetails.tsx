import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, IconButton, Pagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MainService, SubService } from '../api/model';
import { getSubServicesByMainServiceId } from '../api/services-api-call';
import SubServicesTable from './SubServicesTable';

interface ServiceDetailsProps {
	mainService: MainService | null;
	ownPage: boolean;
	token: string;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({mainService, ownPage, token}) => {
	const [editing, setEditing] = useState<boolean>(false);
	const [portfolioPage, setPortfolioPage] = useState<number>(1); // Pagination state for Portfolio
	const [portfolioImages, setPortfolioImages] = useState<string[]>([]); // Placeholder for portfolio images
	const [week, setWeek] = useState<number>(0); // Track which week is being displayed

	const portfolioItemsPerPage = 6;

	// Fetch subservices when the main service changes
	/*useEffect(() => {
		const fetchData = async () => {
			try {
				if (mainService !== null) {
					const fetchedSubServices = await getSubServicesByMainServiceId(mainService!.id);
					setSubServices(fetchedSubServices);
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		
		fetchData();
		return () => {};
	}, [mainService]);*/

	// Handle pagination for portfolio images
	const handlePortfolioPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPortfolioPage(value);
	};

	// Handle week change (e.g. "Next Week" or "Previous Week")
	const handleWeekChange = (direction: 'next' | 'previous') => {
		setWeek(week + (direction === 'next' ? 1 : -1));
	};

	// Portfolio Image Upload Handler (Triggered by clicking on the "+" icon)
	const handleAddImage = () => {
		// Open image uploader (you can use a dialog or a file input here)
		console.log("Add image clicked");
	};

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<Grid container spacing={3}>
				{/* Left Section: Main Service Details and SubServices */}
				<Grid item xs={12} md={6}>
					<Typography variant="h6" gutterBottom>
						{mainService?.description + "Desc" ?? "Select a service to view details."}
					</Typography>

					<SubServicesTable mainService={mainService} ownPage={ownPage} token={token}/>

					{/* Weekly Visualization */}
					<Typography variant="h6" sx={{ mt: 3 }}>Weekly Visualization</Typography>
					<Box>
						<Typography>Week {week}</Typography>
						<Button onClick={() => handleWeekChange('previous')}>Previous Week</Button>
						<Button onClick={() => handleWeekChange('next')}>Next Week</Button>
					</Box>
				</Grid>

				{/* Right Section: Portfolio Grid */}
				<Grid item xs={12} md={6}>
					<Typography variant="h6">Portfolio</Typography>
					<Grid container spacing={2}>
						{/* The "+" Icon for Adding a New Image */}
						<Grid item xs={4}>
							<Box 
								sx={{ 
									height: 150, 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'center', 
									border: '1px dashed gray', 
									cursor: 'pointer'
								}}
								onClick={handleAddImage}
							>
								<AddIcon fontSize="large" />
							</Box>
						</Grid>

						{/* Display Portfolio Images */}
						{portfolioImages.slice((portfolioPage - 1) * portfolioItemsPerPage, portfolioPage * portfolioItemsPerPage).map((image, index) => (
							<Grid item xs={4} key={index}>
								<Box
									component="img"
									src={image}
									sx={{ width: '100%', height: 150, objectFit: 'cover' }}
								/>
							</Grid>
						))}
					</Grid>
					{/* Pagination for Portfolio */}
					<Pagination 
						count={Math.ceil(portfolioImages.length / portfolioItemsPerPage)} 
						page={portfolioPage} 
						onChange={handlePortfolioPageChange} 
						color="primary" 
						sx={{ mt: 2 }} 
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ServiceDetails;
