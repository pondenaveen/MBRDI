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
//             }}
//         >
//             <GaugeContainer
//                 width={220}
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
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                 }}
//             >
//                 <Typography
//                     sx={{
//                         color: 'black',
//                         fontSize: '34px',
//                         fontWeight: 'bold',
//                         marginTop: '160px',
//                         // textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
//                     }}
//                 >
//                     {overallValue}
//                 </Typography>
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

const GaugeComponent = ({ pointerColor = 'red', initialValue }) => {
    const [overallValue, setOverallValue] = useState(initialValue);

    useEffect(() => {
        setOverallValue(initialValue);
    }, [initialValue]);

    const getGaugeColor = (value) => {
        if (value <= 50) return 'green';
        if (value <= 100) return 'rgb(165, 244, 8)';
        if (value <= 150) return 'orange';
        if (value <= 200) return 'red';
        if (value <= 300) return 'rgb(97, 4, 97)';
        return 'rgb(60, 5, 60)'; // Hazardous
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt:-2
            }}
        >
            <GaugeContainer
                width={130}
                height={150}
                startAngle={-150}
                endAngle={150}
                value={overallValue}
                valueMax={500}
            >
                <GaugeReferenceArc thickness={15} color="rgba(0, 0, 0, 0.1)" />
                <GaugeValueArc thickness={15} sx={{ fill: getGaugeColor(overallValue) }} />
                <GaugeTicks />
                <GaugePointer color={pointerColor} />
            </GaugeContainer>
            <Box
                sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    sx={{
                        color: 'black',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginTop: '60px',
                    }}
                >
                    {overallValue}
                </Typography>
            </Box>
        </Box>
    );
};

export default GaugeComponent;
