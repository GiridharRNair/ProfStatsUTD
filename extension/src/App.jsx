import React, { useState } from 'react';
import axios from 'axios';
import {
  Stack,
  Input,
  Button,
  useToast,
  Box,
} from '@chakra-ui/react';
import GithubIcon from './components/GithubIcon.jsx';
import ProfResults from './components/ProfResults.jsx';
import { defaultRating, defaultGrades } from '../data/defaultData.js';
import './styles/App.css';

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const toast = useToast();
  const [teacherName, setTeacherName] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateMyProfessorRating, setRateMyProfessorRating] = useState(defaultRating);
  const [gradeDistribution, setGradeDistribution] = useState(defaultGrades);


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

  return (
    <Box>
      <GithubIcon />
      <Stack pt={2} spacing={2} width={300} align="center">
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
          <ProfResults
            rateMyProfessorRating={rateMyProfessorRating}
            gradeDistribution={gradeDistribution}
          />
        )}
      </Stack>
    </Box>
  );
}

export default App;
