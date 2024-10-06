import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, IconButton, Pagination, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { MainService } from '../api/model';
import SubServicesTable from './SubServicesTable';

interface ServiceDetailsProps {
	mainService: MainService | null;
	ownPage: boolean;
	token: string;
	saveDescription: (description: string) => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({mainService, ownPage, token, saveDescription}) => {
	const [editingDesc, setEditingDesc] = useState<boolean>(false);
	const [editedDesc, setEditedDesc] = useState<string>("");
	const [portfolioPage, setPortfolioPage] = useState<number>(1); // Pagination state for Portfolio
	const [portfolioImages, setPortfolioImages] = useState<string[]>([]); // Placeholder for portfolio images
	const [week, setWeek] = useState<number>(0); // Track which week is being displayed

	const portfolioItemsPerPage = 6;

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

	const handleSaveDescription = () => {
		setEditingDesc(false)
		saveDescription(editedDesc)
	};

	const handleEditDescription = () => {
		setEditingDesc(true)
		setEditedDesc(mainService?.description ?? "")
	};

	const handleInputChangedDescription = (value: string) => {
		setEditedDesc(value)
	};

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<Grid container spacing={3}>
				{/* Left Section: Main Service Details and SubServices */}
				<Grid item xs={12} md={6}>
					<Box display="flex" alignItems="center">
						{editingDesc ? (
							<>
								<TextField
								fullWidth
								multiline
								rows={4}
								label="Description"
								name="description"
								value={editedDesc}
								onChange={(event) => handleInputChangedDescription(event.target.value)}
								/>
								<IconButton aria-label="save" onClick={handleSaveDescription}>
									<SaveIcon />
								</IconButton>
							</>
						) : (
							<>
								<Typography variant="h6" gutterBottom style={{ flexGrow: 1 }}>
									{mainService?.description ?? "No description yet."}
								</Typography>
								{ownPage && (
									<IconButton aria-label="edit" onClick={handleEditDescription}>
										<EditIcon />
									</IconButton>
								)}
							</>
						)}


					</Box>
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
