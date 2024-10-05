import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, IconButton, Pagination, TableContainer, TableHead, Table, Paper, TableCell, TableRow, TableBody, TablePagination, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { EditedSubService, MainService, SubService } from '../api/model';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import { createSubService, getSubServicesByMainServiceId, updateSubService } from '../api/services-api-call';

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
	const [subServices, setSubServices] = useState<SubService[]>([]);
	const [editedSubServices, setEditedSubServices] = useState<Map<number|null,EditedSubService>>(new Map().set(null, new EditedSubService(null, "", "", "")));
	const [page, setPage] = useState<number>(0); // Page state for SubServices table
	const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Number of items per page
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (mainService !== null) {
					const fetchedSubServices = await getSubServicesByMainServiceId(mainService!.id);
					setSubServices(fetchedSubServices);
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		
		fetchData();
		return () => {};
	}, [mainService]);
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
		setEditedSubServices(new Map(editedSubServices).set(newEdited.id, newEdited));
	};
	const saveSubService = async (id: number | null) => {
		const editedSubService = editedSubServices.get(id)
		if (editedSubService === undefined || editedSubService === null) {
			console.error(`Edited sub service with id #${id} not found`)
			throw new Error(`Edited sub service with id #${id} not found`)
		}
		editedSubService.validate()
		if (!editedSubService.isValid) {
			return;
		}
		if (id === null) {
			await createSubService(
				{id: null, name: editedSubService.name, price: parseFloat(editedSubService.price), duration: parseInt(editedSubService.duration)}, 
				mainService!.id, 
				token
			)
			setEditedSubServices(new Map(editedSubServices).set(null, new EditedSubService(null, "", "", "")))
		} else {
			await updateSubService(
				{id: id, name: editedSubService.name, price: parseFloat(editedSubService.price), duration: parseInt(editedSubService.duration)}, 
				token
			)
			editedSubServices.delete(id)
			setEditedSubServices(new Map(editedSubServices))
		}
		const fetchedSubServices = await getSubServicesByMainServiceId(mainService!.id);
		setSubServices(fetchedSubServices);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		const idAndName = name.split(".")
		const id = parseInt(idAndName[0])
		const fieldName = idAndName[1]
		const prevEditedSubService = editedSubServices.get(id)
		if (fieldName === "name") {
			const newEditedSubService = new EditedSubService(id, value, prevEditedSubService!.duration, prevEditedSubService!.price)
			setEditedSubServices(new Map(editedSubServices).set(id,newEditedSubService));
		} else if (fieldName === "duration") {
			const newEditedSubService = new EditedSubService(id, prevEditedSubService!.name, value, prevEditedSubService!.price)
			setEditedSubServices(new Map(editedSubServices).set(id,newEditedSubService));
		} else if (fieldName === "price") {
			const newEditedSubService = new EditedSubService(id, prevEditedSubService!.name, prevEditedSubService!.duration, value)
			setEditedSubServices(new Map(editedSubServices).set(id,newEditedSubService));
		}
	};
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
							<>
							{editedSubServices.get(subService.id) === undefined ? (
								<AlternatingTableRow key={subService.id}>
									<TableCell>{subService.name}</TableCell>
									<TableCell>{subService.duration}</TableCell>
									<TableCell>{subService.price} $</TableCell>
									{ownPage && (
										<TableCell>
											<IconButton onClick={() => setSubServiceToEditing(subService)}>
												<EditIcon />
											</IconButton>
										</TableCell>
									)}
								</AlternatingTableRow>
							) : (
								<AlternatingTableRow key={subService.id}>
									<TableCell>
										<TextField
										fullWidth
										label="Name"
										name={`${subService.id}.name`}
										value={editedSubServices.get(subService.id)!.name}
										onChange={handleInputChange}
										error={!!editedSubServices.get(subService.id)!.name}
										helperText={editedSubServices.get(subService.id)!.errors.name}
										sx={{ mb: 2 }}
										/>
									</TableCell>
									<TableCell>
										<TextField
										fullWidth
										label="Duration"
										name={`${subService.id}.duration`}
										value={editedSubServices.get(subService.id)!.duration}
										onChange={handleInputChange}
										error={!!editedSubServices.get(subService.id)!.duration}
										helperText={editedSubServices.get(subService.id)!.errors.duration}
										sx={{ mb: 2 }}
										/>
									</TableCell>
									<TableCell>
										<TextField
										fullWidth
										label="Price"
										name={`${subService.id}.price`}
										value={editedSubServices.get(subService.id)!.price}
										onChange={handleInputChange}
										error={!!editedSubServices.get(subService.id)!.price}
										helperText={editedSubServices.get(subService.id)!.errors.price}
										sx={{ mb: 2 }}
										/> $
									</TableCell>
									{ownPage && (
										<TableCell>
											<IconButton onClick={() => saveSubService(subService.id)}>
												<SaveIcon />
											</IconButton>
										</TableCell>
									)}
								</AlternatingTableRow>
							)}
							</>
							
						))}
						{(page+1)*rowsPerPage > subServices.length && ownPage && (
							<AlternatingTableRow key={null}>
								<TableCell>
									<TextField
									fullWidth
									label="Name"
									name={`${null}.name`}
									value={editedSubServices.get(null)!.name}
									onChange={handleInputChange}
									error={!!editedSubServices.get(null)!.name}
									helperText={editedSubServices.get(null)!.errors.name}
									sx={{ margin: 0 }}
									/>
								</TableCell>
								<TableCell>
									<TextField
									fullWidth
									label="Duration"
									name={`${null}.duration`}
									value={editedSubServices.get(null)!.duration}
									onChange={handleInputChange}
									error={!!editedSubServices.get(null)!.duration}
									helperText={editedSubServices.get(null)!.errors.duration}
									/>
								</TableCell>
								<TableCell>
									<TextField
									fullWidth
									label="Price"
									name={`${null}.price`}
									value={editedSubServices.get(null)!.price}
									onChange={handleInputChange}
									error={!!editedSubServices.get(null)!.price}
									helperText={editedSubServices.get(null)!.errors.price}
									/>
								</TableCell>
								<TableCell>
									<IconButton onClick={() => saveSubService(null)}>
										<SaveIcon />
									</IconButton>
								</TableCell>
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
