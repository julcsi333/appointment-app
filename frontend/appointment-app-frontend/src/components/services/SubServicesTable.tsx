import React, { useEffect, useState } from 'react';
import { Typography, IconButton, TableContainer, TableHead, Table, Paper, TableCell, TableRow, TableBody, TablePagination, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditedSubService, MainService, SubService } from '../api/model';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import { createSubService, getSubServicesByMainServiceId, updateSubService, deleteSubService } from '../api/services-api-call';

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
	const [editedSubServices, setEditedSubServices] = useState<Map<number,EditedSubService>>(new Map());
	const [newEditedSubService, setNewEditedSubService] = useState<EditedSubService>(new EditedSubService(null, "", "", ""));
	const [page, setPage] = useState<number>(0); // Page state for SubServices table
	const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Number of items per page
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (mainService !== null) {
					const fetchedSubServices = await getSubServicesByMainServiceId(mainService!.id);
					setSubServices(fetchedSubServices);
					setEditedSubServices(new Map())
					setNewEditedSubService(new EditedSubService(null, "", "", ""))
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
		setEditedSubServices(new Map(editedSubServices).set(newEdited.id!, newEdited));
	};
	const saveSubService = async (id: number | null) => {
		let editedSubService: EditedSubService | undefined = newEditedSubService
		if (id !== null) {
			editedSubService = editedSubServices.get(id)
		}
		if (editedSubService === undefined || editedSubService === null) {
			console.error(`Edited sub service with id #${id} not found`)
			throw new Error(`Edited sub service with id #${id} not found`)
		}
		editedSubService.validate()
		if (!editedSubService.isValid) {
			if (id !== null) {
				setEditedSubServices(new Map(editedSubServices).set(id, editedSubService))
			} else {
				console.log(editedSubService)
				setNewEditedSubService(
					new EditedSubService(null, editedSubService.name, editedSubService.duration, editedSubService.price, false, editedSubService.errors)
				)
			}
			return;
		}
		if (id === null) {
			await createSubService(
				{id: null, name: editedSubService.name, price: parseFloat(editedSubService.price), duration: parseInt(editedSubService.duration)}, 
				mainService!.id, 
				token
			)
			setNewEditedSubService(new EditedSubService(null, "", "", ""))
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

	const handleNameChange = (id: number | null, value: string) => {
		if (id == null) {
			setNewEditedSubService(new EditedSubService(null, value, newEditedSubService.duration, newEditedSubService.price))
		} else {
			const prevEditedSubService = editedSubServices.get(id)
			const newEdited = new EditedSubService(id, value, prevEditedSubService!.duration, prevEditedSubService!.price)
			setEditedSubServices(new Map(editedSubServices).set(id,newEdited));
		}
	};

	const handleDurationChange = (id: number | null, value: string) => {
		if (id == null) {
			setNewEditedSubService(new EditedSubService(null, newEditedSubService.name, value, newEditedSubService.price))
		} else {
			const prevEditedSubService = editedSubServices.get(id)
			const newEdited = new EditedSubService(id, prevEditedSubService!.name, value, prevEditedSubService!.price)
			setEditedSubServices(new Map(editedSubServices).set(id,newEdited));
		}
	};
	
	const handlePriceChange = (id: number | null, value: string) => {
		if (id == null) {
			setNewEditedSubService(new EditedSubService(null, newEditedSubService.name, newEditedSubService.duration, value))
		} else {
			const prevEditedSubService = editedSubServices.get(id)
			const newEdited = new EditedSubService(id, prevEditedSubService!.price, prevEditedSubService!.duration, value)
			setEditedSubServices(new Map(editedSubServices).set(id,newEdited));
		}
	};

	const handleDeleteSubService = async (id: number) => {
		await deleteSubService(id, token)
		const fetchedSubServices = await getSubServicesByMainServiceId(mainService!.id);
		setSubServices(fetchedSubServices);
	}

	return (
		<>
			<Typography variant="h5" sx={{ mt: 2 }}>Subservices</Typography>
			<TableContainer component={Paper} sx={{ mt: 2 }}>
				<Table>
					<TableHead>
						<TableRow key="header">
							<TableHeadCell key="header.name">Name</TableHeadCell>
							<TableHeadCell key="header.duration">Duration (minute)</TableHeadCell>
							<TableHeadCell key="header.price">Price</TableHeadCell>
							{ownPage && (
								<TableHeadCell key="header.operations"></TableHeadCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{subServices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subService) => (
							<>
							{editedSubServices.get(subService.id) === undefined ? (
								<AlternatingTableRow key={subService.id}>
									<TableCell key={`${subService.id}.name`}>{subService.name}</TableCell>
									<TableCell key={`${subService.id}.duration`}>{subService.duration}</TableCell>
									<TableCell key={`${subService.id}.price`}>{subService.price} $</TableCell>
									{ownPage && (
										<TableCell sx={{display: 'flex'}} key={`${subService.id}.operations`}>
											<IconButton onClick={() => setSubServiceToEditing(subService)}>
												<EditIcon />
											</IconButton>
											<IconButton onClick={() => handleDeleteSubService(subService.id)}>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									)}
								</AlternatingTableRow>
							) : (
								<AlternatingTableRow key={subService.id}>
									<TableCell key={`${subService.id}.name`}>
										<TextField
										fullWidth
										label="Name"
										name={`name`}
										value={editedSubServices.get(subService.id)!.name}
										onChange={(event) => handleNameChange(subService.id, event.target.value)}
										error={!!editedSubServices.get(subService.id)!.errors.name}
										helperText={editedSubServices.get(subService.id)!.errors.name}
										sx={{ mb: 2 }}
										/>
									</TableCell>
									<TableCell key={`${subService.id}.duration`}>
										<TextField
										fullWidth
										label="Duration"
										name={`duration`}
										value={editedSubServices.get(subService.id)!.duration}
										onChange={(event) => handleDurationChange(subService.id, event.target.value)}
										error={!!editedSubServices.get(subService.id)!.errors.duration}
										helperText={editedSubServices.get(subService.id)!.errors.duration}
										sx={{ mb: 2 }}
										/>
									</TableCell>
									<TableCell key={`${subService.id}.price`}>
										<TextField
										fullWidth
										label="Price"
										name={`price`}
										value={editedSubServices.get(subService.id)!.price}
										onChange={(event) => handlePriceChange(subService.id, event.target.value)}
										error={!!editedSubServices.get(subService.id)!.errors.price}
										helperText={editedSubServices.get(subService.id)!.errors.price}
										sx={{ mb: 2 }}
										/>
									</TableCell>
									{ownPage && (
										<TableCell key={`${subService.id}.operations`}>
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
							<AlternatingTableRow key={newEditedSubService.id}>
								<TableCell>
									<TextField
									fullWidth
									label="Name"
									name={`name`}
									value={newEditedSubService.name}
									onChange={(event) => handleNameChange(null, event.target.value)}
									error={!!newEditedSubService.errors.name}
									helperText={newEditedSubService.errors.name}
									sx={{ margin: 0 }}
									/>
								</TableCell>
								<TableCell>
									<TextField
									fullWidth
									label="Duration"
									name={`duration`}
									value={newEditedSubService.duration}
									onChange={(event) => handleDurationChange(null, event.target.value)}
									error={!!newEditedSubService.errors.duration}
									helperText={newEditedSubService.errors.duration}
									/>
								</TableCell>
								<TableCell>
									<TextField
									fullWidth
									label="Price"
									name={`price`}
									value={newEditedSubService.price}
									onChange={(event) => handlePriceChange(null, event.target.value)}
									error={!!newEditedSubService.errors.price}
									helperText={newEditedSubService.errors.price}
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
