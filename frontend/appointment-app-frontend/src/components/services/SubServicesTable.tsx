import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, IconButton, Pagination, TableContainer, TableHead, Table, Paper, TableCell, TableRow, TableBody, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { EditedSubService, MainService, SubService } from '../api/model';
import { styled } from '@mui/material/styles';

// Styled TableCell
const TableHeadCell = styled(TableCell)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.common.white,
	fontWeight: 'bold',
	fontSize: '16px',
	borderBottom: `2px solid ${theme.palette.divider}`
}));

  // Styled TableRow (for alternating row colors)
const AlternatingTableRow = styled(TableRow)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	'&:nth-of-type(odd)': {
	backgroundColor: theme.palette.action.hover,
	},
	'&:hover': {
	backgroundColor: theme.palette.action.selected,
	}
}));

interface SubServicesTableProps {
	mainService: MainService | null;
	ownPage: boolean;
	token: string;
}

const SubServicesTable: React.FC<SubServicesTableProps> = ({mainService, ownPage, token}) => {
	const [subServices, setSubServices] = useState<SubService[]>(mainService?.subServices ?? []);
	const [editedSubServices, setEditedSubServices] = useState<EditedSubService[]>([]);
	const [page, setPage] = useState<number>(0); // Page state for SubServices table
	const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Number of items per page

	// Handle rows per page change for the SubServices table
	const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0); // Reset to the first page after changing rows per page
	};
	// Handle pagination for the SubServices table
	const handlePageChange = (event: unknown, newPage: number) => {
		setPage(newPage);
	};
	const setSubServiceToEditing = (subService: SubService) => {
		const newEdited: EditedSubService = new EditedSubService(subService.id, subService.name, subService.duration.toString(), subService.price.toString());
		setEditedSubServices([...editedSubServices, newEdited]);
	};
	//editedSubServices.find(s => s.id == 8)
	return (
		<>
			<Typography variant="h5" sx={{ mt: 2 }}>Subservices</Typography>
			<TableContainer component={Paper} sx={{ mt: 2 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableHeadCell>Name</TableHeadCell>
							<TableHeadCell>Duration (minute)</TableHeadCell>
							<TableHeadCell>Price</TableHeadCell>
							{ownPage && (
								<TableHeadCell></TableHeadCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{subServices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subService) => (
							<AlternatingTableRow key={subService.id}>
								<TableCell>{editedSubServices.find(s => s.id === subService.id)?.name ?? subService.name}</TableCell>
								<TableCell>{editedSubServices.find(s => s.id === subService.id)?.duration ?? subService.duration}</TableCell>
								<TableCell>{editedSubServices.find(s => s.id === subService.id)?.price ?? subService.price} $</TableCell>
								{ownPage && (
									<TableCell>
										<IconButton onClick={() => setSubServiceToEditing(subService)}>
											<EditIcon />
										</IconButton>
									</TableCell>
								)}
							</AlternatingTableRow>
						))}
						{(page+1)*rowsPerPage > subServices.length && (
							<AlternatingTableRow key={null}>
								<TableCell>Editable row name</TableCell>
								<TableCell> Editable row duration</TableCell>
								<TableCell>Editable row price $</TableCell>
								{ownPage && (
									<TableCell></TableCell>
								)}
							</AlternatingTableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			
			{/* Pagination for the SubServices table */}
			<TablePagination
				component="div"
				count={subServices.length+1}
				page={page}
				onPageChange={handlePageChange}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleRowsPerPageChange}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</>
	);
};

export default SubServicesTable;
