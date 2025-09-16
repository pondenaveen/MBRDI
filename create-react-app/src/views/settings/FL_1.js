import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import api from './../../api.js';
import floorImage from './Floor-6.png';

const aqiInfo = [
    { status: 'Good', color: 'rgba(0, 128, 0, 0.5)', min: 0, max: 50 },
    { status: 'Moderate', color: 'rgba(165, 244, 8, 0.5)', min: 51, max: 100 },
    { status: 'Unhealthy if Sensitive', color: 'rgba(255, 165, 0, 0.5)', min: 101, max: 150 },
    { status: 'Unhealthy', color: 'rgba(255, 0, 0, 0.5)', min: 151, max: 200 },
    { status: 'Very Unhealthy', color: 'rgba(97, 4, 97, 0.5)', min: 201, max: 300 },
    { status: 'Hazardous', color: 'rgba(60, 5, 60, 0.5)', min: 301, max: 500 },
];

const FloorLayout = () => {
    const [boxColor, setBoxColor] = useState('rgba(255, 0, 0, 0.5)');
    const [aqiValue, setAqiValue] = useState(null);

    const fetchAqi = async () => {
        try {
            const response = await api.get('/integration/iaq');
            const aqi = response.data.AQI;
            setAqiValue(aqi);

            const aqiRange = aqiInfo.find(range => aqi >= range.min && aqi <= range.max);
            if (aqiRange) {
                setBoxColor(aqiRange.color);
            }
        } catch (error) {
            console.error('Error fetching AQI:', error);
        }
    };

    useEffect(() => {
        fetchAqi();
        const intervalId = setInterval(fetchAqi, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Card sx={{ p: 2, height: '280px', borderRadius: '4px', position: 'relative', mt: -2, width: '640px' }}>
            <CardContent>
                <Typography sx={{ fontSize: "18px", fontWeight: "bold", mt: -2 }} gutterBottom>
                    Floor Layout
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <img
                        src={floorImage}
                        alt="Floor Layout"
                        style={{ width: '100%', maxWidth: '750px', maxHeight: '220px', position: 'relative' }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '72%',
                            left: '70.7%',
                            width: '128px',
                            height: '70px',
                            backgroundColor: boxColor,
                            transform: 'translate(-50%, -50%)',
                            border: '2px solid black',
                        }}
                    />
                </Box>
                {aqiValue !== null && (
                    <Typography sx={{ textAlign: 'center', mt: 2 }}>
                        Current AQI: {aqiValue}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default FloorLayout;
