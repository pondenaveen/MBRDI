// import React from 'react';
// import PropTypes from 'prop-types';
// import { styled } from '@mui/material/styles';
// import { Box, Grid, Typography, IconButton, Tooltip } from '@mui/material';
// import InfoIcon from '@mui/icons-material/Info';
// import MainCard from 'ui-component/cards/MainCard';
// import GaugeComponent from './Gauge';

// const CardWrapper = styled(MainCard)(() => ({
//     backgroundColor: 'white',
//     color: '#fff',
//     overflow: 'hidden',
//     position: 'relative',
//     padding: '20px',
//     height: '420px',
//     borderRadius: '4px',
// }));

// const SmallCardWrapper = styled(MainCard)(({ disabled }) => ({
//     backgroundColor: disabled ? 'lightgray' : 'transparent',
//     border: disabled ? '1px solid lightgray' : '1px solid gray',
//     color: '#fff',
//     overflow: 'hidden',
//     position: 'relative',
//     padding: '20px',
//     height: '300px',
//     borderRadius: '4px',
// }));

// const CustomTooltip = styled(({ className, ...props }) => (
//     <Tooltip {...props} classes={{ tooltip: className }} />
// ))({
//     backgroundColor: 'rgb(230, 230, 230)',
//     color: 'black',
//     fontSize: '0.875rem',
// });

// const First = () => {
//     const totalIn = 50;
//     const totalOut = 30;
//     const isSecondFloorDisabled = true;

//     const aqiInfo = [
//         { status: 'Good', color: 'green', value: '0 - 50' },
//         { status: 'Moderate', color: 'rgb(165, 244, 8)', value: '51 - 100' },
//         { status: 'Unhealthy if Sensitive', color: 'orange', value: '101 - 150' },
//         { status: 'Unhealthy', color: 'red', value: '151 - 200' },
//         { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)', value: '201 - 300' },
//         { status: 'Hazardous', color: 'rgb(60, 5, 60)', value: '301 - 500' },
//     ];

//     const renderAQITooltip = () => (
//         <Grid container spacing={1}>
//             {aqiInfo.map((item, index) => (
//                 <Grid item container alignItems="center" key={index}>
//                     <Grid item xs={2}>
//                         <span style={{
//                             width: 8,
//                             height: 8,
//                             borderRadius: '50%',
//                             backgroundColor: item.color,
//                             display: 'inline-block',
//                             marginRight: 8,
//                             marginLeft: 20,
//                         }}></span>
//                     </Grid>
//                     <Grid item xs={6}>
//                         <Typography variant="body2">{item.status}</Typography>
//                     </Grid>
//                     <Grid item xs={4}>
//                         <Typography variant="body2">{item.value}</Typography>
//                     </Grid>
//                 </Grid>
//             ))}
//         </Grid>
//     );

//     return (
//         <CardWrapper border={false} content={false}>
//             <Typography
//                 style={{
//                     color: 'black',
//                     fontSize: '18px',
//                     fontWeight: '400',
//                     padding: '6px',
//                     backgroundColor: 'rgb(180, 254, 180)',
//                     textAlign: 'center',
//                     width: '100%',
//                 }}
//             >
//                 Floor wise Air Quality Index
//             </Typography>
//             <Box sx={{ p: 2.25 }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} md={6}>
//                         <SmallCardWrapper
//                             sx={{
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 position: 'relative',
//                             }}
//                         >
//                             <Typography
//                                 style={{
//                                     color: 'gray',
//                                     marginBottom: '10px',
//                                     fontSize: '20px',
//                                     fontWeight: '400',
//                                     marginLeft: '-40px'
//                                 }}
//                             >
//                                 First Floor
//                             </Typography>
//                             <GaugeComponent pointerColor="black" initialValue={totalIn} disabled={false} />
//                             <CustomTooltip title={renderAQITooltip()} arrow>
//                                 <IconButton
//                                     size="small"
//                                     sx={{
//                                         position: 'absolute',
//                                         top: '10px',
//                                         right: '10px',
//                                     }}
//                                 >
//                                     <InfoIcon fontSize="inherit" />
//                                 </IconButton>
//                             </CustomTooltip>
//                         </SmallCardWrapper>
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                         <SmallCardWrapper
//                             disabled={isSecondFloorDisabled}
//                             sx={{
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 position: 'relative',
//                             }}
//                         >
//                             <Typography
//                                 style={{
//                                     color: isSecondFloorDisabled ? 'darkgray' : 'gray',
//                                     marginBottom: '10px',
//                                     fontSize: '20px',
//                                     fontWeight: '400',
//                                     marginLeft: '-40px'
//                                 }}
//                             >
//                                 Second Floor
//                             </Typography>
//                             <GaugeComponent pointerColor="gray" initialValue={totalOut} disabled={isSecondFloorDisabled} />
//                         </SmallCardWrapper>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </CardWrapper>
//     );
// };

