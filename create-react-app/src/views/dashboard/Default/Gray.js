import React, { useEffect, useState } from 'react';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState } from '@mui/x-charts/Gauge';
import { Box, Typography } from '@mui/material';

const GaugePointer = ({ color, disabled }) => {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();
    if (valueAngle === null) return null;

    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };

    return (
        <g>
            <circle cx={cx} cy={cy} r={7} fill={disabled ? 'gray' : color} />
            <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke={disabled ? 'gray' : color} strokeWidth={4} />
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

const Gray = ({ pointerColor = 'red', initialValue, disabled = false }) => {
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
                mt:-2
            }}
        >
            <GaugeContainer
            width={130}
            height={150}
                startAngle={-150}
                endAngle={150}
                value={overallValue}
            >
                <GaugeReferenceArc thickness={15} color="rgba(0, 0, 0, 0.1)" />
                <GaugeValueArc thickness={15} sx={{ fill: disabled ? 'gray' : 'gray' }} />
                <GaugeTicks />
                <GaugePointer color={pointerColor} disabled={disabled} />
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
                        color: disabled ? 'gray' : 'black',

                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginTop: '60px',
                        textShadow: disabled ? 'none' : '2px 2px 4px rgba(0,0,0,0.4)',
                    }}
                >
                    {overallValue}
                </Typography>
            </Box>
        </Box>
    );
};

export default Gray;
