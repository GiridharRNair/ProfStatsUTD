import React, { useState } from 'react';
import axios from 'axios';
import {
  Stack,
  Input,
  Button,
  useToast,
  Box,
} from '@chakra-ui/react';
import InfoIcon from './components/InfoIcon.jsx';
import ProfResults from './components/ProfResults.jsx';
import { defaultTeacher } from '../data/data.js';
import NotFoundPage from './components/NotFound.jsx';
import './styles/App.css';

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const toast = useToast();
  const [instructor, setInstructor] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [professorInfo, setProfessorInfo] = useState(defaultTeacher); 


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
      const ratingsResponse = await axios.get(`${API_URL}/professor_info?teacher=${instructor}&course=${course}`);
      setProfessorInfo(ratingsResponse.data);
      
      if (ratingsResponse.data.grades["No data found"] === 0) {
        showErrorToast('No data found');
      }
    } catch (error) {
      setProfessorInfo(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = () => {
    setInstructor(instructor.trim());
    if (!instructor.trim()) {
      showErrorToast('Teacher name is required');
      return;
    }

    fetchData();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Box onKeyDown={handleKeyDown}>
      <InfoIcon />
      <Stack pt={2} spacing={2} width={300} align="center">
        <Input
          height={8}
          placeholder="Enter Teacher Name ex. Jason Smith"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
        />
        <Input
          height={8}
          placeholder="Specify a Course? ex. CS 1337"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        <Button onClick={handleSubmit} isLoading={loading} height={8}>
          Submit
        </Button>
        {professorInfo ? (
          <ProfResults
            professorInfo={professorInfo}
          />
        ) : <NotFoundPage /> }
      </Stack>
    </Box>
  );
}

export default App;

if(typeof(String.prototype.trim) === "undefined")
{
  String.prototype.trim = function() 
  {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}
