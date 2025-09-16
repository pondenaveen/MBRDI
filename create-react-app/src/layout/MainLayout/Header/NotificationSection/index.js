import { useState, useRef, useEffect } from 'react';
import { Box, ButtonBase, Avatar, Badge, Popper, Card, Typography, Grid } from '@mui/material';
import { IconBell } from '@tabler/icons';
import api from './../../../../api.js';
import { useLocation } from 'react-router-dom';

import tempImage from './Temperature.svg';
import co2Image from './CO2.svg';
import tvocImage from './TVOC.svg';
import aqiImage from './AQI.svg';
import humImage from './Humidity.svg';
import pm25Image from './PM 2.5.svg';
import pm10Image from './PM 10.svg';

const kpiImageMapping = {
  'Temp': tempImage,
  'CO2': co2Image,
  'TVOC': tvocImage,
  'pm10': pm10Image,
  'pm25': pm25Image,
  'AQI': aqiImage,
  'Hum': humImage,
};

const NotificationSection = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [timestamp, setTimestamp] = useState(null);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const popperRef = useRef(null);
  const location = useLocation(); // Detects route changes

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await api.get('/integration/iaq/alert/count');
        if (response && response.data) {
          setNotificationCount(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();
    const intervalId = setInterval(fetchNotificationCount, 60000); // Refetch every minute

    return () => clearInterval(intervalId);
  }, []);

  // Toggle the popper (dropdown) on click
  const handleToggle = async () => {
    setOpen((prevOpen) => !prevOpen);

    if (!open) {
      try {
        const response = await api.get('/integration/iaq/alert/count');
        if (response && response.data) {
          setAlerts(response.data.alerts);
          setTimestamp(response.data.timestamp);
          setNotificationCount(0); // Reset notification count when opened
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    }
  };

  // Hide notification bubble when clicking outside
  const handleClickOutside = (event) => {
    if (popperRef.current && !popperRef.current.contains(event.target) && !anchorRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options).replace(',', '');
  };

  // Hide notification bubble when navigating to the history page
  useEffect(() => {
    if (location.pathname === '/utils/util-alert/history') {
      setNotificationCount(0); // Reset notification count when on history page
    }
  }, [location.pathname]); // Trigger whenever the route changes

  return (
    <Box>
      <ButtonBase onClick={handleToggle}>
        <Badge badgeContent={notificationCount > 0 ? notificationCount : null} color="error">
          <Avatar ref={anchorRef}>
            <IconBell />
          </Avatar>
        </Badge>
      </ButtonBase>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-start"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ]}
        sx={{ zIndex: 1300 }}
      >
        <Card
          ref={popperRef}
          sx={{
            width: 420,
            position: 'fixed',
            left: '85%',
            top: '22%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 3,
            bgcolor: '#eef2f6',
            borderRadius: 2,
            padding: 2
          }}
        >
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mb: 2 }}>Notifications</Typography>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <Card key={index} sx={{ display: 'flex', marginBottom: 1, padding: 1 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'lightgray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 4
                  }}
                >
                  <Box
                    component="img"
                    src={kpiImageMapping[alert.KPI]}
                    alt="Alert"
                    sx={{ width: 40, height: 40 }}
                  />
                </Box>
                <Grid container spacing={1} sx={{ alignItems: 'center' }}>
                  <Grid item xs={4}>
                    <Typography sx={{ fontWeight: 'bold' }}>Alert name</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{alert.KPI}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography sx={{ fontWeight: 'bold' }}>Value</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{alert.Value}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography sx={{ fontWeight: 'bold' }}>Severity</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{alert.Severity}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography sx={{ fontWeight: 'bold' }}>Zone</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{alert.Zone}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography sx={{ fontWeight: 'bold' }}>Timestamp</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{formatTimestamp(timestamp)}</Typography>
                  </Grid>
                </Grid>
              </Card>
            ))
          ) : (
            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center', width: '100%' }}>
              No alerts available
            </Typography>
          )}
        </Card>
      </Popper>
    </Box>
  );
};

export default NotificationSection;