// First.propTypes = {
//     isLoading: PropTypes.bool,
// };

// export default First;


import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MainCard from 'ui-component/cards/MainCard';
import GaugeComponent from './Gauge';
import Gray from './Gray';
import api from './../../../api.js';

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    padding: '20px',
    height: '220px',
    borderRadius: '4px',
}));

const SmallCardWrapper = styled(MainCard)(({ disabled }) => ({
    backgroundColor: disabled ? 'lightgray' : 'transparent',
    border: disabled ? '1px solid lightgray' : '1px solid gray',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    padding: '20px',
    height: '150px',
    borderRadius: '4px',
}));

const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ tooltip: className }} />
))({
    backgroundColor: 'rgb(230, 230, 230)',
    color: 'black',
    fontSize: '0.875rem',
});

const First = () => {
    const [aqiData, setAqiData] = useState({
        CO2: 0,
        Hum: 0,
        TVOC: 0,
        Temp: 0,
        pm10: 0,
        pm25: 0,
        AQI: 0,
        CarbonFootprint: 0,
    });
    const [isSecondFloorDisabled, setIsSecondFloorDisabled] = useState(true);

    useEffect(() => {
        const fetchAqiData = async () => {
            try {
                const response = await api.get('/integration/iaq');
                const data = response.data;
                setAqiData({
                    CO2: data.CO2,
                    Hum: data.Hum,
                    TVOC: data.TVOC,
                    Temp: data.Temp,
                    pm10: data.pm10,
                    pm25: data.pm25,
                    AQI: data.AQI,
                    CarbonFootprint: data.CarbonFootprint,
                });

                if (data.AQI > 100) {
                    setIsSecondFloorDisabled(false);
                }
            } catch (error) {
                console.error('Error fetching AQI data:', error);
            }
        };

        fetchAqiData(); // Fetch data initially

        const interval = setInterval(fetchAqiData, 60000); // Refresh every 1 minute (60000 ms)

        return () => clearInterval(interval); // Clear interval on unmount
    }, []);


    const aqiInfo = [
        { status: 'Good', color: 'green', value: '0 - 50' },
        { status: 'Moderate', color: 'rgb(165, 244, 8)', value: '51 - 100' },
        { status: 'Unhealthy if Sensitive', color: 'orange', value: '101 - 150' },
        { status: 'Unhealthy', color: 'red', value: '151 - 200' },
        { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)', value: '201 - 300' },
        { status: 'Hazardous', color: 'rgb(60, 5, 60)', value: '301 - 500' },
    ];

    const renderAQITooltip = () => (
        <Grid container spacing={1}>
            {aqiInfo.map((item, index) => (
                <Grid item container alignItems="center" key={index}>
                    <Grid item xs={2}>
                        <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            display: 'inline-block',
                            marginRight: 8,
                            marginLeft: 20,
                        }}></span>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">{item.status}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2">{item.value}</Typography>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <CardWrapper border={false} content={false}>
            <Typography
                style={{
                    color: 'black',
                    fontSize: '18px',
                    // marginTop: '-16px',
                    padding: '6px',
                    fontWeight: 'bold',
                    // backgroundColor: 'rgb(180, 254, 180)',
                    textAlign: 'left',
                    width: '100%',
                    marginTop:'-18px'
                }}
            >
                Floor wise Air Quality Index
            </Typography>
            <Box sx={{ p: 2.25 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <SmallCardWrapper
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <Typography
                                style={{
                                    color: 'gray',
                                    // marginBottom: '10px',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    marginLeft: '10px',
                                    // marginTop:'-120px'
                                }}
                            >
                                EC1-6th Floor
                            </Typography>
                            <GaugeComponent pointerColor="black" initialValue={aqiData.AQI} disabled={false} />
                            <CustomTooltip title={renderAQITooltip()} arrow>
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: '1px',
                                        right: '10px',
                                    }}
                                >
                                    <InfoIcon fontSize="inherit" />
                                </IconButton>
                            </CustomTooltip>
                        </SmallCardWrapper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SmallCardWrapper
                            disabled={isSecondFloorDisabled}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <Typography
                                style={{
                                    color: isSecondFloorDisabled ? 'darkgray' : 'gray',
                                    marginBottom: '10px',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    marginLeft: '-10px',
                                    marginTop:'3px'
                                }}
                            >
                                Second Floor
                            </Typography>
                            <Gray pointerColor="gray" initialValue={0} disabled={isSecondFloorDisabled} />
                        </SmallCardWrapper>
                    </Grid>
                </Grid>
            </Box>
        </CardWrapper>
    );
};

First.propTypes = {
    isLoading: PropTypes.bool,
};

export default First;
