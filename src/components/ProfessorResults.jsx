import { Text, HStack, VStack, Spacer, Tag, Wrap, WrapItem, Tooltip as ChakraTooltip, useDisclosure, useColorMode, Button } from "@chakra-ui/react";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import { gradeMappings, colorMap } from "../../utils/defaults.js";
import ProfessorDrawer from "./ProfessorDrawer.jsx";
import RenderRatingCircle from "./RatingCircles.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function ProfResults({ professorInfo }) {
    const { name, department, id, subject, course_number, tags, rating, difficulty, would_take_again, grades } = professorInfo;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode } = useColorMode();

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
                backgroundColor: colorMode === "light" ? "rgba(240, 240, 240, 0.8)" : "rgba(0, 0, 0, 0.8)",
                callbacks: {
                    label: (context) => [
                        `Students: ${context.parsed.y}`,
                        `Percentage: ${((context.parsed.y / Object.values(grades).reduce((acc, count) => acc + count, 0)) * 100).toFixed(2)}%`,
                    ],
                },
                titleColor: () => {
                    return colorMode === "light" ? "black" : "white";
                },
                bodyColor: () => {
                    return colorMode === "light" ? "black" : "white";
                },
            },
        },
        scales: {
            x: {
                grid: { color: colorMode === "light" ? "rgb(245, 245, 245)" : "#2D3748" },
                ticks: { color: colorMode === "light" ? "#2D3748" : "white" },
            },
            y: {
                grid: { color: colorMode === "light" ? "rgb(245, 245, 245)" : "#2D3748" },
                ticks: { color: colorMode === "light" ? "#2D3748" : "white" },
            },
        },
    };

    return (
        <VStack width={325}>
            <ChakraTooltip label="Click for more information" placement="bottom">
                <Button
                    fontSize="lg"
                    _hover={{ color: "#3182CE" }}
                    onClick={onOpen}
                    variant={"link"}
                    height={6}
                    onFocus={(e) => e.preventDefault()}
                    fontWeight={"normal"}
                    textColor={colorMode === "light" ? "black" : "white"}
                >
                    {name}
                </Button>
            </ChakraTooltip>

            <Text fontSize="md">{department}</Text>

            <ProfessorDrawer
                isOpen={isOpen}
                onClose={onClose}
                id={id}
                subject={subject}
                courseNumber={course_number}
                name={name}
                colorMode={colorMode}
            />

            {tags && (
                <Wrap justify={"center"}>
                    {tags.map((tag, index) => (
                        <WrapItem key={index}>
                            <Tag size="sm" variant="outline">
                                {tag}
                            </Tag>
                        </WrapItem>
                    ))}
                </Wrap>
            )}

            <HStack w={250}>
                {RenderRatingCircle("Quality", rating)}
                <Spacer />
                {RenderRatingCircle("Difficulty", difficulty)}
                <Spacer />
                {RenderRatingCircle("Enjoyment", would_take_again)}
            </HStack>

            <Bar data={chartData} options={options} />
        </VStack>
    );
}

ProfResults.propTypes = {
    professorInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        department: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        subject: PropTypes.string,
        course_number: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        rating: PropTypes.number.isRequired,
        difficulty: PropTypes.number.isRequired,
        would_take_again: PropTypes.number.isRequired,
        grades: PropTypes.object.isRequired,
    }).isRequired,
};

export default ProfResults;
