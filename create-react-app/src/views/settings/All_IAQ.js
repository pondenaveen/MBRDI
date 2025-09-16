import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import F1_1 from './F1_1';
import F1_2 from './F1_2';
import api from './../../api.js';

const All_IAQ = () => {
    const [timestamp, setTimestamp] = useState('');

    const fetchTimestampStatus = async () => {
        try {
            const response = await api.get('/integration/device/status');
            setTimestamp(response.data.last_updated_time);
        } catch (error) {
            console.error('Error fetching timestamp and status:', error);
        }
    };

    useEffect(() => {
        fetchTimestampStatus();
        const interval = setInterval(fetchTimestampStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Grid item>
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                        EC1-6th FLOOR - IAQ 1
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '14px' }}>
                        Last updated at: {timestamp ? timestamp : 'Loading...'}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <F1_1 />
                </Grid>
                <Grid item xs={12} md={8}>
                    <F1_2 />
                </Grid>
            </Grid>
        </>
    );
};

export default All_IAQ;
