import React, { useState } from 'react';
import { Box, Grid, Typography, Button, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { MainService } from '../api/model';
import SubServicesTable from './SubServicesTable';
import Portfolio from './Portfolio';

interface ServiceDetailsProps {
	mainService: MainService | null;
	ownPage: boolean;
	token: string;
	saveDescription: (description: string) => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({mainService, ownPage, token, saveDescription}) => {
	const [editingDesc, setEditingDesc] = useState<boolean>(false);
	const [editedDesc, setEditedDesc] = useState<string>("");
	const [week, setWeek] = useState<number>(0); // Track which week is being displayed

	// Handle week change (e.g. "Next Week" or "Previous Week")
	const handleWeekChange = (direction: 'next' | 'previous') => {
		setWeek(week + (direction === 'next' ? 1 : -1));
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
		<Box sx={{ flexGrow: 1}}>
			<Grid container spacing={3} >
				{/* Left Section: Main Service Details and SubServices */}
				<Grid item xs={12} md={6} sx={{mt: 3, ml: 3, pr:2}}>
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
								<Typography variant="body1" gutterBottom style={{ flexGrow: 1 }}>
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

				</Grid>

				{/* Right Section: Portfolio Grid */}
				<Grid item xs={12} md={6} sx={{ ml: -3}}>
					<Portfolio mainService={mainService} ownPage={ownPage} token={token} />
				</Grid>
			</Grid>
		</Box>
	);
};

export default ServiceDetails;
