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
//     const numTicks = 30; // Number of ticks
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

// const GaugeLabels = () => {
//     const { outerRadius, startAngle, endAngle, cx, cy } = useGaugeState();
//     const numLabels = 11; // Number of labels (0 to 500 in steps of 50)
//     const labelInterval = 50; // Label interval
//     const labels = [];

//     for (let i = 0; i <= numLabels; i++) {
//         const value = i * labelInterval;
//         const angle = startAngle + (i / numLabels) * (endAngle - startAngle);
//         const sin = Math.sin(angle);
//         const cos = Math.cos(angle);

//         const x = cx + (outerRadius + 20) * sin; // Position labels slightly outside the gauge
//         const y = cy - (outerRadius + 20) * cos;

//         labels.push(
//             <text key={i} x={x} y={y} fill="black" fontSize="12" textAnchor="middle" alignmentBaseline="middle">
//                 {value}
//             </text>
//         );
//     }

//     // Add the specific "250" label above the gauge
//     const specialLabelY = cy - (outerRadius + 40); // Adjust this value for the exact position
//     const specialLabelX = cx; // Centered above the gauge
//     labels.push(
//         <text key="special-250" x={specialLabelX} y={specialLabelY} fill="black" fontSize="14" textAnchor="middle">
//             250
//         </text>
//     );

//     return <g>{labels}</g>;
// };

// const GaugeIAQ = ({ pointerColor = 'red', initialValue }) => {
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
//                 marginTop: '-10px',
//             }}
//         >
//             <GaugeContainer
//                 width={720}
//                 height={440}
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
//                 <GaugeLabels /> {/* Add the labels here */}
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
//                             fontSize: '26px',
//                             fontWeight: 'bold',
//                             marginTop: '340px',
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
//                             fontSize: '54px',
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

// export default GaugeIAQ;

import React, { useEffect, useState } from 'react';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState } from '@mui/x-charts/Gauge';
import { Box, Typography } from '@mui/material';

// Define the color ranges
const colorRanges = [
    { status: 'Good', color: 'green', min: 0, max: 50 },
    { status: 'Moderate', color: 'rgb(165, 244, 8)', min: 51, max: 100 },
    { status: 'Unhealthy if Sensitive', color: 'orange', min: 101, max: 150 },
    { status: 'Unhealthy', color: 'red', min: 151, max: 200 },
    { status: 'Very Unhealthy', color: 'rgb(97, 4, 97)', min: 201, max: 300 },
    { status: 'Hazardous', color: 'rgb(60, 5, 60)', min: 301, max: 500 },
];

// Function to determine color based on overall value
const getColorForValue = (value) => {
    const range = colorRanges.find((range) => value >= range.min && value <= range.max);
    return range ? range.color : 'black'; // Default color if out of range
};

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
    const numTicks = 30; // Number of ticks
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

const GaugeLabels = () => {
    const { outerRadius, startAngle, endAngle, cx, cy } = useGaugeState();
    const numLabels = 11; // Number of labels (0 to 500 in steps of 50)
    const labelInterval = 50; // Label interval
    const labels = [];

    for (let i = 0; i <= numLabels; i++) {
        const value = i * labelInterval;
        const angle = startAngle + (i / numLabels) * (endAngle - startAngle);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const x = cx + (outerRadius + 20) * sin; // Position labels slightly outside the gauge
        const y = cy - (outerRadius + 20) * cos;

        labels.push(
            <text key={i} x={x} y={y} fill="black" fontSize="12" textAnchor="middle" alignmentBaseline="middle">
                {value}
            </text>
        );
    }

    // Add the specific "250" label above the gauge
    const specialLabelY = cy - (outerRadius + 40); // Adjust this value for the exact position
    const specialLabelX = cx; // Centered above the gauge
    labels.push(
        <text key="special-250" x={specialLabelX} y={specialLabelY} fill="black" fontSize="14" textAnchor="middle">
            250
        </text>
    );

    return <g>{labels}</g>;
};

const GaugeIAQ = ({ pointerColor = 'red', initialValue }) => {
    const [overallValue, setOverallValue] = useState(initialValue);

    useEffect(() => {
        setOverallValue(initialValue);
    }, [initialValue]);

    const gaugeColor = getColorForValue(overallValue); // Get the color based on the current value

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-100px',
            }}
        >
            <GaugeContainer
                width={480}
                height={260}
                startAngle={-150}
                endAngle={150}
                value={overallValue}
                valueMax={500}
            >
                <GaugeReferenceArc thickness={15} color="rgba(0, 0, 0, 0.1)" />
                <GaugeValueArc thickness={15} sx={{ fill: gaugeColor }} /> {/* Use the determined color */}
                <GaugeTicks />
                <GaugePointer color={pointerColor} />
                <GaugeLabels /> {/* Add the labels here */}
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
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginTop: '240px',
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

export default GaugeIAQ;
