import { useColorModeValue } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import PropTypes from "prop-types";
import { gradeMappings, colorMap } from "../../utils/defaults.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function GradesGraph({ grades, subject, course_number }) {
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
                titleColor: useColorModeValue("black", "white"),
                bodyColor: useColorModeValue("black", "white"),
                callbacks: {
                    label: (context) => {
                        const tooltipLines = [];
                        if (subject && course_number) {
                            tooltipLines.push(`${subject} ${course_number}`);
                        }
                        tooltipLines.push(`Students: ${context.parsed.y}`);
                        tooltipLines.push(
                            `Percentage: ${((context.parsed.y / Object.values(grades).reduce((acc, count) => acc + count, 0)) * 100).toFixed(2)}%`,
                        );
                        return tooltipLines;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { color: useColorModeValue("rgb(245, 245, 245)", "#2D3748") },
                ticks: {
                    color: useColorModeValue("#2D3748", "white"),
                    maxRotation: 0,
                    maxTicksLimit: 12,
                },
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
    subject: PropTypes.string,
    course_number: PropTypes.string,
};

export default GradesGraph;
