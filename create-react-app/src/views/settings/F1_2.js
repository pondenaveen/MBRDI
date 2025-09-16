// F1_2.js
import React, { useEffect } from 'react';
import {
    // MDBCard,
    // MDBCardHeader,
    MDBCardBody
} from 'mdb-react-ui-kit';
import { Grid, Box } from '@mui/material';
import FloorLayout from './FL_1.js';

import CO2 from './CO2.js';
import PM10 from './PM10';
import PM25 from './PM25';
import TVOC from './TVOC';
import Temp from './Temp';
import Humidity from './Humidity';

function F1_2() {
    // const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="main-container">


            <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={12} sm={12}>
                    {/* <MDBCard className="card main-card" style={{ backgroundColor: '#e8eff9', height: '700px' }}>
                        <MDBCardHeader className='header'>Indoor Air Quality</MDBCardHeader> */}
                    <MDBCardBody>
                        <Grid container spacing={2} style={{ marginTop: '-35px' }}>
                            <Grid item xs={12} sm={4} sx={{ ml: -2 }}>
                                <Temp />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Humidity />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <CO2 />
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ ml: -2 }}>
                                <PM10 />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <PM25 />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TVOC />
                            </Grid>
                        </Grid>
                    </MDBCardBody>
                    {/* </MDBCard> */}
                </Grid>
            </Grid>

            <Box sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FloorLayout />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default F1_2; // Exporting the F1_2 component at the end
