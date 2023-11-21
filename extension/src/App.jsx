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
  Spacer
} from '@chakra-ui/react';
import { gradeMappings } from '../data/gradeMappings.js';
import './styles/App.css';

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
      const ratingsResponse = await axios.get(`http://0.0.0.0:5000/ratings?teacher=${teacherName}`);
      const gradesResponse = await axios.get(`http://0.0.0.0:5000/grades?teacher=${ratingsResponse.data.name}&course=${course}`);

      setRateMyProfessorRating(ratingsResponse.data);
      setGradeDistribution(gradesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      showToast('error', 'No data found for teacher or course');
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
    <Stack spacing={2} width={400} align="center">
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
          <Text fontSize="2xl">{rateMyProfessorRating.name}</Text>
          <Text fontSize="xl">{rateMyProfessorRating.department}</Text>
          <HStack width={400}>
            {renderRateMyProfessorRating('Rating', rateMyProfessorRating.rating)}
            <Spacer />
            {renderRateMyProfessorRating('Difficulty', rateMyProfessorRating.difficulty)}
            <Spacer />
            {renderRateMyProfessorRating('Enjoyment?', rateMyProfessorRating.would_take_again)}
          </HStack>
          <BarChart width={400} height={150} data={chartData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="count" fill="#3182CE" />
          </BarChart>
        </VStack>
      )}
    </Stack>
  );
}

export default App;
