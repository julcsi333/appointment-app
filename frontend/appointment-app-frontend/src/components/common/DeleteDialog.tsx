import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DeleteDialogProps {
	deleteDialogOpen: boolean;
	dialogDescription: string;
	confirmDelete: () => void;
	cancelDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({deleteDialogOpen, dialogDescription, confirmDelete, cancelDelete}) => {

	return (
		<Dialog
		open={deleteDialogOpen}
		onClose={cancelDelete}
		>
		<DialogTitle>Delete Service</DialogTitle>
		<DialogContent>
			<DialogContentText>
				{dialogDescription}
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={cancelDelete} color="secondary">
			Cancel
			</Button>
			<Button onClick={confirmDelete} color="primary">
			Delete
			</Button>
		</DialogActions>
		</Dialog>
	);
};

export default DeleteDialog;