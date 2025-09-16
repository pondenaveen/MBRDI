import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import First_details from './First_details';
// import Third_details from './Third_details';


const All = () => {
    const [isLoading, setLoading] = useState(true);  // eslint-disable-line no-unused-vars

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div>
            {/* <Typography variant="h1" sx={{ mb: 1 }}>
                Individual Sensor Data
            </Typography> */}
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={12} md={6} sm={6} xs={12}>
                            <First_details isLoading={isLoading} />
                        </Grid>
                        {/* <Grid item lg={6} md={6} sm={6} xs={12} sx={{ mt: 5.3 }}>
                            <Third_details isLoading={isLoading} />
                        </Grid> */}

                    </Grid>
                </Grid>

                {/* <Grid item xs={12} sx={{ mt: -2 }}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Third_details isLoading={isLoading} />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Third_details isLoading={isLoading} />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sx={{ mt: -2 }}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Third_details isLoading={isLoading} />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Third_details isLoading={isLoading} />
                        </Grid>
                    </Grid>
                </Grid> */}

            </Grid>



        </div>



    );
};

export default All;
