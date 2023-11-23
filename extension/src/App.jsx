import React, { useState } from 'react';
import axios from 'axios';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Stack,
  Input,
  Button,
  Text,
  HStack,
  useToast,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  Spacer,
  Link,
  Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import { gradeMappings, colorMap } from '../data/gradeMappings.js';
import './styles/App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const toast = useToast();
  const [teacherName, setTeacherName] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateMyProfessorRating, setRateMyProfessorRating] = useState(null);
  const [gradeDistribution, setGradeDistribution] = useState([]);

  const showErrorToast = (description) => {
    toast({
      description: description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const fetchData = async () => {
    setLoading(true);
  
    try {
      const ratingsResponse = await axios.get(`${API_URL}/ratings?teacher=${teacherName}&course=${course}`);
      setRateMyProfessorRating(ratingsResponse.data);
      
      try {
        if (ratingsResponse.data) {
          const gradesResponse = await axios.get(`${API_URL}/grades?teacher=${ratingsResponse.data.name}&course=${course}`);
          setGradeDistribution(gradesResponse.data);
        } else {
          setGradeDistribution([]);
          showErrorToast('No grades found');
        }
      } catch (error) {
        setGradeDistribution([]);
        showErrorToast('No grades found');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setRateMyProfessorRating(null);
      setGradeDistribution([]);
      showErrorToast('No data found');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = () => {
    if (!teacherName) {
      showErrorToast('Teacher name is required');
      return;
    }

    fetchData();
  };

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
    <Stack spacing={2} width={300} align="center">
      <Input
        required
        placeholder="Enter Teacher Name ex. Jason Smith"
        value={teacherName}
        onChange={(e) => setTeacherName(e.target.value)}
      />
      <Input
        placeholder="Specify a Course? ex. CS 1337"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
      <Button onClick={handleSubmit} isLoading={loading}>
        Submit
      </Button>

      {rateMyProfessorRating && (
        <VStack>
          <ChakraTooltip label='Go to Rate My Professor Profile?' placement='bottom'>
            <Text fontSize="2xl" _hover={{ color: '#3182CE' }}>
              <Link href={`https://www.ratemyprofessors.com/professor/${rateMyProfessorRating.id}`} target="_blank">
                {rateMyProfessorRating.name}
              </Link>
            </Text>
          </ChakraTooltip>
          <Text fontSize="xl" paddingBottom={1}>{rateMyProfessorRating.department}</Text>
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
      )}
    </Stack>
  );
}

export default App;
