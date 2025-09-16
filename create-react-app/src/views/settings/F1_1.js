import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import GaugeIAQ from './GaugeIAQ';
import api from './../../api.js';

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    height: '550px',
    borderRadius: '4px',
}));

// const SmallCardWrapper = styled(MainCard)(() => ({
//     backgroundColor: 'rgba(226, 226, 226, 0.5)',
//     color: '#000',
//     padding: '16px',
//     height: '250px',
//     display: 'flex',
//     borderRadius: '4px',
//     flexDirection: 'column',
//     justifyContent: 'center',
// }));

const F1_1 = () => {
    const [iaqData, setIaqData] = useState(null);

    const fetchIaqData = async () => {
        try {
            const response = await api.get('/integration/iaq');
            setIaqData(response.data);
        } catch (error) {
            console.error('Error fetching IAQ data:', error);
        }
    };

    useEffect(() => {
        fetchIaqData();
        const intervalId = setInterval(fetchIaqData, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <CardWrapper border={false} content={false}>
            <Box sx={{ p: 2.25, textAlign: 'left', height: '100%' }}>
                <Typography sx={{
                    color: 'black', fontSize: '16px', mb: 1, mt: 10, width: '100%',
                    textAlign: 'center', backgroundColor: 'rgb(180, 254, 180)', py: 1
                }}>
                    AIR QUALITY INDEX
                </Typography>

                <Grid container spacing={2} sx={{ height: '100%' }}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <GaugeIAQ initialValue={iaqData ? iaqData.AQI : 0} pointerColor="red" />
                        </Box>
                    </Grid>

                    {/* <Grid item xs={12}>
                        <SmallCardWrapper border={false} content={false}>
                            <Grid container spacing={1} sx={{ ml: 6 }}>
                                {[
                                    { status: 'Good', color: 'green', value: '0 - 50' },
                                    { status: 'Moderate', color: 'rgb(165, 244, 8)', value: '51 - 100' },
                                    { status: 'Unhealthy if Sensitive', color: 'orange', value: '101 - 150' },
                                    { status: 'Unhealthy', color: 'red', value: '151 - 200' },
                                    { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)', value: '201 - 300' },
                                    { status: 'Hazardous', color: 'rgb(60, 5, 60)', value: '301 - 500' },
                                ].map((item, index) => (
                                    <Grid item container alignItems="center" key={index}>
                                        <Grid item xs={1}>
                                            <span style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                backgroundColor: item.color,
                                                display: 'inline-block',
                                                marginRight: 8
                                            }}></span>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Typography variant="body2">{item.status}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">{item.value}</Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        </SmallCardWrapper>
                    </Grid> */}
                </Grid>
            </Box>
        </CardWrapper>
    );
};

export default F1_1;
