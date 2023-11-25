import React from 'react';
import { Bar } from "react-chartjs-2";
import {
    Text,
    HStack,
    VStack,
    Spacer,
    Link,
    Tooltip as ChakraTooltip,
    CircularProgress,
    CircularProgressLabel,
} from '@chakra-ui/react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip,
} from "chart.js";
import { gradeMappings, colorMap } from '../../data/gradeMappings.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function ProfResults({ rateMyProfessorRating, gradeDistribution }) {

    const renderRateMyProfessorRating = (label, value) => {
        let color;
        if (label === 'Difficulty') {
            color = `hsl(${((5 - value) / 5) * 100}, 90%, 50%)`;
        } else {
            color = value <= 5 ? `hsl(${(value / 5) * 100}, 90%, 50%)` : `hsl(${(value / 100) * 100}, 90%, 50%)`;
        }
      
        return (
          <VStack>
            <Text>{label}</Text>
            <CircularProgress size='60px' thickness='10px' value={(value <= 5) ? ((value / 5) * 100) : value} color={color}>
                <CircularProgressLabel>{value}</CircularProgressLabel>
            </CircularProgress>
          </VStack>
        );
    };
    
    const getColors = (labels) => {
        return labels.map(label => colorMap[label]);
    };
      
    const chartData = {
        labels: Object.keys(gradeDistribution).map(grade => gradeMappings[grade] || grade),
        datasets: [{
            data: Object.values(gradeDistribution),
            backgroundColor: getColors(Object.keys(gradeDistribution).map(grade => gradeMappings[grade] || grade)),
        }],
    };
    
    const options = {
        plugins: {
            tooltip: {
                enabled: true,
                mode: "nearest",
                intersect: true,
                callbacks: {
                    label: (context) => {
                        const count = context.parsed.y;
                        return [
                        `Students: ${count}`,
                        `Percentage: ${((count / Object.values(gradeDistribution).reduce((acc, count) => acc + count, 0)) * 100).toFixed(2)}%`,
                        ];
                    },
                },
            },
        },
    };


    return (
        <VStack>
            <ChakraTooltip label='Go to Rate My Professor Profile?' placement='bottom'>
            <Text fontSize="2xl" _hover={{ color: '#3182CE' }}>
                <Link href={`https://www.ratemyprofessors.com/professor/${rateMyProfessorRating.id}`} target="_blank">
                    {rateMyProfessorRating.name}
                </Link>
            </Text>
            </ChakraTooltip>
            <Text fontSize="xl">{rateMyProfessorRating.department}</Text>
            <HStack width={300}>
            {renderRateMyProfessorRating('Quality', rateMyProfessorRating.rating)}
            <Spacer />
            {renderRateMyProfessorRating('Difficulty', rateMyProfessorRating.difficulty)}
            <Spacer />
            {renderRateMyProfessorRating('Enjoyment', rateMyProfessorRating.would_take_again)}
            </HStack>
            {chartData.labels.length > 0 && (
                <Bar data={chartData} options={options}/>
            )}
        </VStack>
    )
}

export default ProfResults