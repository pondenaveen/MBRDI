// import React, { useEffect, useState } from 'react';
// import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState } from '@mui/x-charts/Gauge';
// import { Box, Typography } from '@mui/material';

// const GaugePointer = ({ color }) => {
//     const { valueAngle, outerRadius, cx, cy } = useGaugeState();
//     if (valueAngle === null) return null;

//     const target = {
//         x: cx + outerRadius * Math.sin(valueAngle),
//         y: cy - outerRadius * Math.cos(valueAngle),
//     };

//     return (
//         <g>
//             <circle cx={cx} cy={cy} r={7} fill={color} />
//             <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke={color} strokeWidth={4} />
//         </g>
//     );
// };

// const GaugeTicks = () => {
//     const { outerRadius, startAngle, endAngle, cx, cy } = useGaugeState();
//     const numTicks = 20;
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

// const GaugeComponent = ({ pointerColor = 'red', initialValue }) => {
//     const [overallValue, setOverallValue] = useState(initialValue);

//     useEffect(() => {
//         setOverallValue(initialValue);
//     }, [initialValue]);

//     return (
//         <Box
//             sx={{
//                 position: 'relative',
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginTop: '30px',
//             }}
//         >
//             <GaugeContainer
//                 // width={220}
//                 // height={240}
//                 width={300}
//                 height={240}
//                 startAngle={-150}
//                 endAngle={150}
//                 value={overallValue}
//                 valueMax={500}
//             >
//                 <defs>
//                     <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                         <stop offset="0%" style={{ stopColor: 'green', stopOpacity: 1 }} /> {/* Good */}
//                         <stop offset="25%" style={{ stopColor: 'rgb(165, 244, 8)', stopOpacity: 1 }} /> {/* Moderate */}
//                         <stop offset="50%" style={{ stopColor: 'orange', stopOpacity: 1 }} /> {/* Unhealthy if Sensitive */}
//                         <stop offset="75%" style={{ stopColor: 'red', stopOpacity: 1 }} /> {/* Unhealthy */}
//                         <stop offset="90%" style={{ stopColor: 'rgb(97, 4, 97)', stopOpacity: 1 }} /> {/* Very Unhealthy */}
//                         <stop offset="100%" style={{ stopColor: 'rgb(60, 5, 60)', stopOpacity: 1 }} /> {/* Hazardous */}
//                     </linearGradient>
//                 </defs>
//                 <GaugeReferenceArc thickness={15} color="rgba(0, 0, 0, 0.1)" />
//                 <GaugeValueArc thickness={15} sx={{ fill: 'url(#gaugeGradient)' }} />
//                 <GaugeTicks />
//                 <GaugePointer color={pointerColor} />
//             </GaugeContainer>
//             <Box
//                 sx={{
//                     position: 'absolute',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                 }}
//             >
//                 <Box > {/* Adjust margin as needed */}
//                     <Typography
//                         sx={{
//                             color: 'black',
//                             fontSize: '16px',
//                             fontWeight: 'bold',
//                             marginTop: '200px',
//                             // textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
//                         }}
//                     >
//                         AQI
//                     </Typography>
//                 </Box>
//                 <Box>
//                     <Typography
//                         sx={{
//                             color: 'black',
//                             fontSize: '34px',
//                             fontWeight: 'bold',
//                             marginTop: '-1px',
//                             // textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
//                         }}
//                     >
//                         {overallValue}
//                     </Typography>
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// export default GaugeComponent;




import React, { useEffect, useState } from 'react';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState } from '@mui/x-charts/Gauge';
import { Box, Typography } from '@mui/material';

const GaugePointer = ({ color }) => {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();
    if (valueAngle === null) return null;

    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };

    return (
        <g>
            <circle cx={cx} cy={cy} r={7} fill={color} />
            <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke={color} strokeWidth={4} />
        </g>
    );
};

const GaugeTicks = () => {
    const { outerRadius, startAngle, endAngle, cx, cy } = useGaugeState();
    const numTicks = 20;
    const tickLength = 10;

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
    if (value >= 0 && value <= 50) return 'green'; // Good
    if (value >= 51 && value <= 100) return 'rgb(165, 244, 8)'; // Moderate
    if (value >= 101 && value <= 150) return 'orange'; // Unhealthy if Sensitive
    if (value >= 151 && value <= 200) return 'red'; // Unhealthy
    if (value >= 201 && value <= 300) return 'rgb(97, 4, 97)'; // Very Unhealthy
    if (value >= 301 && value <= 500) return 'rgb(60, 5, 60)'; // Hazardous
    return 'gray'; // Default color for out-of-range values
};

const GaugeComponent = ({ pointerColor = 'red', initialValue }) => {
    const [overallValue, setOverallValue] = useState(initialValue);

    useEffect(() => {
        setOverallValue(initialValue);
    }, [initialValue]);

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '30px',
            }}
        >
            <GaugeContainer
                width={300}
                height={240}
                startAngle={-150}
                endAngle={150}
                value={overallValue}
                valueMax={500}
            >
                <GaugeReferenceArc thickness={15} color="rgba(0, 0, 0, 0.1)" />
                <GaugeValueArc 
                    thickness={15} 
                    sx={{ fill: getGaugeColor(overallValue) }} // Use the color based on the value
                />
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
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginTop: '200px',
                        }}
                    >
                        AQI
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        sx={{
                            color: 'black',
                            fontSize: '34px',
                            fontWeight: 'bold',
                            marginTop: '-1px',
                        }}
                    >
                        {overallValue}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default GaugeComponent;

