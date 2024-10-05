import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, TextField, IconButton, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Provider, User } from '../api/model';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface BusinessInformationProps {
	provider: Provider | null;
	user: User | null;
	ownPage: boolean;
	creatingProfile: boolean;
	saveProfile: (provider: Provider) => void
}

function createProviderFromUser(user: User, businessAddress: string): Provider {
	return new Provider(user.id, user.name, user.phoneNumber, user.email, user.bio, businessAddress)
}

function createProvider(provider: Provider): Provider | null {
	console.log("Create provider")
	console.log(provider)
	if (provider === null) {
		return null
	}
	return new Provider(provider.id, provider.name, provider.phoneNumber, provider.email, provider.bio, provider.businessAddress)
}

const BusinessInformation: React.FC<BusinessInformationProps> = ({provider, user, ownPage, creatingProfile, saveProfile}) => {
    const [editedProvider, setEditedProvider] = useState<Provider | null>(null);
    const [editing, setEditing] = useState<boolean>(creatingProfile);
	//const [formValues, setFormValues] = useState(editedProvider);
	/*useEffect(() => {
		const fetchData = async () => {
			setEditedProvider(ownPage ? {...user!, businessAddress: provider?.businessAddress ?? ""} : {...provider!});
		};
		fetchData();
		return () => {};
	}, [ownPage, provider, user]);*/

	const handleSave = () => {
		if(validateFields()) {
			saveProfile(editedProvider!);
			setEditing(false);
		}
	}

	const handleEditing = () => {
		setEditedProvider(ownPage && creatingProfile ? createProviderFromUser(user!, provider?.businessAddress ?? "") : createProvider(provider!));
		setEditing(true);
	}

	const handleCancel = () => {
		setEditedProvider(ownPage && creatingProfile ? createProviderFromUser(user!, provider?.businessAddress ?? "") : createProvider(provider!));
		setEditing(false);
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

	return (
		<Card sx={{ display: 'flex', mb: 3, p: 2 }}>
			<Avatar 
			alt={editedProvider?.name}
			src="/path-to-image.jpg"
			sx={{ width: 150, height: 150, mr: 2 }}
			/>
			<CardContent>
				
				{editing ? (
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
					{editing ? (
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
					{editing ? (
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
					{editing ? (
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
				
				{editing ? (
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
			
			{ownPage && (
				<Box sx={{ position: 'absolute', right: 16, top: 90 }}>
					{!editing ? (
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
			)}
		</Card>
	);
};

export default BusinessInformation;