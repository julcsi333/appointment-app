import React, { useEffect, useState } from 'react';
import { User } from '../api/model';
import { Avatar } from '@mui/material';
import { uploadProfilePicture } from '../api/user-api-call';
import PictureUploadDialog from './PictureUploadDialog';
import { getBaseUrl } from '../../config/config';
import { timeStamp } from 'console';

interface ProfileAvatarProps {
	user: User | null;
	ownPage: boolean;
	token: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({user, ownPage, token}) => {
	const [open, setOpen] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState<string>("");

	useEffect(() => {
        if (user !== null) {
            setProfilePicUrl(`${getBaseUrl()}/users/${user!.id}/profile-picture?t=${Date.now()}`)
        }
		return () => {};
	}, [user]);

    // Open dialog when avatar is clicked
    const handleClickOpen = () => {
        if (ownPage) {
            setOpen(true);
        }
    };

    // Close dialog
    const closeDialog = () => {
        setOpen(false);
    };

    // Handle file upload
    const uploadFile = async (file: File) => {
        await uploadProfilePicture(user!.id.toString(), file, token);
        setProfilePicUrl(`${getBaseUrl()}/users/${user!.id}/profile-picture?t=${Date.now()}`)
        setOpen(false);
    };

	return (
        <>
            {ownPage ? (
                <Avatar 
                alt={user?.name}
                src={profilePicUrl}
                sx={{ width: 150, height: 150, mr: 2, cursor: 'pointer' }}
                onClick={handleClickOpen} // Open dialog on click
                />
            ) : (
                <Avatar 
                alt={user?.name}
                src={profilePicUrl}
                sx={{ width: 150, height: 150, mr: 2}}
                />
            )}

            <PictureUploadDialog open={open} avatarPreview={true} title={'Upload New Profile Picture'} closeDialog={closeDialog} uploadFile={uploadFile}  />
        </>
	);
};

export default ProfileAvatar;
