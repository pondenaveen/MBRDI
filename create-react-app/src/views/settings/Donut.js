import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

// Register ArcElement for the doughnut chart
Chart.register(ArcElement);

const DonutChart = ({ data, options, centerText }) => {
    // Custom plugin to draw text in the center of the doughnut chart
    const customPlugin = {
        id: 'centerText',
        beforeDraw: (chart) => {
            const { width, height, ctx } = chart;
            ctx.restore();

            // Set up font size relative to chart size
            const fontSize = (height / 8).toFixed(2); // Adjust the size if necessary
            ctx.font = `${fontSize}px sans-serif`;
            ctx.fillStyle = '#000'; // Ensure text color is black
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center'; // Center text alignment

            // Get center text and draw it in the middle of the donut
            const text = centerText;
            const textX = width / 2; // Center X
            const textY = height / 2; // Center Y

            // Draw the text
            ctx.fillText(text, textX, textY);
            ctx.save();
        },
    };

    // Extend the options to include the custom plugin
    const extendedOptions = {
        ...options,
        plugins: {
            ...options.plugins,
            centerText: customPlugin, // Ensure the plugin is added
        },
    };

    return <Doughnut data={data} options={extendedOptions} />;
};

export default DonutChart;
