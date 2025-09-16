import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MainCard from 'ui-component/cards/MainCard';
import GaugeComponent from './Gauge';

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    padding: '20px',
    height: '420px',
    borderRadius: '4px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
}));

const SmallCardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'transparent',
    border: '1px solid gray',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    padding: '20px',
    height: '300px',
}));

const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ tooltip: className }} />
))({
    backgroundColor: 'rgb(230, 230, 230)',
    color: 'black',
    fontSize: '0.875rem',
});

const First = () => {
    const totalIn = 50;
    const totalOut = 30;

    const aqiInfo = [
        { status: 'Good', color: 'green', value: '0 - 50' },
        { status: 'Moderate', color: 'rgb(165, 244, 8)', value: '51 - 100' },
        { status: 'Unhealthy if Sensitive', color: 'orange', value: '101 - 150' },
        { status: 'Unhealthy', color: 'red', value: '151 - 200' },
        { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)', value: '201 - 300' },
        { status: 'Hazardous', color: 'rgb(60, 5, 60)', value: '301 - 500' },
    ];

    const renderAQITooltip = () => (
        <Grid container spacing={1}>
            {aqiInfo.map((item, index) => (
                <Grid item container alignItems="center" key={index}>
                    <Grid item xs={2}>
                        <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            display: 'inline-block',
                            marginRight: 8,
                            marginLeft: 20,
                        }}></span>
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


    return (
        <CardWrapper border={false} content={false}>
            <Typography
                style={{
                    color: 'black',
                    fontSize: '18px',
                    fontWeight: '400',
                    padding: '6px',
                    backgroundColor: 'rgb(180, 254, 180)',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                Floor wise Air Quality Index
            </Typography>
            <Box sx={{ p: 2.25 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <SmallCardWrapper
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <Typography
                                style={{
                                    color: 'gray',
                                    marginBottom: '10px',
                                    fontSize: '25px',
                                    fontWeight: '400',
                                    marginLeft: '-40px'
                                }}
                            >
                                First Floor
                            </Typography>
                            <GaugeComponent pointerColor="black" initialValue={totalIn} />
                            <CustomTooltip title={renderAQITooltip()} arrow>
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                    }}
                                >
                                    <InfoIcon fontSize="inherit" />
                                </IconButton>
                            </CustomTooltip>
                        </SmallCardWrapper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SmallCardWrapper
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <Typography
                                style={{
                                    color: 'gray',
                                    marginBottom: '10px',
                                    fontSize: '25px',
                                    fontWeight: '400',
                                     marginLeft: '-40px'
                                }}
                            >
                                Second Floor
                            </Typography>
                            <GaugeComponent pointerColor="black" initialValue={totalOut} />
                            <CustomTooltip title={renderAQITooltip()} arrow>
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                    }}
                                >
                                    <InfoIcon fontSize="inherit" />
                                </IconButton>
                            </CustomTooltip>
                        </SmallCardWrapper>
                    </Grid>
                </Grid>
            </Box>
        </CardWrapper>
    );
};

First.propTypes = {
    isLoading: PropTypes.bool,
};

export default First;
