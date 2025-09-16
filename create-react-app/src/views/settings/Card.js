import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    height: '360px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
}));

const SmallCard = styled(MainCard)(() => ({
    backgroundColor: '#f5f5f5',
    color: '#000',
    height: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
}));

const LargeCard = styled(MainCard)(() => ({
    backgroundColor: '#e0f7fa',
    color: '#000',
    height: '280px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
}));

const FirstDetails = () => {
    return (
        <CardWrapper border={false} content={false}>
            <Box sx={{ p: 2.25, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ color: 'black', fontSize: '20px', mb: 2 }}>
                    Air Quality History
                </Typography>
                <Grid container spacing={2} sx={{ height: '100%' }}>
                    {/* Large card taking up 6 columns */}
                    <Grid item xs={6}>
                        <LargeCard>
                            <Typography>Large Card</Typography>
                        </LargeCard>
                    </Grid>

                    {/* First row of small cards */}
                    <Grid container item xs={6} spacing={2}>
                        <Grid item xs={4}>
                            <SmallCard>
                                <Typography>Small Card 1</Typography>
                            </SmallCard>
                        </Grid>
                        <Grid item xs={4}>
                            <SmallCard>
                                <Typography>Small Card 2</Typography>
                            </SmallCard>
                        </Grid>
                        <Grid item xs={4}>
                            <SmallCard>
                                <Typography>Small Card 3</Typography>
                            </SmallCard>
                        </Grid>

                        {/* Second row of small cards */}
                        <Grid item xs={4}>
                            <SmallCard>
                                <Typography>Small Card 4</Typography>
                            </SmallCard>
                        </Grid>
                        <Grid item xs={4}>
                            <SmallCard>
                                <Typography>Small Card 5</Typography>
                            </SmallCard>
                        </Grid>
                        <Grid item xs={4}>
                            <SmallCard>
                                <Typography>Small Card 6</Typography>
                            </SmallCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </CardWrapper>
    );
};

export default FirstDetails;
