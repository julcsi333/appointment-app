import React, { ChangeEvent, useEffect, useState } from 'react';
import GlobalToolbar from '../components/common/GlobalToolbar';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserByExternalId, updateUser } from '../components/api/user-api-call';
import { User } from '../components/api/model';
import { Avatar, Box, Container, Paper, styled, TextField, Typography } from '@mui/material';
import EditProfileButton from '../components/profile/editProfileButton';
import ProfileAvatar from '../components/common/ProfileAvatar';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

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
    const [editedUserData, setEditedUserData] = useState<User | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");

	const handleEditingClick = () => {
    setEditedUserData({...currentUserData!})
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
                
                const token = await getAccessTokenSilently();
                const userData = await getUserByExternalId(user!.sub!, token);
                setToken(token);
                setCurrentUserData(userData);
                setEditedUserData(userData);
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchData();

        return () => {

        };
    }, [getAccessTokenSilently, user]);


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
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'space-evenly'}}>
                {editing ? (
                  <TextField
                    name="name"
                    value={currentUserData?.name ?? ""}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    margin="normal"
                  />
                ) : (
                  
                  <Typography variant="h5" gutterBottom>
                    {currentUserData?.name ?? '-'}
                  </Typography>
                )}
              
              {editing ? (
                <TextField
                  name="email"
                  value={currentUserData?.email ?? ""}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  margin="normal"
                />
              ) : (
                <Typography variant="body1" color="textSecondary">
                  {currentUserData?.email ?? "-"}
                </Typography>
              )}
              {editing ? (
                <TextField
                  name="phoneNumber"
                  value={currentUserData?.phoneNumber ?? ""}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  fullWidth
                  margin="normal"
                />
              ) : (
                <Typography variant="body1" color="textSecondary">
                  {currentUserData?.phoneNumber ?? "-"}
                </Typography>
              )}
              
            </Box>
          </Box>
          <Box sx={{mt:2}}>
            <EditProfileButton editing={editing} handleEditClick={handleEditingClick} handleSaveClick={handleSaveClick} handleCancelClick={handleCancelClick}/>
          </Box>
        </ProfilePaper>
      </Container>
    </div>
  );
};

export default ProfilePage;