import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import floorImage from './Floor_1.png'; // Adjust the path based on your folder structure

const FloorLayout = () => {
    return (
        <Card sx={{ p: 2, height: '390px', borderRadius: '4px', position: 'relative' }}>
            <CardContent>
                <Typography sx={{ fontSize: "26px", fontWeight: "bold", mt: -2 }} gutterBottom>
                    Floor Layout
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <img
                        src={floorImage}
                        alt="Floor Layout"
                        style={{ width: '100%', maxWidth: '750px', maxHeight: '320px', position: 'relative' }} // Updated width
                    />
                    {/* Square Box */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '32.4%', // Adjust as needed
                            left: '70.4%', // Adjust as needed
                            width: '128px', // Set desired width
                            height: '110px', // Set desired height
                            backgroundColor: 'rgba(255, 0, 0, 0.5)', // Semi-transparent red color
                            transform: 'translate(-50%, -50%)', // Center the box
                            border: '2px solid black', // Optional border
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default FloorLayout;
