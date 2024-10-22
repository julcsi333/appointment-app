import React from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import GlobalToolbar from '../components/common/GlobalToolbar';
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorType } from '../components/error/model';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// Function to handle redirection, e.g., back to home
	const handleGoBack = () => {
		navigate('/');
	};

	return (
		<div>
			<GlobalToolbar/>
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

						{/* Conditional rendering of the error message */}
						{location.state.errorType === ErrorType.PROVIDER_NOT_FOUND ? (
							<Typography variant="h5" color="textPrimary" gutterBottom>
								Provider not found with id {location.state.providerId}
							</Typography>
						) : (
							<Typography variant="h5" color="textPrimary" gutterBottom>
								Unexpected error occurred
							</Typography>
						)}

						{/* Call to action button */}
						<Button
							variant="contained"
							color="primary"
							sx={{ marginTop: 3 }}
							onClick={handleGoBack}
						>
							Go Back to Home
						</Button>
					</Box>
				</Paper>
			</Grid>
		</div>
	);
};

export default ErrorPage;