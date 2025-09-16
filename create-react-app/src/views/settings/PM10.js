import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Grid, Popover } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from './../../api.js';
const PM10 = () => {
    const [pm10Value, setPm10Value] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/integration/iaq');
                setPm10Value(response.data.pm10);
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const getStatus = () => {
        if (pm10Value <= 50) return { status: 'Good', color: 'green' };
        if (pm10Value <= 100) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
        if (pm10Value <= 150) return { status: 'Unhealthy if Sensitive', color: 'orange' };
        if (pm10Value <= 200) return { status: 'Unhealthy', color: 'red' };
        if (pm10Value <= 300) return { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)' };
        return { status: 'Hazardous', color: 'rgb(60, 5, 60)' };
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
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'green', display: 'inline-block', marginRight: 8 }}></span>
                                    Good
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 2 }}>
                                    0 μg/m³
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
                                    55 μg/m³
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
                                    155 μg/m³
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
                                    255 μg/m³
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
                                    355 μg/m³
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
                                    425 μg/m³
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Popover>

            <Typography variant="h5" sx={{ marginBottom: 1 }}>PM10</Typography>
            <div style={{ width: 70, height: 70 }}>
                <CircularProgressbar
                    // value={pm10Value || 0}
                    value={(pm10Value / 425) * 100}
                    text={`${pm10Value || 0} μg/m³`}
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

export default PM10;
