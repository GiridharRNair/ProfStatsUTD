/**
 * Main component for the extension popup. Holds logic for fetching data from the API and rendering the results.
 */

import React, { useState } from 'react';
import { defaultTeacher } from '../data/data.js';
import { Stack, Input, Button, useToast, Box } from '@chakra-ui/react';
import InfoIcon from './components/InfoIcon.jsx';
import ProfResults from './components/ProfResults.jsx';
import NotFoundPage from './components/NotFound.jsx';
import axios from 'axios';
import './styles/App.css';


const API_URL = import.meta.env.VITE_API_URL

function App() {
  const toast = useToast();
  const [instructor, setInstructor] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [professorInfo, setProfessorInfo] = useState(defaultTeacher); 

  /**
   * Displays an error toast message.
   * @param {string} description - The error message to be displayed.
   */
  const showErrorToast = (description) => {
    toast({
      description: description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  /**
   * Fetches professor information from the API based on the provided teacher name and course.
   * Displays error messages if the API call fails or if no grades are found.
   */
  const fetchData = async () => {
    setLoading(true);
  
    try {
      const ratingsResponse = await axios.get(`${API_URL}/professor_info?teacher=${instructor}&course=${course}`);
      setProfessorInfo(ratingsResponse.data);
      
      if (ratingsResponse.data.grades["No data found"] === 0) {
        showErrorToast('No grades found');
      }
    } catch (error) {
      showErrorToast(error.response.data.detail);
      setProfessorInfo(null);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handles form submission, trims instructor name, and initiates data fetching.
   * Displays an error toast for missing or invalid inputs.
   */
  const handleSubmit = () => {
    setInstructor(instructor.trim());
    if (!instructor.trim()) {
      showErrorToast('Teacher name is required');
      return;
    }

    const formattedCourseName = course.replace(/\s/g, '').toUpperCase().trim();
    if (formattedCourseName && !(formattedCourseName.match('([a-zA-Z]+)([0-9]+)')?.[2]?.length === 4)) {
      showErrorToast('Invalid course name');
      return;
    }

    fetchData();
  };

  return (
    <Box onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}>
      {/* Display information icon */}
      <InfoIcon />

      <Stack pt={2} spacing={2} width={300} align="center">
        {/* Input form for teacher name and course */}
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

        {/* Button for submitting the form */}
        <Button onClick={handleSubmit} isLoading={loading} height={8}>
          Submit
        </Button>

        {/* Display professor information or not found message based on API response */}
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