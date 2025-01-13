import { useColorModeValue } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import PropTypes from "prop-types";

const GRADE_MAPPINGS = {
    aPlus: "A+",
    a: "A",
    aMinus: "A-",
    bPlus: "B+",
    b: "B",
    bMinus: "B-",
    cPlus: "C+",
    c: "C",
    cMinus: "C-",
    dPlus: "D+",
    d: "D",
    dMinus: "D-",
    f: "F",
    cr: "CR",
    nc: "NC",
    p: "P",
    w: "W",
    i: "I",
    nf: "NF",
};

const COLOR_MAP = {
    "A+": "rgb(45, 179, 63)",
    A: "rgb(48, 199, 55)",
    "A-": "rgb(107, 212, 15)",
    "B+": "rgb(147, 209, 13)",
    B: "rgb(205, 255, 79)",
    "B-": "rgb(255, 225, 77)",
    "C+": "rgb(255, 208, 54)",
    C: "rgb(255, 173, 51)",
    "C-": "rgb(255, 112, 77)",
    "D+": "rgb(245, 24, 169)",
    D: "rgb(160, 30, 86)",
    "D-": "rgb(117, 14, 58)",
    F: "rgb(216, 10, 55)",
    CR: "rgb(102, 102, 102)",
    NC: "rgb(102, 102, 102)",
    P: "rgb(102, 102, 102)",
    W: "rgb(102, 102, 102)",
    I: "rgb(102, 102, 102)",
    NF: "rgb(102, 102, 102)",
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function GradesGraph({ grades, subject, course_number }) {
    const gradeLabels = Object.keys(grades).map((grade) => GRADE_MAPPINGS[grade] || grade);

    const chartData = {
        labels: gradeLabels,
        datasets: [
            {
                data: Object.values(grades),
                backgroundColor: gradeLabels.map((label) => COLOR_MAP[label]),
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
