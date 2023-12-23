import { useState, useEffect } from 'react';
import { defaultTeacher } from '../utils/defaults.js';
import { Button, useToast, Stack, Box } from '@chakra-ui/react';
import axios from 'axios';
import Inputs from './components/Inputs';
import InfoIcon from './components/InfoIcon.jsx';
import ProfResults from './components/ProfResults.jsx';
import NotFoundPage from './components/NotFound.jsx';
import './styles/App.css';

const API_URL = import.meta.env.DEV ? 'http://localhost:80' : import.meta.env.VITE_API_URL;

function App() {
    const toast = useToast();
    const [professorInfo, setProfessorInfo] = useState(defaultTeacher); 
    const [instructor, setInstructor] = useState('');
    const [course, setCourse] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedProfessorInfo = localStorage.getItem('professorInfo');
        if (storedProfessorInfo) {
            setProfessorInfo(JSON.parse(storedProfessorInfo));
        }
    }, []);

    const showErrorToast = (description) => {
        toast({
            description: description,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    };

    const getProfessorData = async () => {
        setLoading(true);

        try {
            const ratingsResponse = await axios.get(`${API_URL}/professor_info?teacher=${instructor}&course=${course}`);
            setProfessorInfo(ratingsResponse.data);
            localStorage.setItem('professorInfo', JSON.stringify(ratingsResponse.data));

            if (Object.keys(ratingsResponse.data.grades).length === 0) {
                showErrorToast('No grades found');
            }
        } catch (error) {
            showErrorToast(error.response.data.detail);
            setProfessorInfo(null);
            localStorage.removeItem('professorInfo');
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

        const formattedCourseName = course.replace(/\s/g, '').toUpperCase().trim();
        if (formattedCourseName && !(formattedCourseName.match('([a-zA-Z]+)([0-9Vv]+)')?.[2]?.length === 4)) {
            showErrorToast('Invalid course name');
            return;
        }    

        getProfessorData();
    };

    return (
        <Box>
            <InfoIcon />
        
            <Stack pt={2} spacing={2} width={300} align="center">
                <Inputs selectedProfessor={setInstructor} selectedCourse={setCourse} />

                <Button onClick={handleSubmit} isLoading={loading} height={8}>
                    Submit
                </Button>

                {professorInfo ? <ProfResults professorInfo={professorInfo} /> : <NotFoundPage />}
            </Stack>
        </Box>
    );
}

export default App;