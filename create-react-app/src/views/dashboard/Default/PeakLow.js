import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { Scatter } from 'react-chartjs-2';
import {
    Chart,
    registerables,
    Title,
    Tooltip,
    Legend,
    LinearScale,
    PointElement,
    LineElement,
    CategoryScale,
    TimeScale,
} from 'chart.js';
import api from './../../../api.js'; // Adjust import based on your project structure
import 'chartjs-adapter-date-fns'; // Import the date adapter

// Register all necessary components
Chart.register(...registerables, Title, Tooltip, Legend, LinearScale, PointElement, LineElement, CategoryScale, TimeScale);

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    height: '420px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
}));

const PeakLow = () => {
    const [chartData, setChartData] = useState({ datasets: [] });

    const fetchKPIData = async () => {
        try {
            const response = await api.get('/integration/kpi/peak-low'); // Your endpoint
            const data = response.data;

            // Prepare data for peak values
            const peakData = Object.entries(data.peak).map(([metric, { timestamp }]) => ({
                x: new Date(timestamp),
                y: metric, // Use the metric name for the y-axis
                r: 10, // Radius for peak points
            }));

            // Prepare data for low values
            const lowData = Object.entries(data.low).map(([metric, { timestamp }]) => ({
                x: new Date(timestamp),
                y: metric, // Use the metric name for the y-axis
                r: 5, // Radius for low points
            }));

            // Set chart data
            setChartData({
                datasets: [
                    {
                        label: 'Peak Values',
                        data: peakData,
                        backgroundColor: 'rgba(75, 192, 192, 1)', // Color for peak values
                        type: 'bubble', // Bubble chart type
                    },
                    {
                        label: 'Low Values',
                        data: lowData,
                        backgroundColor: 'rgba(255, 99, 132, 1)', // Color for low values
                        type: 'bubble', // Bubble chart type
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching KPI data:', error);
        }
    };

    useEffect(() => {
        fetchKPIData();
    }, []);

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute', // Adjust based on your data
                },
                title: {
                    display: true,
                    text: 'Timestamp',
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10, // Adjust for better readability
                },
            },
            y: {
                type: 'category', // Change to category to display metric names
                title: {
                    display: true,
                    text: 'Metrics',
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw.y}`,
                },
            },
        },
    };

    return (
        <CardWrapper border={false} content={false}>
            <Box sx={{ p: 2.25, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ color: 'black', fontSize: '20px', mb: 1, textAlign: 'start' }}>
                    Air Quality Metrics
                </Typography>
                <Box sx={{ flex: 1, width: '100%' }}>
                    <Scatter data={chartData} options={options} />
                </Box>
            </Box>
        </CardWrapper>
    );
};

export default PeakLow;
