import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
} from '@mui/x-charts/Gauge';

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    height: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
}));

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

const GaugeTicks = () => {
    const { outerRadius, startAngle, endAngle, cx, cy } = useGaugeState();
    const numTicks = 10;
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

const Overall = ({ pointerColor = 'black' }) => {
    const [overallValue, setOverallValue] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            const newValue = Math.floor(Math.random() * 501); // Changed upper limit to 500
            setOverallValue(newValue);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Function to get color based on overallValue
    const getColorByValue = (value) => {
        if (value <= 50) return 'green';
        if (value <= 100) return 'rgb(165, 244, 8)';
        if (value <= 150) return 'orange';
        if (value <= 200) return 'red';
        if (value <= 300) return 'rgb(97, 4, 97)';
        return 'rgb(60, 5, 60)'; // Hazardous
    };

    const gaugeColor = getColorByValue(overallValue);

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
                        fontSize: '18px',
                        mt: 1,
                        padding: '6px',
                        backgroundColor: 'rgb(180, 254, 180)',
                        textAlign: 'center',
                        width: '90%',
                        borderRadius: '4px',
                        display: 'block',
                    }}
                >
                    OutDoor Air Quality Index
                </Typography>

                <Box
                    sx={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 1,
                    }}
                >
                    <GaugeContainer
                        width={320}
                        height={290}
                        startAngle={-150} // Start angle for the gauge
                        endAngle={150}    // End angle for the gauge
                        value={overallValue}
                        valueMax={500}    // Maximum value
                    >
                        <GaugeReferenceArc thickness={15} color="rgba(0, 0, 0, 0.1)" />
                        <GaugeValueArc thickness={15} sx={{ fill: gaugeColor }} />
                        <GaugeTicks />
                        <GaugePointer color={pointerColor} />
                    </GaugeContainer>
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                marginTop: '260px',
                                color: 'black',
                                fontSize: '34px',
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                            }}
                        >
                            {overallValue}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        color: 'red',
                        fontSize: '18px',
                        mt: 2,
                        fontWeight: 'bold',
                        padding: '6px',
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

export default Overall;
