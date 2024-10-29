// ServiceProviderList.tsx
import React, { useState } from 'react';
import { Box, Grid, Pagination, Stack } from '@mui/material';
import { Provider } from '../api/model';
import { useAuth0 } from '@auth0/auth0-react';
import ProviderInformation from '../common/ProviderInformation';

interface Props {
	providers: Provider[];
}

const ProviderList: React.FC<Props> = ({ providers }) => {
const [page, setPage] = useState(1);
const itemsPerPage = 10;
const {
    isAuthenticated
} = useAuth0();
const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
	setPage(value);
};

const startIndex = (page - 1) * itemsPerPage;
const displayedProviders = providers.slice(startIndex, startIndex + itemsPerPage);

return (
	<Stack spacing={2} alignItems='center' sx={{mt:2, height:'100%', minWidth:'75vh'}}>
		<Box
			display="flex"
			flexDirection="column"
			overflow="auto"
			
			sx={{
			gap: 2,
			padding: 1,
			height: '80vh',
			}}
		>
		{displayedProviders.map((provider) => (
		<Box key={provider.id}>
			<ProviderInformation provider={provider} showBookbutton={isAuthenticated}/>
		</Box>
		))}
		</Box>

	{/* Lapozás */}
	<center>
	<Pagination
		count={Math.ceil(providers.length / itemsPerPage)}
		page={page}
		onChange={handleChangePage}
		color="primary"
	/>
	</center>
	</Stack>
);
};

export default ProviderList;
