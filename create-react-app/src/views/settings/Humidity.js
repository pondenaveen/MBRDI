import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, IconButton, Popover } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import api from './../../api.js';

const Humidity = () => {
    const [humidity, setHumidity] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/integration/iaq');
                setHumidity(response.data.Hum);
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const getStatus = () => {
        if (humidity === null) return { status: 'Loading', color: 'grey' };
        if (humidity <= 50) return { status: 'Grenn', color: '#29BA76' };
        if (humidity <= 60) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
        if (humidity <= 70) return { status: 'Unhealthy if sensitive', color: '#EA8232' };
        if (humidity <= 80) return { status: 'Unhealthy', color: '#F33C42' };
        if (humidity <= 90) return { status: 'Very Unhealthy', color: '#8C3A5A' };
        return { status: 'Hazardous', color: '#510B36' };
    };

    const { color } = getStatus();

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
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#29BA76', display: 'inline-block', marginRight: 8 }}></span>
                                    Good
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                                    30% - 50%
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
                                    51% - 60%
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EA8232', display: 'inline-block', marginRight: 8 }}></span>
                                    Unhealthy if sensitive
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    61% - 70%
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F33C42', display: 'inline-block', marginRight: 8 }}></span>
                                    Unhealthy
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    71% - 80%
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8C3A5A', display: 'inline-block', marginRight: 8 }}></span>
                                    Very Unhealthy
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    81% - 90%
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container alignItems="center">
                            <Grid item xs>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#510B36', display: 'inline-block', marginRight: 8 }}></span>
                                    Hazardous
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                    91%+
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Popover>

            <Typography variant="h5" sx={{ marginBottom: 1 }}>Humidity</Typography>
            <div style={{ width: 70, height: 70 }}>
                <CircularProgressbar
                    // value={humidity || 0}
                    value={(humidity / 100) * 100}
                    text={`${humidity || 0}%`}
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

export default Humidity;
