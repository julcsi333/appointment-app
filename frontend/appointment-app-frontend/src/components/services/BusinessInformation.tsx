import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, IconButton, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Provider, User } from '../api/model';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../common/ProfileAvatar';

interface BusinessInformationProps {
	provider: Provider | null;
	user: User | null;
	editingBProfile: boolean;
	setEditingBProfile: (editing: boolean) => void;
	ownPage: boolean;
	creatingProfile: boolean;
	saveProfile: (provider: Provider) => void;
	token: string;
}

function createProviderFromUser(user: User, bio: string | undefined | null, businessAddress: string | undefined | null): Provider {
	return new Provider(user.id, user.name, user.phoneNumber, user.email, bio ?? "", businessAddress ?? "")
}

function createProvider(provider: Provider): Provider | null {
	console.log("Create provider")
	console.log(provider)
	if (provider === null) {
		return null
	}
	return new Provider(provider.id, provider.name, provider.phoneNumber, provider.email, provider.bio, provider.businessAddress)
}

const BusinessInformation: React.FC<BusinessInformationProps> = ({provider, user, editingBProfile, setEditingBProfile, ownPage, creatingProfile, saveProfile, token}) => {
    const [editedProvider, setEditedProvider] = useState<Provider | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (creatingProfile) {
			setEditedProvider(createProvider(provider!))
		}
		return () => {};
	}, [creatingProfile, provider]);

	const handleSave = () => {
		if(validateFields()) {
			saveProfile(editedProvider!);
			setEditingBProfile(false);
		}
	}

	const handleEditing = () => {
		setEditedProvider(ownPage && creatingProfile ? createProviderFromUser(user!, provider?.bio, provider?.businessAddress) : createProvider(provider!));
		setEditingBProfile(true);
	}

	const handleCancel = () => {
		setEditedProvider(ownPage && creatingProfile ? createProviderFromUser(user!,provider?.bio, provider?.businessAddress) : createProvider(provider!));
		setEditingBProfile(false);
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setEditedProvider({ ...editedProvider!, [name]: value });
	};

	const [errors, setErrors] = useState({
		name: '',
		businessAddress: '',
		phoneNumber: '',
		email: '',
	});

	const validateFields = () => {
		let isValid = true;
		let tempErrors = { name: '', businessAddress: '', phoneNumber: '', email: '' };
		console.log(editedProvider!.name)
		// Name validation (required)
		if (editedProvider!.name === null || editedProvider!.name === undefined || editedProvider!.name.trim() === "") {
			tempErrors.name = 'Name is required';
			isValid = false;
		}
	
		// Address validation (required)
		if (editedProvider!.businessAddress === null || editedProvider!.businessAddress === undefined || editedProvider!.businessAddress.trim() === "") {
			tempErrors.businessAddress = 'Business address is required';
			isValid = false;
		}
	
		// Phone number validation (required, simple pattern check)
		const phonePattern = /^[\d\s()-]+$/;
		if (editedProvider!.phoneNumber === null || editedProvider!.phoneNumber === undefined || editedProvider!.phoneNumber.trim() === "") {
			tempErrors.phoneNumber = 'Phone number is required';
			isValid = false;
		} else if (!phonePattern.test(editedProvider!.phoneNumber)) {
			tempErrors.phoneNumber = 'Enter a valid phone number';
			isValid = false;
		}
	
		// Email validation (required, simple email pattern check)
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (editedProvider!.email === null || editedProvider!.email === undefined || editedProvider!.email.trim() === "") {
			tempErrors.email = 'Email is required';
			isValid = false;
		} else if (!emailPattern.test(editedProvider!.email)) {
			tempErrors.email = 'Enter a valid email address';
			isValid = false;
		}
	
		setErrors(tempErrors);
		return isValid;
	};

	const handleAvailabilityButtonClick = () => {
		navigate(`/providers/${provider!.id}/availability`);
	};

	return (
		<Card sx={{display: 'flex', justifyContent: 'space-between', mb: 3, p: 2 }}>
			<Box sx={{ display: 'flex'}}>
				<ProfileAvatar user={provider} ownPage={ownPage} token={token}/>
				<CardContent>
					
					{editingBProfile ? (
						<Box sx={{ display: 'flex', alignItems: 'center', mt: 1, pl: 4 /* Align with icon padding */ }}>
							<TextField
							fullWidth
							label="Name"
							name="name"
							value={editedProvider?.name ?? ""}
							onChange={handleInputChange}
							error={!!errors.name}
							helperText={errors.name}
							sx={{ mb: 2 }}
							/>
						</Box>
					) : (
						<Typography variant="h5">{provider?.name}</Typography>
					)}

					{/* Address with Icon */}
					<Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
						<LocationOnIcon sx={{ mr: 1, color: 'gray' }} />
						{editingBProfile ? (
							<TextField
								fullWidth
								label="Business Address"
								name="businessAddress"
								value={editedProvider?.businessAddress ?? ""}
								error={!!errors.businessAddress}
								helperText={errors.businessAddress}
								onChange={handleInputChange}
							/>
						) : (
							<Typography variant="body1">{provider?.businessAddress}</Typography>
						)}
					</Box>

					{/* Phone Number with Icon */}
					<Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
						<PhoneIcon sx={{ mr: 1, color: 'gray' }} />
						{editingBProfile ? (
							<TextField
								fullWidth
								label="Phone Number"
								name="phoneNumber"
								value={editedProvider?.phoneNumber ?? ""}
								error={!!errors.phoneNumber}
								helperText={errors.phoneNumber}
								onChange={handleInputChange}
						/>
						) : (
							<Typography variant="body1">{provider?.phoneNumber}</Typography>
						)}
					</Box>

					{/* Email with Icon */}
					<Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
						<EmailIcon sx={{ mr: 1, color: 'gray' }} />
						{editingBProfile ? (
							<TextField
								fullWidth
								label="Email"
								name="email"
								value={editedProvider?.email ?? ""}
								error={!!errors.email}
								helperText={errors.email}
								onChange={handleInputChange}
							/>
						) : (
							<Typography variant="body1">{provider?.email}</Typography>
						)}
					</Box>
					
					{editingBProfile ? (
						<Box sx={{ display: 'flex', alignItems: 'center', mt: 2, pl: 4 /* Align with icon padding */ }}>
							<TextField
							fullWidth
							multiline
							rows={4}
							label="Bio"
							name="bio"
							value={editedProvider?.bio ?? ""}
							onChange={handleInputChange}
							/>
						</Box>
					) : (
						<Typography variant="body2" sx={{ mt: 1 }}>
						{provider?.bio}
						</Typography>
					)}
				</CardContent>
				{/* Edit/Save/Cancel buttons */}
				
				
			</Box>
			<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'end'}}>
				{ownPage && (
					<>
						<Box>
							{!editingBProfile ? (
								<IconButton onClick={handleEditing}>
									<EditIcon />
								</IconButton>
							) : (
								
								<>
									<Button
										variant="contained"
										color="primary"
										startIcon={<SaveIcon />}
										onClick={handleSave}
										sx={{ mr: 1 }}
									>
										Save
									</Button>
									{!creatingProfile && (
										<Button
											variant="outlined"
											color="secondary"
											startIcon={<CancelIcon />}
											onClick={handleCancel}
										>
											Cancel
										</Button>
									)}


								</>
							)}
						</Box>
						{!creatingProfile && (
							<Button variant='contained' onClick={handleAvailabilityButtonClick}>Manage availability</Button>
						)}
					</>
				)}
			</Box>
		</Card>
	);
};

export default BusinessInformation;