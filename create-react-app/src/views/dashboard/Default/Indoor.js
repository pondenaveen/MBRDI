// import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';
// import { Box, Typography, Tooltip, IconButton, Grid } from '@mui/material';
// import MainCard from 'ui-component/cards/MainCard';
// import {
//     GaugeContainer,
//     GaugeValueArc,
//     GaugeReferenceArc,
//     useGaugeState,
// } from '@mui/x-charts/Gauge';
// import api from './../../../api.js';
// import InfoIcon from '@mui/icons-material/Info';

// const CardWrapper = styled(MainCard)(() => ({
//     backgroundColor: 'white',
//     color: '#fff',
//     overflow: 'hidden',
//     position: 'relative',
//     height: '420px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: '4px',
// }));

// const CustomTooltip = styled(({ className, ...props }) => (
//     <Tooltip {...props} classes={{ tooltip: className }} />
// ))({
//     backgroundColor: 'rgb(230, 230, 230)',
//     color: 'black',
//     fontSize: '0.875rem',

// });

// function GaugePointer({ color }) {
//     const { valueAngle, outerRadius, cx, cy } = useGaugeState();

//     if (valueAngle === null) {
//         return null; // No value to display
//     }

//     const target = {
//         x: cx + outerRadius * Math.sin(valueAngle),
//         y: cy - outerRadius * Math.cos(valueAngle),
//     };

//     return (
//         <g>
//             <circle cx={cx} cy={cy} r={7} fill={color} />
//             <path
//                 d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
//                 stroke={color}
//                 strokeWidth={4}
//             />
//         </g>
//     );
// }

// const aqiInfo = [
//     { status: 'Good', color: 'green', value: '0 - 50' },
//     { status: 'Moderate', color: 'rgb(165, 244, 8)', value: '51 - 100' },
//     { status: 'Unhealthy if Sensitive', color: 'orange', value: '101 - 150' },
//     { status: 'Unhealthy', color: 'red', value: '151 - 200' },
//     { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)', value: '201 - 300' },
//     { status: 'Hazardous', color: 'rgb(60, 5, 60)', value: '301 - 500' },
// ];

// const renderAQITooltip = () => (
//     <Grid container spacing={1}>
//         {aqiInfo.map((item, index) => (
//             <Grid item container alignItems="center" key={index}>
//                 <Grid item xs={2}>
//                     <span style={{
//                         width: 8,
//                         height: 8,
//                         borderRadius: '50%',
//                         backgroundColor: item.color,
//                         display: 'inline-block',
//                         marginRight: 8,
//                         marginLeft: 20,
//                     }}></span>
//                 </Grid>
//                 <Grid item xs={6}>
//                     <Typography variant="body2">{item.status}</Typography>
//                 </Grid>
//                 <Grid item xs={4}>
//                     <Typography variant="body2">{item.value}</Typography>
//                 </Grid>
//             </Grid>
//         ))}
//     </Grid>
// );

// const GaugeTicks = () => {
//     const { outerRadius, startAngle, endAngle, cx, cy } = useGaugeState();
//     const numTicks = 10;
//     const tickLength = 10;

//     const ticks = [];
//     for (let i = 0; i <= numTicks; i++) {
//         const angle = startAngle + (i / numTicks) * (endAngle - startAngle);
//         const sin = Math.sin(angle);
//         const cos = Math.cos(angle);

//         const x1 = cx + (outerRadius - tickLength) * sin;
//         const y1 = cy - (outerRadius - tickLength) * cos;
//         const x2 = cx + (outerRadius - tickLength - 7) * sin;
//         const y2 = cy - (outerRadius - tickLength - 7) * cos;

//         ticks.push(
//             <g key={i}>
//                 <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth={2} />
//             </g>
//         );
//     }
//     return <g>{ticks}</g>;
// };

// const Indoor = ({ pointerColor = 'black' }) => {
//     const [overallValue, setOverallValue] = useState(0);

//     const fetchIAQData = async () => {
//         try {
//             const response = await api.get('/integration/iaq'); // Adjust the URL as necessary
//             if (response.data) {
//                 setOverallValue(response.data.AQI);
//             }
//         } catch (error) {
//             console.error('Error fetching IAQ data:', error);
//         }
//     };

//     useEffect(() => {
//         fetchIAQData();

//         const interval = setInterval(fetchIAQData, 60000); // Fetch data every minute
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <CardWrapper border={false} content={false}>
//             <Box
//                 sx={{
//                     textAlign: 'center',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: '100%',
//                 }}
//             >
//                 <Typography
//                     sx={{
//                         color: 'black',
//                         fontSize: '18px',

//                         padding: '6px',
//                         textAlign: 'left',
//                         width: '90%',
//                         borderRadius: '4px',
//                         display: 'block',
//                         fontWeight: 'bold'
//                     }}
//                 >
//                     Indoor Air Quality Index
//                     <CustomTooltip
//                         title={renderAQITooltip()}
//                         arrow
//                     >
//                         <IconButton
//                             size="md"
//                             sx={{
//                                 position: 'absolute',
//                                 top: '16px',
//                                 right: '18px',
//                                 color: 'black'
//                             }}
//                         >
//                             <InfoIcon fontSize="inherit" />
//                         </IconButton>
//                     </CustomTooltip>
//                 </Typography>

