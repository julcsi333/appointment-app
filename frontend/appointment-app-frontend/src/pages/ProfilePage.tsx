import React, { ChangeEvent, useEffect, useState } from 'react';
import GlobalToolbar from '../components/GlobalToolbar';
import '../App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserByExternalId } from '../components/api/user-api-call';
import { User } from '../components/api/model';
import { Avatar, Container, Paper, styled, TextField, Typography } from '@mui/material';
import EditProfileButton from '../components/profile/editProfileButton';

// Style the paper component to make it look like a card
const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const ProfilePage: React.FC = () => {
	const {
        user,
        getAccessTokenSilently,
    } = useAuth0();
    const [currentUserData, setCurrentUserData] = useState<User | null>(null);
    const [editing, setEditing] = useState<boolean>(false);

	const handleEditingClick = () => {
		if(editing) {
			setEditing(false)
		} else {
			setEditing(true)
		}
	};

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target
    setCurrentUserData({
      ...currentUserData!, 
      [name]: value,
    })
	};

	useEffect(() => {
        const fetchData = async () => {
            try {
                
                const token = await getAccessTokenSilently();
                const userData = await getUserByExternalId(user!.sub!, token);
                setCurrentUserData(userData);
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchData();

        return () => {

        };
    }, [getAccessTokenSilently, user]);

  return (
    <div>
      <GlobalToolbar />
      <Container component="main" maxWidth="md">
        <ProfilePaper>
          <Avatar
            src={user?.profile}
            alt={currentUserData?.name}
            sx={{ width: 120, height: 120, margin: 'auto' }}
          />
          <Typography variant="h5" gutterBottom>
          {editing ? (
            <TextField
              name="name"
              value={currentUserData?.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          ) : (
            currentUserData?.name
          )}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {editing ? (
            <TextField
              name="email"
              value={currentUserData?.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          ) : (
            currentUserData?.email
          )}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {editing ? (
            <TextField
              name="bio"
              value={currentUserData?.bio}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          ) : (
            currentUserData?.bio
          )}
        </Typography>
          <EditProfileButton editing={editing} handleEditClick={handleEditingClick}/>
        </ProfilePaper>
      </Container>
    </div>
  );
};

export default ProfilePage;