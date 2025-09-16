import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MainCard from 'ui-component/cards/MainCard';
import GaugeComponent from './Gauge';
import Smallcard from './Smallcard';

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: '#eef2f6',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    height: '280px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
}));

const LargeCard = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#000',
    height: '245px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
}));

const HeaderBox = styled(Box)(() => ({
    backgroundColor: 'rgb(230, 230, 230,0.5)',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    height: '30px',
    top: 6,
    left: 6,
    right: 6,
}));

const Third_details = () => {
    return (
        <>

            <CardWrapper border={false} content={false}>
                <Box sx={{ p: 2.25, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid item xs={6}>
                            <LargeCard>
                                <HeaderBox>
                                    <Typography
                                        sx={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            flexGrow: 1,
                                            textAlign: 'center',
                                        }}
                                    >
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; IAQ - 1
                                    </Typography>
                                    <Tooltip title="More information about IAQ - 1" arrow>
                                        <IconButton
                                            sx={{
                                                color: 'black',
                                            }}
                                        >
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                </HeaderBox>
                                <GaugeComponent pointerColor="black" initialValue="20" />
                            </LargeCard>
                        </Grid>

                        <Grid container item xs={6} spacing={2}>
                            <Grid item xs={4}>
                                <Smallcard
                                    title="Temperature"
                                    additionalContent="22°C"
                                    bgColor="lightblue"
                                    textColor="darkblue"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Smallcard
                                    title="Humidity"
                                    additionalContent="45%"
                                    bgColor="lightgreen"
                                    textColor="darkgreen"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Smallcard
                                    title="CO2"
                                    additionalContent="400 ppm"
                                    bgColor="salmon"
                                    textColor="white"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ mt: -2 }}>
                                <Smallcard
                                    title="PM 2.5"
                                    additionalContent="10 µg/m³"
                                    bgColor="lightcoral"
                                    textColor="white"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ mt: -2 }}>
                                <Smallcard
                                    title="PM 10"
                                    additionalContent="15 µg/m³"
                                    bgColor="rgb(255, 165, 0)"
                                    textColor="black"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ mt: -2 }}>
                                <Smallcard
                                    title="TVOC"
                                    additionalContent="0.5 ppm"
                                    bgColor="lightpink"
                                    textColor="black"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Last Updated Text */}
                    <Box sx={{ mt: 'auto', textAlign: 'right', pr: 2 }}>
                        <Typography sx={{ fontSize: '14px', color: 'gray', mt: 1 }}> {/* Added mt for top margin */}
                            Last updated at: 2024-09-21 10:00 AM
                        </Typography>
                    </Box>

                </Box>
            </CardWrapper>
        </>
    );
};

export default Third_details;
