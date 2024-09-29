import React from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface NotServiceProviderProps {
    creatingBProfileCallback: (creating: boolean) => void;
}

const NotServiceProvider: React.FC<NotServiceProviderProps> = ({creatingBProfileCallback}) => {

	// Function to handle redirection, e.g., back to home
	const handleCreateBusinessProfile = () => {
		creatingBProfileCallback(true)
	};

	return (
			<Grid
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
				sx={{ backgroundColor: '#f9f9f9', padding: 2 }}
			>
				<Paper elevation={3} sx={{ padding: 4, maxWidth: 500, textAlign: 'center' }}>
					<Box display="flex" flexDirection="column" alignItems="center">
						{/* Error icon */}
						<ErrorOutlineIcon color="error" sx={{ fontSize: 50, mb: 2 }} />

						<Typography variant="h5" color="textPrimary" gutterBottom>
							You are not a service provider.
						</Typography>
						<Typography variant="h6" color="textPrimary" gutterBottom>
							Do you want to create a business profile?
						</Typography>

						{/* Call to action button */}
						<Button
							variant="contained"
							color="primary"
							sx={{ marginTop: 3 }}
							onClick={handleCreateBusinessProfile}
						>
							Create business profile
						</Button>
					</Box>
				</Paper>
			</Grid>
	);
};

export default NotServiceProvider;