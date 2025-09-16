import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { gridSpacing } from 'store/constant';

import './../../utilities/Typography.css';
import Overall from './Overall';
import Indoor from './Indoor';
import First from './First';
import Linegraph from './Linegraph';
import TempHum from './TempHum';
import api from './../../../api.js';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);  // eslint-disable-line no-unused-vars
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchTimestampStatus = async () => {
      try {
        const response = await api.get('/integration/device/status');
        setTimestamp(response.data.last_updated_time);
      } catch (error) {
        console.error('Error fetching timestamp and status:', error);
      }
    };

    fetchTimestampStatus();

    const intervalId = setInterval(fetchTimestampStatus, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h2">
          IAQ Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold' }}>
          Last updated at: {timestamp ? timestamp : 'Loading...'}
        </Typography>
      </Box>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Overall isLoading={isLoading} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Indoor isLoading={isLoading} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <First isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Linegraph isLoading={isLoading} />
            </Grid>

            <Grid item lg={6} md={6} sm={6} xs={12}>
              <TempHum isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            {/* Additional content can go here */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
