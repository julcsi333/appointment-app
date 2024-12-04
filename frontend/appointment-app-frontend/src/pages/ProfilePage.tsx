import React, { ChangeEvent, useEffect, useState } from 'react';
import GlobalToolbar from '../components/common/GlobalToolbar';
import { useAuth0 } from '@auth0/auth0-react';
import { getUser, getUserByExternalId, updateUser } from '../components/api/user-api-call';
import { User } from '../components/api/model';
import { Box, Container, Paper, styled, TextField, Typography, Checkbox } from '@mui/material';
import EditProfileButton from '../components/profile/editProfileButton';
import ProfileAvatar from '../components/common/ProfileAvatar';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useParams } from 'react-router-dom';

// Style the paper component to make it look like a card
const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const ProfilePage: React.FC = () => {
	const { id } = useParams<{ id: string | undefined }>();
	const {
        user,
        getAccessTokenSilently,
        isAuthenticated
    } = useAuth0();
    const [currentUserData, setCurrentUserData] = useState<User | null>(null);
    const [editedUserData, setEditedUserData] = useState<User | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");

	const handleEditingClick = () => {
    setEditedUserData({...currentUserData!})
    setErrors({
      name: '',
      email: '',
      phoneNumber: '',
    })
		setEditing(true)
	};

  const handleSaveClick = async () => {
    if(validateFields()) {
      setCurrentUserData(await updateUser(editedUserData!, token))
      setEditing(false)
    }
	};

  const handleCancelClick = () => {
		setEditing(false)
	};

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target
    setEditedUserData({
      ...editedUserData!, 
      [name]: value,
    })
	};

	useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAuthenticated) {
                  const t = await getAccessTokenSilently();
                  const userData = await getUserByExternalId(user!.sub!, t);
                  setLoggedInUser(userData);
                  setToken(t);
                  if (id === undefined || Number(id) === userData.id) {
                    setCurrentUserData(userData);
                    setEditedUserData(userData);
                  } else {
                    const profileUserData = await getUser(id, t)
                    setCurrentUserData(profileUserData);
                    setEditedUserData(profileUserData);
                  }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchData();

        return () => {

        };
    }, [getAccessTokenSilently, id, token, user]);


  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  
  const validateFields = () => {
    let isValid = true;
    let tempErrors = { name: '', email: '', phoneNumber: ''};
    // Name validation (required)
    if (editedUserData!.name === null || editedUserData!.name === undefined || editedUserData!.name.trim() === "") {
      tempErrors.name = 'Name is required';
      isValid = false;
    }
  
    // Phone number validation (required, simple pattern check)
    const phonePattern = /^[\d\s()-]+$/;
    if (editedUserData!.phoneNumber === null || editedUserData!.phoneNumber === undefined || editedUserData!.phoneNumber.trim() === "") {
      tempErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!phonePattern.test(editedUserData!.phoneNumber)) {
      tempErrors.phoneNumber = 'Enter a valid phone number';
      isValid = false;
    }
  
    // Email validation (required, simple email pattern check)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editedUserData!.email === null || editedUserData!.email === undefined || editedUserData!.email.trim() === "") {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailPattern.test(editedUserData!.email)) {
      tempErrors.email = 'Enter a valid email address';
      isValid = false;
    }
  
    setErrors(tempErrors);
    return isValid;
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUserData({
      ...editedUserData!, 
      sendDailyAppointmentNotification: event.target.checked,
    })
  };

  return (
    <div>
      <GlobalToolbar />
      <Container component="main" maxWidth="md">
        <ProfilePaper sx={{mt:2, pt:3}}>
          <center>
            <ProfileAvatar user={currentUserData} ownPage={true} token={token}/>
          </center>
          <Box sx={{minHeight:170, pt:3, display: 'flex', justifyContent: 'space-evenly'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'space-evenly'}}>
              <Typography variant="h5" gutterBottom>Name</Typography>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <EmailIcon sx={{ mr: 1, color: 'gray' }} />
                <Typography>E-mail address</Typography>
              </Box>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <PhoneIcon sx={{ mr: 1, color: 'gray' }} />
                <Typography >Phone number</Typography>
              </Box>

            </Box>
            {editing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'space-evenly'}}>
                    <TextField
                      name="name"
                      value={editedUserData?.name ?? ""}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors.name}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="email"
                      value={editedUserData?.email ?? ""}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="phoneNumber"
                      value={editedUserData?.phoneNumber ?? ""}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber}
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'space-evenly'}}>
                    <Typography variant="h5" gutterBottom>
                      {currentUserData?.name ?? '-'}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {currentUserData?.email ?? "-"}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {currentUserData?.phoneNumber ?? "-"}
                    </Typography>
                  </Box>
                )}
          </Box>
          {editing && (
              <Box sx={{m:2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant='body1'>Would you like to receive e-mail notifications the day before your appointments? </Typography>
                <Checkbox checked={editedUserData?.sendDailyAppointmentNotification ?? true} onChange={handleCheckboxChange} sx={{ml: 2}}/>
              </Box>
          )}
          <Box sx={{mt:2}}>
            {(id === undefined || Number(id) === loggedInUser?.id) && (
              <EditProfileButton editing={editing} handleEditClick={handleEditingClick} handleSaveClick={handleSaveClick} handleCancelClick={handleCancelClick}/>
            )}
          </Box>
        </ProfilePaper>
      </Container>
    </div>
  );
};

export default ProfilePage;