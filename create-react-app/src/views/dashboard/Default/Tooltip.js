import React from 'react';

import { styled } from '@mui/material/styles';
import { Grid, Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// AQI information array
const aqiInfo = [
    { status: 'Good', color: 'green', value: '0 - 50' },
    { status: 'Moderate', color: 'rgb(165, 244, 8)', value: '51 - 100' },
    { status: 'Unhealthy if Sensitive', color: 'orange', value: '101 - 150' },
    { status: 'Unhealthy', color: 'red', value: '151 - 200' },
    { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)', value: '201 - 300' },
    { status: 'Hazardous', color: 'rgb(60, 5, 60)', value: '301 - 500' },
];

// Custom styled Tooltip component
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ tooltip: className }} />
))({
    backgroundColor: 'rgb(230, 230, 230)',
    color: 'black',
    fontSize: '0.875rem',
});

// TooltipComponent that uses the aqiInfo array
const TooltipComponent = () => {
    // Function to render the tooltip content
    const renderAQITooltip = () => (
        <Grid container spacing={1}>
            {aqiInfo.map((item, index) => (
                <Grid item container alignItems="center" key={index}>
                    <Grid item xs={2}>
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: item.color,
                                display: 'inline-block',
                                marginRight: 8,
                                marginLeft: 10,
                            }}
                        ></span>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">{item.status}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2">{item.value}</Typography>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );

    // Render the tooltip with the info icon
    return (
        <CustomTooltip title={renderAQITooltip()} arrow>
            <IconButton size="small">
                <InfoIcon fontSize="inherit" />
            </IconButton>
        </CustomTooltip>
    );
};

// Export the component
export default TooltipComponent;