//                 <Box
//                     sx={{
//                         position: 'relative',
//                         display: 'inline-flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         mt: 1,
//                     }}
//                 >
//                     <GaugeContainer
//                         width={320}
//                         height={290}
//                         startAngle={-150}
//                         endAngle={150}
//                         value={overallValue}
//                         valueMax={500}
//                     >
//                         <GaugeReferenceArc thickness={15} color="rgba(0, 0, 0, 0.1)" />
//                         <GaugeValueArc thickness={15} sx={{ fill: 'url(#gaugeGradient)' }} />
//                         <GaugeTicks />
//                         <GaugePointer color={pointerColor} />
//                     </GaugeContainer>
//                     <Box
//                         sx={{
//                             position: 'absolute',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                         }}
//                     >
//                         <Box > {/* Adjust margin as needed */}
//                             <Typography
//                                 sx={{
//                                     color: 'black',
//                                     fontSize: '16px',
//                                     fontWeight: 'bold',
//                                     marginTop: '230px',
//                                     // textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
//                                 }}
//                             >
//                                 AQI
//                             </Typography>
//                         </Box>
//                         <Box>
//                             <Typography
//                                 sx={{
//                                     color: 'black',
//                                     fontSize: '34px',
//                                     fontWeight: 'bold',
//                                     marginTop: '-1px',
//                                     // textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
//                                 }}
//                             >
//                                 {overallValue}
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </Box>

//                 <Typography
//                     sx={{
//                         color: 'red',
//                         fontSize: '18px',
//                         mt: 2,
//                         fontWeight: 'bold',
//                         padding: '6px',
//                         backgroundColor: 'rgb(230, 230, 230,0.5)',
//                         textAlign: 'center',
//                         width: '70%',
//                         borderRadius: '4px',
//                         display: 'block',
//                     }}
//                 >
//                     {overallValue > 300 ? 'Hazardous' : overallValue > 200 ? 'Very Unhealthy' : overallValue > 150 ? 'Unhealthy' : overallValue > 100 ? 'Unhealthy if Sensitive' : overallValue > 50 ? 'Moderate' : 'Good'}
//                 </Typography>
//             </Box>
//         </CardWrapper>
//     );
// };

// export default Indoor;





import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Tooltip, IconButton, Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
import api from './../../../api.js';
import InfoIcon from '@mui/icons-material/Info';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: 'white',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  height: '220px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
}));

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
))({
  backgroundColor: 'rgb(230, 230, 230)',
  color: 'black',
  fontSize: '0.875rem',
});

function GaugePointer({ color }) {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    return null; // No value to display
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={color} />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke={color}
        strokeWidth={4}
      />
    </g>
  );
}

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

const GaugeTicks = () => {
  const { outerRadius, startAngle, endAngle, cx, cy } = useGaugeState();
  const numTicks = 10;
  const tickLength = 5;

  const ticks = [];
  for (let i = 0; i <= numTicks; i++) {
    const angle = startAngle + (i / numTicks) * (endAngle - startAngle);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const x1 = cx + (outerRadius - tickLength) * sin;
    const y1 = cy - (outerRadius - tickLength) * cos;
    const x2 = cx + (outerRadius - tickLength - 7) * sin;
    const y2 = cy - (outerRadius - tickLength - 7) * cos;

    ticks.push(
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth={2} />
      </g>
    );
  }
  return <g>{ticks}</g>;
};

const getGaugeColor = (value) => {
  if (value <= 50) return 'green';
  if (value <= 100) return 'rgb(165, 244, 8)';
  if (value <= 150) return 'orange';
  if (value <= 200) return 'red';
  if (value <= 300) return 'rgb(97, 4, 97)';
  return 'rgb(60, 5, 60)'; // Hazardous
};

const Indoor = ({ pointerColor = 'black' }) => {
  const [overallValue, setOverallValue] = useState(0);

  const fetchIAQData = async () => {
    try {
      const response = await api.get('/integration/iaq'); // Adjust the URL as necessary
      if (response.data) {
        setOverallValue(response.data.AQI);
      }
    } catch (error) {
      console.error('Error fetching IAQ data:', error);
    }
  };

  useEffect(() => {
    fetchIAQData();

    const interval = setInterval(fetchIAQData, 60000); // Fetch data every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <CardWrapper border={false} content={false}>
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Typography
          sx={{
            color: 'black',
            fontSize: '14px',
            padding: '6px',
            textAlign: 'left',
            width: '90%',
            borderRadius: '4px',
            display: 'block',
            fontWeight: 'bold',
            mt: -1
          }}
        >
          Indoor Air Quality Index
          <CustomTooltip
            title={renderAQITooltip()}
            arrow
          >
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: '2px',
                right: '18px',
                color: 'gray'
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        </Typography>

        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
          <GaugeContainer
            width={180}
            height={170}
            startAngle={-150}
            endAngle={150}
            value={overallValue}
            valueMax={500}
          >
            <GaugeReferenceArc thickness={15} color="rgba(0, 0, 0, 0.1)" />
            <GaugeValueArc thickness={15} sx={{ fill: getGaugeColor(overallValue) }} /> {/* Solid color based on value */}
            <GaugeTicks />
            <GaugePointer color={pointerColor} />
          </GaugeContainer>
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: 'black',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '100px',
                }}
              >
                AQI
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  color: 'black',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginTop: '-1px',
                }}
              >
                {overallValue}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography
          sx={{
            color: 'red',
            fontSize: '14px',
            mt: -0.5,
            fontWeight: 'bold',
            padding: '4px',
            backgroundColor: 'rgb(230, 230, 230,0.5)',
            textAlign: 'center',
            width: '70%',
            borderRadius: '4px',
            display: 'block',
          }}
        >
          {overallValue > 300 ? 'Hazardous' : overallValue > 200 ? 'Very Unhealthy' : overallValue > 150 ? 'Unhealthy' : overallValue > 100 ? 'Unhealthy if Sensitive' : overallValue > 50 ? 'Moderate' : 'Good'}
        </Typography>
      </Box>
    </CardWrapper>
  );
};

export default Indoor;
