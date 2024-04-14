import React, { useState } from "react";
import {AppBar, Toolbar, Button, IconButton, Menu, MenuItem} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';
import { useAuth0 } from "@auth0/auth0-react";

const ToolbarLeft = styled('div')({
  flexGrow: 1,
});

const ProfileIcon = styled(IconButton)({
  marginRight: '10px',
  cursor: 'pointer',
});

export const GlobalToolbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    user,
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
  };

  const handleProvidersClick = () => {
    // Add logic to handle login button click
    console.log('Login clicked');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ToolbarLeft>
          <Button color="inherit" onClick={handleProvidersClick}>Providers</Button>
          <Button color="inherit" onClick={handleProvidersClick}>Services</Button>
        </ToolbarLeft>
        <div>
          {!isAuthenticated && (
            <Button id="qsLoginBtn" color="inherit" onClick={() => loginWithRedirect()}>Log in</Button>
          )}
          {isAuthenticated && (
            <div>
                <IconButton
                edge="end"
                color="inherit"
                aria-label="profile"
                aria-haspopup="true"
                aria-controls="profile-menu"
                onClick={handleMenuOpen}>
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                  <MenuItem onClick={() => logoutWithRedirect()}>Logout</MenuItem>
                </Menu>
              </div>
            )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default GlobalToolbar;