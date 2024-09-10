import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

interface EditProfileButtonProps {
    editing: boolean;
    handleEditClick: () => void;
}

const EditProfileButton : React.FC<EditProfileButtonProps> = ({editing, handleEditClick}) => {
	const navigate = useNavigate();

	return (
    	<Button variant="contained" color="primary" onClick={handleEditClick}>
			{ editing ? 'Save Profile' : 'Edit Profile'}
    	</Button>
	);
};

export default EditProfileButton;