import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';

const ToolbarLeft = styled('div')({
  flexGrow: 1,
});

const ProfileIcon = styled(IconButton)({
  marginRight: '10px',
  cursor: 'pointer',
});

export const ToolbarComponent: React.FC = () => {
  const handleProfileClick = () => {
    // Add logic to handle profile icon click
    console.log('Profile clicked');
  };

  const handleLoginClick = () => {
    // Add logic to handle login button click
    console.log('Login clicked');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ToolbarLeft>
          <Button color="inherit" onClick={handleLoginClick}>Providers</Button>
          <Button color="inherit" onClick={handleLoginClick}>Services</Button>
        </ToolbarLeft>
        <div>
          <ProfileIcon
            edge="end"
            aria-label="profile"
            color="inherit"
            onClick={handleProfileClick}
          >
            <AccountCircleIcon />
          </ProfileIcon>
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default ToolbarComponent;