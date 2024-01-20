import { useColorModeValue } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import PropTypes from "prop-types";
import { gradeMappings, colorMap } from "../../utils/defaults.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function GradesGraph({ grades }) {
    const gradeLabels = Object.keys(grades).map((grade) => gradeMappings[grade] || grade);

    const chartData = {
        labels: gradeLabels,
        datasets: [
            {
                data: Object.values(grades),
                backgroundColor: gradeLabels.map((label) => colorMap[label]),
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: true,
                mode: "nearest",
                intersect: true,
                backgroundColor: useColorModeValue("rgba(240, 240, 240, 0.8)", "rgba(0, 0, 0, 0.8)"),
                callbacks: {
                    label: (context) => [
                        `Students: ${context.parsed.y}`,
                        `Percentage: ${((context.parsed.y / Object.values(grades).reduce((acc, count) => acc + count, 0)) * 100).toFixed(2)}%`,
                    ],
                },
                titleColor: useColorModeValue("black", "white"),
                bodyColor: useColorModeValue("black", "white"),
            },
        },
        scales: {
            x: {
                grid: { color: useColorModeValue("rgb(245, 245, 245)", "#2D3748") },
                ticks: { color: useColorModeValue("#2D3748", "white") },
            },
            y: {
                grid: { color: useColorModeValue("rgb(245, 245, 245)", "#2D3748") },
                ticks: { display: false },
                border: { display: false },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}

GradesGraph.propTypes = {
    grades: PropTypes.object.isRequired,
};

export default GradesGraph;
