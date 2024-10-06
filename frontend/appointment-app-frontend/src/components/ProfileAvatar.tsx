import React, { useEffect, useState } from 'react';
import { User } from './api/model';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { getBaseUrl } from '../config';
import { uploadProfilePicture } from './api/user-api-call';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface ProfileAvatarProps {
	user: User | null;
	ownPage: boolean;
	token: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({user, ownPage, token}) => {
	const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const defaultProfilePicUrl = "";

	useEffect(() => {
        if (user !== null) {
            setProfilePicUrl(`${getBaseUrl()}/users/${user!.id}/profile-picture`)
        }
		return () => {};
	}, [user]);

    // Open dialog when avatar is clicked
    const handleClickOpen = () => {
        console.log(profilePicUrl)
        if (ownPage) {
            setOpen(true);
        }
    };

    // Close dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (selectedFile) {
            await uploadProfilePicture(user!.id.toString(), selectedFile, token);
        }
        setOpen(false);
    };

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Create preview URL for the selected image
        }
    };

	return (
        <>
            {ownPage ? (
                <Avatar 
                alt={user?.name}
                src={profilePicUrl ?? defaultProfilePicUrl}
                sx={{ width: 150, height: 150, mr: 2, cursor: 'pointer' }}
                onClick={handleClickOpen} // Open dialog on click
                />
            ) : (
                <Avatar 
                alt={user?.name}
                src={profilePicUrl ?? defaultProfilePicUrl}
                sx={{ width: 150, height: 150, mr: 2}}
                />
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Upload New Profile Picture</DialogTitle>
                <DialogContent>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-file"
                        type="file"
                        onChange={handleFileChange} // Handle file input change
                    />

                    <center>
                        {previewUrl && (
                            <Avatar
                            alt="Selected Picture"
                            src={previewUrl} // Display preview of selected image
                            sx={{ width: 150, height: 150, mt: 2 }}
                            />
                        )}
                        <label htmlFor="upload-file">
                            <Button 
                                color="primary" 
                                aria-label="upload picture"
                                component="span"
                                startIcon={<PhotoCamera />}
                            >

                                Select
                                
                            </Button>
                        </label>
                    </center>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} color="primary" variant="contained">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </>
	);
};

export default ProfileAvatar;
