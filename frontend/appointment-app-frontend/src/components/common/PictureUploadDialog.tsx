import React, { useState } from 'react';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface PictureUploadDialogProps {
	open: boolean;
    avatarPreview: boolean;
    title: string;
    closeDialog: () => void;
    uploadFile: (file: File) => void;
}

const PictureUploadDialog: React.FC<PictureUploadDialogProps> = ({ open, avatarPreview, title, closeDialog, uploadFile}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Close dialog
    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        closeDialog()
    };

    // Handle file upload
    const handleUpload = async () => {
        if (selectedFile) {
            uploadFile(selectedFile)
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Create preview URL for the selected image
        }
    };

	return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-file"
                    type="file"
                    onChange={handleFileChange} // Handle file input change
                />

                <center>
                    {previewUrl && (
                        <>
                            {avatarPreview ? (
                                <Avatar
                                alt="Selected Picture"
                                src={previewUrl} // Display preview of selected image
                                sx={{ width: 150, height: 150, mt: 2 }}
                                />
                            ) : (
                                <Box
                                    alt="Selected Picture"
                                    component="img"
                                    src={previewUrl}
                                    sx={{ width: '100%', height: 200, objectFit: 'contain' }}
                                />
                            )}
                        </>
                    )}
                    <label htmlFor="upload-file">
                        <Button 
                            color="primary" 
                            aria-label="upload picture"
                            component="span"
                            startIcon={<PhotoCamera />}
                        >

                            Select
                            
                        </Button>
                    </label>
                </center>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleUpload} color="primary" variant="contained">
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
	);
};

export default PictureUploadDialog;
