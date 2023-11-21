import React, { useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';
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
  Link
} from '@chakra-ui/react';
import { gradeMappings } from '../data/gradeMappings.js';
import './styles/App.css';

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const toast = useToast();
  const [teacherName, setTeacherName] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateMyProfessorRating, setRateMyProfessorRating] = useState(null);
  const [gradeDistribution, setGradeDistribution] = useState([]);

  const showToast = (status, description) => {
    toast({
      title: status,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
    });
  };

  const fetchData = async () => {
    setLoading(true);
  
    try {
      const ratingsResponse = await axios.get(`${API_URL}/ratings?teacher=${teacherName}`);
      setRateMyProfessorRating(ratingsResponse.data);
      
      try {
        if (ratingsResponse.data) {
          const gradesResponse = await axios.get(`${API_URL}/grades?teacher=${ratingsResponse.data.name}&course=${course}`);
          setGradeDistribution(gradesResponse.data);
        } else {
          setGradeDistribution([]);
          showToast('error', 'No grades found');
        }
      } catch (error) {
        setGradeDistribution([]);
        showToast('error', 'No grades found');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setRateMyProfessorRating(null);
      setGradeDistribution([]);
      showToast('error', 'No data found');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = () => {
    if (!teacherName) {
      showToast('error', 'Teacher name is required');
      return;
    }

    fetchData();
  };

  const renderRateMyProfessorRating = (label, value) => (
    <VStack>
      <Text>{label}</Text>
      <CircularProgress size='60px' thickness='10px' value={(value <= 5) ? ((value / 5) * 100) : value}>
        <CircularProgressLabel>{value}</CircularProgressLabel>
      </CircularProgress>
    </VStack>
  );

  const chartData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    name: gradeMappings[grade],
    count: count,
  }));

  return (
    <Stack spacing={2} width={300} align="center">
      <Input
        required
        placeholder="Enter Teacher Name ex. Jey Veerasamy"
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
        <VStack paddingTop={2}>
          <Text fontSize="2xl" _hover={{ color: '#3182CE' }}>
            <Link href={`https://www.ratemyprofessors.com/professor/${rateMyProfessorRating.id}`} target="_blank">
              {rateMyProfessorRating.name}
            </Link>
          </Text>
          <Text fontSize="xl">{rateMyProfessorRating.department}</Text>
          <HStack width={300}>
            {renderRateMyProfessorRating('Rating', rateMyProfessorRating.rating)}
            <Spacer />
            {renderRateMyProfessorRating('Difficulty', rateMyProfessorRating.difficulty)}
            <Spacer />
            {renderRateMyProfessorRating('Enjoyment?', rateMyProfessorRating.would_take_again)}
          </HStack>
          {chartData.length > 0 && (
            <BarChart width={300} height={150} data={chartData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="count" fill="#3182CE" />
            </BarChart>
          )}
        </VStack>
      )}
    </Stack>
  );
}

export default App;
