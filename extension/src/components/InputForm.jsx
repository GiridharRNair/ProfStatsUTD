import React, { useState, useCallback, useEffect } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList, } from "@choc-ui/chakra-autocomplete";
import _debounce from 'lodash/debounce';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

const InputForm = ({ setProfessorInfo }) => {
    const toast = useToast();
    const [instructor, setInstructor] = useState('');
    const [course, setCourse] = useState('');
    const [loading, setLoading] = useState(false);
    const [professorDropdown, setProfessorDropdown] = useState([]);
    const [courseDropdown, setCourseDropdown] = useState([]);
    const [loadingText, setLoadingText] = useState('Searching');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoadingText((prevText) => {
                const ellipsisCount = (prevText.match(/\./g) || []).length;
                const newDots = ellipsisCount < 3 ? '.'.repeat(ellipsisCount + 1) : '';
                return `Searching${newDots}`;
            });
        }, 350);
  
        return () => clearInterval(intervalId);
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

        getProfessorData();
    };

    const getProfessorDropdown = async (value) => {
        try {
            const professorsResponse = await axios.get(`${API_URL}/professor_suggestions?teacher=${value}`);
            setProfessorDropdown(professorsResponse.data);
        } catch (error) {
            console.log(error.response.data.detail);
        }
    };

    const getProfessorCourseDropdown = async (value) => {
        try {
            const coursesResponse = await axios.get(`${API_URL}/professor_courses?teacher=${value}`);
            setCourseDropdown(coursesResponse.data);
        } catch (error) {
            console.log(error.response.data.detail);
        }
    }

    const debouncedGetProfessorDropdown = useCallback(_debounce((value) => getProfessorDropdown(value), 500), []);
    
    const handleInstructorChange = (value) => {
        setInstructor(value);
        debouncedGetProfessorDropdown(value);
    };

    return (
        <>
            <AutoComplete 
                openOnFocus
                onSelectOption={(value) => {
                    setInstructor(value.item.label)
                    getProfessorCourseDropdown(value.item.label)
                    setCourse('')
                }}
                emptyState={loadingText}
                suggestWhenEmpty={true}
                closeOnSelect={true}
                disableFilter={true}
            >
                <AutoCompleteInput
                    height={8}
                    placeholder="Enter Teacher Name ex. Jason Smith"
                    value={instructor}
                    onChange={(e) => handleInstructorChange(e.target.value)}
                />
                {professorDropdown.length > 0 && (
                    <AutoCompleteList>
                        {professorDropdown.map((professorOption) => (
                            <AutoCompleteItem
                                key={professorOption}
                                value={professorOption}
                            >
                                {professorOption}
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                )}
            </AutoComplete>            

            <AutoComplete 
                openOnFocus
                onSelectOption={(value) => setCourse(value.item.label)}
                emptyState={'Course not found for this professor'}
                suggestWhenEmpty={true}
                closeOnSelect={true}
            >
                <AutoCompleteInput
                    height={8}
                    placeholder="Specify a Course? ex. CS 1337"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                />
                {courseDropdown.length > 0 && (
                    <AutoCompleteList>
                        {courseDropdown.map((course) => (
                            <AutoCompleteItem
                                key={course}
                                value={course}
                            >
                                {course}
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                )}
            </AutoComplete>

            <Button onClick={handleSubmit} isLoading={loading} height={8}>
                Submit
            </Button>
        </>
    );
};

export default InputForm;
