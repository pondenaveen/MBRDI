import React from 'react';
import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import './../utilities/Typography.css';

const Second_details = () => {
  return (
    <Box
      className="status-container"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="10vh"
    >
      <Box display="flex" alignItems="center" justifyContent="center" className="status-box">
        <ErrorOutlineIcon className="status-icon" color="error" sx={{ fontSize: 80 }} />
        <Typography sx={{ fontSize: '60px', fontWeight: 'bold', ml: 2 }} color="error" className="status-text">
          Devices are offline
        </Typography>
      </Box>
    </Box>
  );
};

export default Second_details;
