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
import RenderRatingCircle from './RatingCircles.jsx';
import { Bar } from "react-chartjs-2";
import PropTypes from 'prop-types';
import { gradeMappings, colorMap } from '../../utils/defaults.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

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

function ProfResults({ professorInfo }) {
    const { name, department, id, subject, course_number, tags, rating, difficulty, would_take_again, grades } = professorInfo;
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode } = useColorMode();

    const gradeLabels = Object.keys(grades).map((grade) => gradeMappings[grade] || grade)
      
    const chartData = {
        labels: gradeLabels,
        datasets: [{
            data: Object.values(grades),
            backgroundColor: gradeLabels.map(label => colorMap[label]),
        }],
    };
    
    const options = {
        plugins: {
            tooltip: {
                enabled: true,
                mode: "nearest",
                intersect: true,
                backgroundColor: colorMode === 'light' ? 'rgba(240, 240, 240, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                callbacks: {
                    label: (context) => [
                        `Students: ${context.parsed.y}`,
                        `Percentage: ${((context.parsed.y / Object.values(grades).reduce((acc, count) => acc + count, 0)) * 100).toFixed(2)}%`,
                    ],
                },
                titleColor: () => {
                    return colorMode === 'light' ? 'black' : 'white';
                },
                bodyColor: () => {
                    return colorMode === 'light' ? 'black' : 'white';
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
            <ChakraTooltip label='More Information?' placement='bottom'>
                <Text fontSize="lg" _hover={{ color: '#3182CE' }} onClick={onOpen}>
                    {name}
                </Text>
            </ChakraTooltip>

            <Text fontSize="md">{department}</Text>

            <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size='md'>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>
                        <VStack>
                            <Button 
                                leftIcon={<Image src='extension-images/RMPIcon.png' height={46}/>} width={240} 
                                onClick={() => (window.open(`https://www.ratemyprofessors.com/professor/${id}`, '_blank'))}>
                                Rate My Professor
                            </Button>
                            <Button 
                                leftIcon={<Image src='extension-images/UTDGradesIcon.png' height={22} />} width={240} 
                                onClick={() => (window.open(`https://utdgrades.com/results?search=${subject ? subject : '%20'}+${course_number ? course_number : '%20'}+${name.split(" ")[0]}+${name.split(" ")[1]}`, '_blank'))}>
                                UTD Grades
                            </Button>
                            <Button 
                                leftIcon={<Image src='extension-images/UTDIcon.png' height={25}/>} width={240} 
                                onClick={() => (window.open(`https://profiles.utdallas.edu/browse?search=${name.split(" ")[0]}+${name.split(" ")[1]}`, '_blank'))}>
                                UTD Profile
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </ Drawer>

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

            <HStack w={250}>
                {RenderRatingCircle('Quality', rating)}
                <Spacer />
                {RenderRatingCircle('Difficulty', difficulty)}
                <Spacer />
                {RenderRatingCircle('Enjoyment', would_take_again)}
            </HStack>

            <Bar data={chartData} options={options}/>
        </VStack>
    )
}

export default ProfResults