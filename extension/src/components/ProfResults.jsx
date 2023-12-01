/* *
* ProfResults component
*
* This component is responsible for rendering the professor results fetched from the backend API.
* It renders the professor's name, department, tags, ratings, and grade distribution.
*/

import React from 'react';
import { Bar } from "react-chartjs-2";
import { gradeMappings, colorMap } from '../../data/data.js';
import {
    Text,
    HStack,
    VStack,
    Spacer,
    Tag,
    Wrap,
    WrapItem,
    Tooltip as ChakraTooltip,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    Button,
    CircularProgress,
    CircularProgressLabel,
    useDisclosure,
    Image,
    useColorMode
} from '@chakra-ui/react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip,
} from "chart.js";


// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function ProfResults({ professorInfo }) {
    const { name, department, id, subject, course_number, tags, rating, difficulty, would_take_again, grades } = professorInfo;
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode } = useColorMode();

    /**
     * Render rating information with circular progress bars.
     * @param {string} label - Rating label (e.g., Quality, Difficulty, Enjoyment).
     * @param {number} value - Rating value.
     * @returns {JSX.Element} - Circular progress bar component.
     */
    const renderRating = (label, value) => {
        let color;
        if (label === 'Difficulty') {
            color = `hsl(${((5 - value) / 5) * 100}, 90%, 50%)`;
        } else {
            color = value <= 5 ? `hsl(${(value / 5) * 100}, 90%, 50%)` : `hsl(${(value / 100) * 100}, 90%, 50%)`;
        }
      
        return (
          <VStack>
            <Text>{label}</Text>
            <CircularProgress 
                size='55px' 
                thickness='10px' 
                value={(value <= 5) ? ((value / 5) * 100) : value} 
                color={color}
            >
                <CircularProgressLabel>{value}</CircularProgressLabel>
            </CircularProgress>
          </VStack>
        );
    };

    
    /**
     * Get colors based on provided labels using a color map from the data directory.
     * @param {string[]} labels - Array of labels.
     * @returns {string[]} - Array of corresponding colors.
     */
    const getColors = (labels) => { return labels.map(label => colorMap[label]) };

    const gradeLabels = Object.keys(grades).map((grade) => gradeMappings[grade] || grade);
      
    const chartData = {
        labels: gradeLabels,
        datasets: [{
            data: Object.values(grades),
            backgroundColor: getColors(gradeLabels),
        }],
    };
    
    const options = {
        plugins: {
            tooltip: {
                enabled: true,
                mode: "nearest",
                intersect: true,
                callbacks: {
                    label: (context) => [
                        `Students: ${context.parsed.y}`,
                        `Percentage: ${((context.parsed.y / Object.values(grades).reduce((acc, count) => acc + count, 0)) * 100).toFixed(2)}%`,
                    ],
                },
            },
        },
        scales: {
            x: { grid: { color: colorMode === 'light' ? 'rgb(245, 245, 245)' : "#2D3748" }, ticks: { color: colorMode === 'light' ? '#2D3748' : 'white' } },
            y: { grid: { color: colorMode === 'light' ? 'rgb(245, 245, 245)' : "#2D3748" }, ticks: { color: colorMode === 'light' ? '#2D3748' : 'white' } },
        }
    };

    return (
        <VStack width={325}>
            {/* Professor name with tooltip for additional information */}
            <ChakraTooltip label='More Information?' placement='bottom'>
                <Text fontSize="lg" _hover={{ color: '#3182CE' }} onClick={onOpen}>
                    {name}
                </Text>
            </ChakraTooltip>

            {/* Display department information */}
            <Text fontSize="md">{department}</Text>

            {/* Modal for additional information */}
            <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size='md'>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>
                        {/* Buttons for external links */}
                        <VStack>
                            <Button leftIcon={<Image src='/RMPIcon.png' height={46}/>} width={240} onClick={() => (window.open(`https://www.ratemyprofessors.com/professor/${id}`, '_blank'))}>
                                Rate My Professor
                            </Button>
                            <Button leftIcon={<Image src='/UTDGradesIcon.png' height={22} />} width={240} onClick={() => (window.open(`https://utdgrades.com/results?search=${subject ? subject : '%20'}+${course_number ? course_number : '%20'}+${name.split(" ")[0]}+${name.split(" ")[1]}`, '_blank'))}>
                                UTD Grades
                            </Button>
                            <Button leftIcon={<Image src='/UTDIcon.png' height={25}/>} width={240} onClick={() => (window.open(`https://profiles.utdallas.edu/browse?search=${name.split(" ")[0]}+${name.split(" ")[1]}`, '_blank'))}>
                                UTD Proflile
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </ Drawer>

            {/* Display tags, if available */}
            {tags &&
                <Wrap justify={"center"}>
                    {tags.map((tag, index) => (
                        <WrapItem key={index}>
                            <Tag size="sm" variant="outline">
                                {tag}
                            </Tag>
                        </WrapItem>
                    ))}
                </Wrap>
            }

            {/* Display ratings using circular progress bars */}
            <HStack width={300}>
                {renderRating('Quality', rating)}
                <Spacer />
                {renderRating('Difficulty', difficulty)}
                <Spacer />
                {renderRating('Enjoyment', would_take_again)}
            </HStack>

            {/* Display grade distribution chart */}
            {chartData && <Bar data={chartData} options={options}/>}
        </VStack>
    )
}

export default ProfResults