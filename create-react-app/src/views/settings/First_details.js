import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, } from '@mui/material';
// import InfoIcon from '@mui/icons-material/Info';
import GaugeComponent from './Gauge';
import Smallcard from './Smallcard';
import { useNavigate } from 'react-router-dom';
import api from './../../api.js';
import { styled } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#eef2f6',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  height: '380px',
  borderRadius: '4px',
  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
}));

const LargeCard = styled(MainCard)(() => ({
  backgroundColor: 'white',
  color: '#000',
  height: '345px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  borderRadius: '4px',
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

const FirstDetails = () => {
  const [iaqData, setIaqData] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIaqData = async () => {
      try {
        const response = await api.get('/integration/iaq');
        setIaqData(response.data);
        console.log('IAQ Data:', response.data);
      } catch (error) {
        console.error('Error fetching IAQ data:', error);
      }
    };

    // Fetch initially
    fetchIaqData();

    // Set up an interval to refresh every X seconds
    const interval = setInterval(() => {
      fetchIaqData();
    }, 60000); // Change 5000 to your desired interval in milliseconds (5000ms = 5 seconds)

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTimestampStatus = async () => {
      try {
        const response = await api.get('/integration/device/status');
        setTimestamp(response.data.last_updated_time);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching timestamp and status:', error);
      }
    };

    // Fetch initially
    fetchTimestampStatus();

    // Set up an interval to refresh every X seconds
    const interval = setInterval(() => {
      fetchTimestampStatus();
    }, 60000); // Change 5000 to your desired interval in milliseconds (5000ms = 5 seconds)

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleGaugeClick = () => {
    navigate('/Settings/Floor1/All');
  };

  // Define status functions for each sensor
  // const getCO2Status = (co2Value) => {
  //   if (co2Value <= 400) return { status: 'Good', color: 'green' };
  //   if (co2Value <= 1000) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
  //   if (co2Value <= 1500) return { status: 'Unhealthy if Sensitive', color: 'orange' };
  //   if (co2Value <= 2000) return { status: 'Unhealthy', color: 'red' };
  //   if (co2Value <= 2500) return { status: 'Very Unhealthy', color: '#8C3A5A' };
  //   return { status: 'Hazardous', color: 'rgb(60, 5, 60)' };
  // };

  const getHumidityStatus = (humidity) => {
    if (humidity === null) return { status: 'Loading', color: 'grey' };
    if (humidity <= 50) return { status: 'Green', color: '#29BA76' };
    if (humidity <= 60) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
    if (humidity <= 70) return { status: 'Unhealthy if sensitive', color: '#EA8232' };
    if (humidity <= 80) return { status: 'Unhealthy', color: '#F33C42' };
    if (humidity <= 90) return { status: 'Very Unhealthy', color: '#8C3A5A' };
    return { status: 'Hazardous', color: '#510B36' };
  };

  const getPM10Status = (pm10Value) => {
    if (pm10Value <= 50) return { status: 'Good', color: 'green' };
    if (pm10Value <= 100) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
    if (pm10Value <= 150) return { status: 'Unhealthy if Sensitive', color: 'orange' };
    if (pm10Value <= 200) return { status: 'Unhealthy', color: 'red' };
    if (pm10Value <= 300) return { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)' };
    return { status: 'Hazardous', color: 'rgb(60, 5, 60)' };
  };

  const getPM25Status = (pm25Value) => {
    if (pm25Value <= 12) return { status: 'Good', color: 'green' };
    if (pm25Value <= 35.4) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
    if (pm25Value <= 55.4) return { status: 'Unhealthy if Sensitive', color: 'orange' };
    if (pm25Value <= 150.4) return { status: 'Unhealthy', color: 'red' };
    if (pm25Value <= 250.4) return { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)' };
    return { status: 'Hazardous', color: 'rgb(60, 5, 60)' };
  };

  const getTemperatureStatus = (temperature) => {
    console.log('Tmp Value:', temperature); // Log the TVOC value
    if (temperature === null) return { status: 'Loading', color: 'grey' };
    if (temperature < 20) return { status: 'Cold', color: '#29BA76' };
    if (temperature <= 24) return { status: 'Green', color: '#29BA76' };
    if (temperature <= 26) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
    if (temperature <= 27) return { status: 'Unhealthy if sensitive', color: '#EA8232' };
    if (temperature <= 30) return { status: 'Unhealthy', color: '#F33C42' };
    return { status: 'Hazardous', color: '#510B36' };
  };

  const getTVOCStatus = (tvocValue) => {
    console.log('TVOC Value:', tvocValue); // Log the TVOC value
    if (tvocValue <= 200) return { status: 'Good', color: 'green' };
    if (tvocValue <= 600) return { status: 'Moderate', color: 'rgb(165, 244, 8)' };
    if (tvocValue <= 1000) return { status: 'Unhealthy if Sensitive', color: 'orange' };
    if (tvocValue <= 1500) return { status: 'Unhealthy', color: 'red' };
    if (tvocValue <= 2000) return { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)' };
    return { status: 'Hazardous', color: 'rgb(60, 5, 60)' };
  };

  // Calculate statuses
  // const co2Status = getCO2Status(iaqData?.CO2);
  const humidityStatus = getHumidityStatus(iaqData?.Hum);
  const pm10Status = getPM10Status(iaqData?.pm10);
  const pm25Status = getPM25Status(iaqData?.pm25);
  const temperatureStatus = getTemperatureStatus(iaqData?.Temp);
  const tvocStatus = getTVOCStatus(iaqData?.TVOC);

  console.log('Tmp Status:', temperatureStatus);
  console.log('TVOC Status:', tvocStatus);

  return (
    <>
      <Typography sx={{ color: 'black', fontSize: '20px', mb: 2, fontWeight: 'bold' }}>
        Set Of Sensor In Floor - 6
      </Typography>
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 2.25, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item xs={6}>
              <LargeCard onClick={handleGaugeClick} style={{ cursor: 'pointer' }}>
                <HeaderBox>
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      flexGrow: 1,
                      textAlign: 'center',
                    }}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; IAQ - 1
                  </Typography>
                  {/* <IconButton sx={{ color: 'black' }}>
                    <InfoIcon />
                  </IconButton> */}
                </HeaderBox>
                {iaqData && <GaugeComponent pointerColor="black" initialValue={iaqData.AQI} />}
              </LargeCard>
            </Grid>

            <Grid container item xs={6} spacing={2}>
              <Grid item xs={4}>
                <Smallcard
                  title="Temperature"
                  additionalContent={`${iaqData?.Temp ?? '--'}°C`}
                  bgColor={temperatureStatus.color}
                  textColor="white"
                  contentTextColor={temperatureStatus.color}
                />
              </Grid>
              <Grid item xs={4}>
                <Smallcard
                  title="Humidity"
                  additionalContent={`${iaqData?.Hum ?? '--'}%`}
                  bgColor={humidityStatus.color}
                  textColor="white"
                  contentTextColor={humidityStatus.color}
                />
              </Grid>
              {/* <Grid item xs={4}>
                <Smallcard
                  title="CO2"
                  additionalContent={`${iaqData?.CO2 ?? '--'} ppm`}
                  bgColor={co2Status.color}
                  textColor="white"
                  contentTextColor="orange"
                />
              </Grid> */}

              <Grid item xs={4}>
                <Smallcard
                  title="CO2"
                  additionalContent={`${iaqData?.CO2 ?? '--'} ppm`}
                  contentTextColor="rgb(165, 244, 8)" // This ensures CO2 content is displayed in orange
                />
              </Grid>


              <Grid item xs={4} sx={{ mt: -2 }}>
                <Smallcard
                  title="PM 2.5"
                  additionalContent={`${iaqData?.pm25 ?? '--'} µg/m³`}
                  bgColor={pm25Status.color}
                  textColor="white"
                  contentTextColor={pm25Status.color}
                />
              </Grid>
              <Grid item xs={4} sx={{ mt: -2 }}>
                <Smallcard
                  title="PM 10"
                  additionalContent={`${iaqData?.pm10 ?? '--'} µg/m³`}
                  bgColor={pm10Status.color}
                  textColor="white"
                  contentTextColor={pm10Status.color}
                />
              </Grid>
              <Grid item xs={4} sx={{ mt: -2 }}>
                <Smallcard
                  title="TVOC"
                  additionalContent={`${iaqData?.TVOC ?? '--'} ppb`}
                  bgColor={tvocStatus.color}
                  textColor="white"
                  contentTextColor={tvocStatus.color}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* <Box sx={{ mt: 'auto', textAlign: 'right', pr: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {status !== null ? (
                <>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: status ? 'green' : 'red',
                      display: 'inline-block',
                      mr: 1,
                    }}
                  />

                </>
              ) : (
                <Typography sx={{ fontSize: '14px', color: 'gray', mr: 1 }}>Loading...</Typography>
              )}
              <Typography sx={{ fontSize: '16px', color: 'gray', fontWeight: 'bold' }}>
                Last updated at: {timestamp ? timestamp : 'Loading...'}
              </Typography>
            </Box>
          </Box>
        </Box> */}

          <Box sx={{ mt: 'auto', textAlign: 'right', pr: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography sx={{ fontSize: '16px', color: 'gray', fontWeight: 'bold', mr: 0.5 }}>
                Status:
              </Typography>
              {status !== null ? (
                <>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: status ? 'green' : 'red',
                      display: 'inline-block',
                      mr: 4,
                    }}
                  />

                </>
              ) : (
                <Typography sx={{ fontSize: '14px', color: 'gray', mr: 1 }}>Loading...</Typography>
              )}
              <Typography sx={{ fontSize: '16px', color: 'gray', fontWeight: 'bold' }}>
                Last updated at: {timestamp ? timestamp : 'Loading...'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardWrapper >
    </>
  );
};

export default FirstDetails;
