import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import GlobalToolbar from '../components/common/GlobalToolbar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Provider, User } from '../components/api/model';
import BusinessInformation from '../components/services/BusinessInformation';
import ServicesInformation from '../components/services/ServicesInformation';
import { getUser, getUserByExternalId } from '../components/api/user-api-call';
import { createProvider, getProvider, updateProvider } from '../components/api/provider-api-call';
import { ErrorType } from '../components/error/model';
import NotServiceProvider from '../components/services/NotServiceProvider';


const ServicesPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
    const [provider, setProvider] = useState<Provider | null>(null);
    const [providerExists, setProviderExists] = useState<boolean>(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>("");
    const [ownPage, setOwnPage] = useState<boolean>(false);
    const [creatingBusinessProfile, setCreatingBusinessProfile] = useState<boolean>(false);
    const [editingBProfile, setEditingBProfile] = useState<boolean>(false);
    const {
        user,
		isAuthenticated,
        getAccessTokenSilently
    } = useAuth0();

	const saveProfile = async (provider: Provider) => {
		if (creatingBusinessProfile) {
			console.log(provider)
			setProvider(await createProvider(provider, token));
			setProviderExists(true)
			setCreatingBusinessProfile(false);
		} else {
			console.log(provider)
			setProvider(await updateProvider(provider, token))
			setCurrentUser(await getUser(currentUser!.id.toString(), token!))
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const currentProvider = await getProvider(id!);
				var isOwnPage = false;
				console.log("Queried current provider: ")
				setProviderExists(currentProvider !== null)
				console.log(currentProvider)
				setProvider(currentProvider);
				if (isAuthenticated) {
					const token = await getAccessTokenSilently();
					setToken(token)
					const userData = await getUserByExternalId(user!.sub!, token);
					if (currentProvider === null) {
						setProvider({...userData, bio: "", businessAddress: "", sendDailyAppointmentReport: true})
					}
					setCurrentUser(userData)
					if (userData.id.toString() === id) {
						setOwnPage(true)
						isOwnPage = true
					}
				}
				if (currentProvider === null) {
					if (!isOwnPage) {
						navigate(`/error`, {
							state: {
								errorType: ErrorType.PROVIDER_NOT_FOUND,
								providerId: id
							}
						});
					}
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		fetchData();
		return () => {

		};
	}, [getAccessTokenSilently, id, isAuthenticated, navigate, user, setProvider]);

	const handleEditingBProfiler = (editing: boolean) => {
		setEditingBProfile(editing);
	}

	return (
		<div>
			<GlobalToolbar />
			{ownPage && !providerExists && !creatingBusinessProfile && isAuthenticated ? (
				<NotServiceProvider creatingBProfileCallback={setCreatingBusinessProfile} />
			) : (
				<Box sx={{ p: 2 }}>
					<BusinessInformation provider={provider} editingBProfile={editingBProfile} setEditingBProfile={handleEditingBProfiler} ownPage={ownPage} creatingProfile={creatingBusinessProfile} saveProfile={saveProfile} user={currentUser} token={token}/>
					<ServicesInformation provider={provider!} providerExists={providerExists} editingBProfile={editingBProfile} ownPage={ownPage} creatingProfile={creatingBusinessProfile} token={token}/>
				</Box>
			)}


		</div>
	);
};

export default ServicesPage;