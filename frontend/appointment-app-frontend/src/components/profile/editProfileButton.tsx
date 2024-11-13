import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

interface EditProfileButtonProps {
    editing: boolean;
    handleEditClick: () => void;
    handleSaveClick: () => void;
    handleCancelClick: () => void;
}

const EditProfileButton : React.FC<EditProfileButtonProps> = ({editing, handleEditClick, handleSaveClick, handleCancelClick}) => {

	return (
		<>
			{!editing ? (
				<Button variant="contained" color="primary" onClick={handleEditClick} startIcon={<EditIcon />}>
					Edit Profile
				</Button>
			) : (
				<>
					<Button sx={{mr:1}} variant="outlined" color="secondary" onClick={handleCancelClick} startIcon={<CancelIcon />}>
						Cancel
					</Button>
					<Button sx={{ml:1}} variant="contained" color="primary" onClick={handleSaveClick} startIcon={<SaveIcon />}>
						Save
					</Button>
				</>
			)}
		</>
	);
};

export default EditProfileButton;