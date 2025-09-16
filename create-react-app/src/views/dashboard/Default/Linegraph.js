import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import api from './../../../api.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ChartDataLabels);

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    height: '300px',
    borderRadius: '4px',
}));

const orderedWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Linegraph = () => {
    const [data, setData] = useState([]);
    const [hourlyData, setHourlyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeFrame, setTimeFrame] = useState('hourly');

    const fetchData = async () => {
        try {
            const weeklyResponse = await api.get('/integration/week/entry/');
            const weeklyData = weeklyResponse.data;

            const formattedWeeklyData = Object.entries(weeklyData).map(([day, { AQI }]) => ({
                date: day,
                count: AQI !== null ? AQI : 0,
            }));

            const sortedWeeklyData = formattedWeeklyData.sort((a, b) => orderedWeekdays.indexOf(a.date) - orderedWeekdays.indexOf(b.date));
            setData(sortedWeeklyData);

            const hourlyResponse = await api.get('/integration/aqi-hourly-data');
            setHourlyData(hourlyResponse.data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching AQI data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const chartData = timeFrame === 'weekly' && data.length > 0 ? {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Air Quality Index (Weekly)',
                data: data.map(item => item.count),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 2,
            },
        ],
    } : timeFrame === 'hourly' && hourlyData ? {
        labels: Array.from({ length: Object.keys(hourlyData).length }, (_, i) => (i + 1).toString()),
        datasets: [
            {
                label: 'Air Quality Index (Hourly)',
                data: Object.values(hourlyData).map(val => val !== "No data" ? parseFloat(val) : 0),
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointRadius: 2,
            },
        ],
    } : { labels: [], datasets: [] };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: timeFrame === 'weekly' ? 'Days' : 'Hours',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'AQI',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `AQI: ${tooltipItem.raw}`,
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    return (
        <>
            {loading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: -1 }}>
                            <Typography sx={{ color: 'black', fontSize: '16px', mb: 1, textAlign: 'start' }}>
                                {timeFrame === 'weekly' ? 'Air Quality Index Per Week' : 'Air Quality Index Per Hour'}
                            </Typography>
                            <Select
                                value={timeFrame}
                                onChange={(event) => setTimeFrame(event.target.value)}
                                sx={{
                                    marginLeft: 2,
                                    height: '20px',
                                    '& .MuiSelect-select': {
                                        borderRadius: '4px',
                                    },
                                }}
                                inputProps={{
                                    style: {
                                        borderRadius: '4px',
                                    },
                                }}
                            >
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="hourly">Hourly</MenuItem>
                            </Select>
                        </Box>

                        <Box sx={{ flex: 1, width: '100%' }}>
                            <div style={{ width: '100%', height: '100%' }}>
                                <Line data={chartData} options={options} />
                            </div>
                        </Box>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

export default Linegraph;
