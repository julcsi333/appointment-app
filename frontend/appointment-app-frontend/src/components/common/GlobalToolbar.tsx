import React, { useEffect, useState } from "react";
import {AppBar, Toolbar, Button, IconButton, Menu, MenuItem} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { getUserByExternalId } from "./api/user-api-call";
import { User } from "./api/model";

const ToolbarLeft = styled('div')({
  flexGrow: 1,
});

export const GlobalToolbar: React.FC = () => {
	const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    user,
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();
	const [currentUserData, setCurrentUserData] = useState<User | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          const userData = await getUserByExternalId(user!.sub!, token);
          setCurrentUserData(userData);
        }

			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();

		return () => {

		};
	}, [getAccessTokenSilently, isAuthenticated, user]);
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

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    navigate(`/profile`);
  };
  const handleAppointmentsClick = (event: React.MouseEvent<HTMLElement>) => {
    navigate(`/appointments`);
  };

  const handleBookClick = () => {
    navigate(`/`);
  };

  const handleMyServicesClick = () => {
    if (currentUserData != null) {
      navigate(`/services/providers/`+currentUserData.id);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ToolbarLeft>
          <Button color="inherit" onClick={handleBookClick}>Book</Button>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleMyServicesClick}>My services</Button>
          )}
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
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleAppointmentsClick}>Appointments</MenuItem>
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