import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    CategoryScale,
    BarController,
    BarElement,
    LineController,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import api from './../../../api.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    CategoryScale,
    BarController,
    BarElement,
    LineController,
    ChartDataLabels
);

const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: 'white',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    height: '300px',
    borderRadius: '4px',
}));

const TempHum = () => {
    const [data, setData] = useState({
        temp: [],
        hum: [],
        comfortLevel: []
    });
    const [labels, setLabels] = useState([]);

    const fetchHourlyData = async () => {
        try {
            const response = await api.get('/integration/temp-hourly-data');
            const hourlyData = response.data;

            const temp = [];
            const hum = [];
            const comfortLevel = [];
            const labels = [];

            for (let i = 1; i <= 24; i++) {
                const hourKey = `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : 'th'} hour`;
                const values = hourlyData[hourKey];

                if (values && values.Temp !== undefined && values.Hum !== undefined) {
                    const temperature = values.Temp;
                    const humidity = values.Hum;

                    temp.push(temperature);
                    hum.push(humidity);
                    labels.push(`${i}`);

                    let comfort = 4;
                    if (temperature >= 20 && temperature <= 25 && humidity >= 40 && humidity <= 60) {
                        comfort = 1;
                    } else if (
                        (temperature > 25 && temperature < 30 && humidity >= 30 && humidity <= 70)
                    ) {
                        comfort = 2;
                    } else if (
                        (temperature < 20 || temperature > 30 || humidity < 30 || humidity > 70)
                    ) {
                        comfort = 3;
                    }

                    comfortLevel.push(comfort);
                }
            }

            setData({ temp, hum, comfortLevel });
            setLabels(labels);
        } catch (error) {
            console.error('Error fetching hourly data:', error);
        }
    };

    useEffect(() => {
        fetchHourlyData();
    }, []);

    const hasData = data.temp.length > 0 && data.hum.length > 0;

    const options = {
        responsive: true,
        layout: {
            padding: {
                top: 20,
                bottom: 40,
            },
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Hours',
                },
                ticks: {
                    autoSkip: false,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
                beginAtZero: true,
            },
            comfortY: {
                position: 'right',
                title: false,
                beginAtZero: true,
                ticks: {
                    display: false,
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'black',
                    generateLabels: (chart) => {
                        const originalLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);

                        return [
                            ...originalLabels,
                            {
                                text: 'Comfortable',
                                fillStyle: 'rgba(75, 192, 75, 0.1)',
                                hidden: false,
                                strokeStyle: 'rgba(75, 192, 75, 0.1)',
                                lineCap: 'round',
                                lineDash: [],
                                lineWidth: 2,
                                pointStyle: 'rectRounded',

                            },
                            // {
                            //     text: 'Moderate',
                            //     fillStyle: 'rgba(255, 255, 0, 0.8)',
                            //     hidden: false,
                            //     strokeStyle: 'rgba(255, 255, 0, 0.8)',
                            //     lineCap: 'round',
                            //     lineDash: [],
                            //     lineWidth: 2,
                            //     pointStyle: 'rectRounded',
                            // },
                            {
                                text: 'Uncomfortable',
                                fillStyle: 'rgba(255, 99, 132, 0.1)',
                                hidden: false,
                                strokeStyle: 'rgba(255, 99, 132, 0.1)',
                                lineCap: 'round',
                                lineDash: [],
                                lineWidth: 2,
                                pointStyle: 'rectRounded',
                            },
                        ];
                    },
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (tooltipItem) => {
                        const datasetIndex = tooltipItem.datasetIndex;
                        const value = tooltipItem.raw;

                        if (datasetIndex === 2) {
                            const labels = ['No Data', 'Comfortable', 'Moderate', 'Uncomfortable'];
                            const colors = ['gray', 'green', 'orange', 'red'];
                            const comfortLevel = data.comfortLevel[tooltipItem.dataIndex];
                            return `Comfort Level: ${labels[comfortLevel]} (${colors[comfortLevel]})`;
                        } else {
                            return `${tooltipItem.dataset.label}: ${value !== null ? value : 'No data'}`;
                        }
                    },
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    const chartDataCombined = {
        labels: labels,
        datasets: [
            {
                type: 'line',
                label: 'Temperature (°C)',
                data: data.temp,
                borderColor: '#d16014',
                backgroundColor: '#d16014',
                fill: false,
                pointRadius: 3,
            },
            {
                type: 'line',
                label: 'Humidity (%)',
                data: data.hum,
                borderColor: '#2274a5',
                backgroundColor: '#2274a5',
                fill: false,
                pointRadius: 3,
            },
            {
                type: 'bar',
                label: 'Moderate',
                data: new Array(data.comfortLevel.length).fill(1),
                backgroundColor: (context) => {
                    const index = context.dataIndex;
                    const comfortLevel = data.comfortLevel[index];
                    return comfortLevel === 1
                        ? 'rgba(75, 192, 75, 0.1)'
                        : comfortLevel === 2
                            ? 'rgba(248, 155, 41, 0.1)'
                            : comfortLevel === 3
                                ? 'rgba(255, 99, 132, 0.1)'  // Red for Uncomfortable with Transparent
                                : 'rgba(201, 203, 207, 0.1)'; // Gray for No Data with Transparent
                },
                yAxisID: 'comfortY',

            },
        ],
    };

    return (
        <CardWrapper border={false} content={false}>
            <Box sx={{ p: 2.25, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ color: 'black', fontSize: '16px', mb: 1, textAlign: 'start' }}>
                    Comfort Level (Temperature VS Humidity)
                </Typography>
                <Box sx={{ flex: 1 }}>
                    {hasData ? (
                        <>
                            <Line options={options} data={chartDataCombined} />
                        </>
                    ) : (
                        <Typography>No Data Available</Typography>
                    )}
                </Box>
            </Box>
        </CardWrapper>
    );
};

export default TempHum;
