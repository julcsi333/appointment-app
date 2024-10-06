import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Pagination} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MainService } from '../api/model';
import { getPortfolioPictureAmount, getPortfolioPictureNames, uploadPortfolioPicture } from '../api/services-api-call';
import { getBaseUrl } from '../../config';
import PictureUploadDialog from '../PictureUploadDialog';
import { AddBox } from '@mui/icons-material';

interface PortfolioProps {
	mainService: MainService | null;
	ownPage: boolean;
	token: string;
}

const Portfolio: React.FC<PortfolioProps> = ({mainService, ownPage, token}) => {
	const [open, setOpen] = useState(false); // Dialog is open or not
	const [portfolioPage, setPortfolioPage] = useState<number>(1); // Pagination state for Portfolio
	const [portfolioPictureNames, setPortfolioPictureNames] = useState<string[]>([]); // Portfolio images
	const [portfolioPictureAmount, setPortfolioPictureAmount] = useState<number>(0); // How many pictures are there

	const portfolioItemsPerPage = 6;
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (mainService !== null) {
					setPortfolioPictureAmount(await getPortfolioPictureAmount(mainService.id))
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();
		return () => {};
	}, [mainService]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (mainService !== null) {
					let images: Array<string> = []
					if (portfolioPage === 1 && ownPage) {
						// We need one less image, because the first image is always the placeholder
						images = await getPortfolioPictureNames(mainService.id, 0, portfolioItemsPerPage-1)
					} else {
						images = await getPortfolioPictureNames(mainService.id, (portfolioPage-1)*portfolioItemsPerPage-1, portfolioItemsPerPage)
					}
					setPortfolioPictureNames(images)
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		
		fetchData();
		return () => {};
	}, [mainService, ownPage, portfolioPage, portfolioPictureAmount]);

	// Handle pagination for portfolio images
	const handlePortfolioPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPortfolioPage(value);
	};

    // Open dialog when add image is clicked
    const handleClickOpen = () => {
        if (ownPage) {
            setOpen(true);
        }
    };

    // Close dialog
    const closeDialog = () => {
        setOpen(false);
    };

    // Handle file upload
    const uploadFile = async (file: File) => {
        await uploadPortfolioPicture(mainService!.id, file, token);
        setOpen(false);
        setPortfolioPictureAmount(portfolioPictureAmount+1);
    };
    
    /*const getFillerGrids = () => {

        if ((portfolioPage-1)*portfolioItemsPerPage > portfolioPictureAmount)
        for (let i = 0; i < )
        return (
            <Grid item xs={4} key={image}>
            </Grid>
        )
    }*/
	return (
		<>
        <Box 
            sx={{
            height: 700,  // Adjust this to fit 2 rows + padding for typography/pagination
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',  // Center typography and pagination horizontally
            justifyContent: 'space-between',  // Space out the grid, typography, and pagination
            p: 2,  // Add padding inside the box for spacing
            }}
        >
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>Portfolio</Typography>
            <Grid container spacing={2}>
                {/* The "+" Icon for Adding a New Image */}
                {portfolioPage === 1 && (
                    <Grid item xs={4}>
                        <Box 
                            sx={{ 
                                height: 250, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                border: '2px dashed gray', 
                                cursor: 'pointer',
                                borderRadius: '16px' 
                            }}
                            onClick={handleClickOpen}
                        >
                            <AddIcon fontSize="large" />
                        </Box>
                    </Grid>
                )}

                {/* Display Portfolio Images */}
                {portfolioPictureNames.map((image, index) => (
                    <Grid item xs={4} key={image}>
                        <Box
                            component="img"
                            src={`${getBaseUrl()}/services/${mainService?.id}/portfolio-pictures/${image}`}
                            sx={{ width: '100%', height: 250, objectFit: 'contain', border: '2px solid gray', borderRadius: '16px' }}
                            
                        />
                    </Grid>
                ))}

                {portfolioPage === 2 && (
                    <>
                        <Grid item xs={4} key={"asd"}>
                            <Box
                                sx={{ width: '100%', height: 250, objectFit: 'contain', border: '2px solid gray', borderRadius: '16px' }}
                            />
                        </Grid>
                        <Grid item xs={4} key={"asdasd"}>
                            <Box
                                sx={{ width: '100%', height: 250, objectFit: 'contain', border: '2px solid gray', borderRadius: '16px' }}
                            />
                        </Grid>
                        <Grid item xs={4} key={"asdasdasd"}>
                            <Box
                                sx={{ width: '100%', height: 250, objectFit: 'contain', border: '2px solid gray', borderRadius: '16px' }}
                            />
                        </Grid>
                        <Grid item xs={4} key={"asdasdasdasd"}>
                            <Box
                                sx={{ width: '100%', height: 250, objectFit: 'contain', border: '2px solid gray', borderRadius: '16px' }}
                            />
                        </Grid>
                        <Grid item xs={4} key={"asdasdasdasdads"}>
                            <Box
                                sx={{ width: '100%', height: 250, objectFit: 'contain', border: '2px solid gray', borderRadius: '16px' }}
                            />
                        </Grid>
                    </>
                )}

            </Grid>
            {/* Pagination for Portfolio */}
            <Pagination 
                count={Math.ceil((portfolioPictureAmount+1) / portfolioItemsPerPage)} 
                page={portfolioPage} 
                onChange={handlePortfolioPageChange} 
                color="primary" 
                sx={{ mt: 2 }} 
            />

            </Box>
            <PictureUploadDialog open={open} avatarPreview={false} title={'Upload New Portfolio Picture'} closeDialog={closeDialog} uploadFile={uploadFile} />
        </>
	);
};

export default Portfolio;
