import React, { useState, useEffect } from 'react';
import { defaultTeacher } from '../data/data.js';
import { Stack, Box } from '@chakra-ui/react';
import InputForm from './components/InputForm.jsx';
import InfoIcon from './components/InfoIcon.jsx';
import ProfResults from './components/ProfResults.jsx';
import NotFoundPage from './components/NotFound.jsx';
import './styles/App.css';


function App() {
  const [professorInfo, setProfessorInfo] = useState(defaultTeacher); 

  useEffect(() => {
    const storedProfessorInfo = localStorage.getItem('professorInfo');
    if (storedProfessorInfo) {
      setProfessorInfo(JSON.parse(storedProfessorInfo));
    }
  }, []);

  return (
    <Box>
      <InfoIcon />
      
      <Stack pt={2} spacing={2} width={300} align="center">
        <InputForm setProfessorInfo={setProfessorInfo} />

        {professorInfo ? (
          <ProfResults professorInfo={professorInfo} />
        ) : 
          <NotFoundPage /> 
        }

      </Stack>
    </Box>
  );
}

export default App;