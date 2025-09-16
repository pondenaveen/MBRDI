import React, { useState, useEffect } from 'react';
import { Box, Typography,  IconButton, Grid, Popover } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from './../../api.js';

const TVOC = () => {
    const [tvocValue, setTvocValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/integration/iaq');
                setTvocValue(response.data.TVOC);
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);
    }, []);


    const getStatus = () => {
        if (tvocValue <= 0) return { status: 'Good', color: 'green' };
        if (tvocValue <= 220) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
        if (tvocValue <= 660) return { status: 'Unhealthy if Sensitive', color: 'orange' };
        if (tvocValue <= 2200) return { status: 'Unhealthy', color: 'red' };
        if (tvocValue <= 3300) return { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)' };
        return { status: 'Hazardous', color: 'rgb(60, 5, 60)' };
    };


    const {  color } = getStatus();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box sx={{
            position: 'relative',
            backgroundColor: 'white',
            height: '120px',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px'
        }}>
            <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleClick}>
                <InfoOutlinedIcon />
            </IconButton>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Grid container direction="column" spacing={1}>
                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'green', display: 'inline-block', marginRight: 8 }}></span>
                                    Good
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                                    0 ppb
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgb(165, 244, 8)', display: 'inline-block', marginRight: 8 }}></span>
                                    Moderate
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                                    220 ppb
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'orange', display: 'inline-block', marginRight: 8 }}></span>
                                    Unhealthy if Sensitive
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    660 ppb
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'red', display: 'inline-block', marginRight: 8 }}></span>
                                    Unhealthy
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    2200 ppb
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgb(97, 4, 97)', display: 'inline-block', marginRight: 8 }}></span>
                                    Very Unhealthy
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    3300 ppb
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgb(60, 5, 60)', display: 'inline-block', marginRight: 8 }}></span>
                                    Hazardous
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    4400 ppb
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                </Box>
            </Popover>

            <Typography variant="h5" sx={{ marginBottom: 1 }}>TVOC</Typography>
            <div style={{ width: 70, height: 70 }}>
                <CircularProgressbar
                    // value={(tvocValue) * 100}
                    value={(tvocValue / 4400) * 100}
                    text={`${tvocValue} ppb`}
                    styles={buildStyles({
                        pathColor: color,
                        textColor: '#000',
                        trailColor: '#d6d6d6',
                        textSize: '16px',
                    })}
                />
            </div>
            {/* <Typography variant="body2" style={{
                marginTop: 2, color: color, backgroundColor: 'white',
                fontSize: '25px', fontWeight: 'bold'
            }}>
                {status}
            </Typography> */}
        </Box>
    );
};

export default TVOC;
