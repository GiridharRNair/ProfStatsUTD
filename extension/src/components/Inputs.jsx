import React, { useState, useCallback } from 'react';
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import axios from 'axios'; 
import _debounce from 'lodash/debounce';

const API_URL = import.meta.env.VITE_API_URL

function Inputs({ selectedProfessor, selectedCourse }) {
    const [professorDropdown, setProfessorDropdown] = useState([]);
    const [courseDropdown, setCourseDropdown] = useState([]);
    const [course, setCourse] = useState('');

    const getProfessorDropdown = async (value) => {
        try {
            const professorsResponse = await axios.get(`${API_URL}/professor_suggestions?teacher=${value}`);
            setProfessorDropdown(professorsResponse.data);
        } catch (error) {
            console.error(error.response?.data.detail);
        }
    };

    const getProfessorCourseDropdown = async (value) => {
        try {
            const coursesResponse = await axios.get(`${API_URL}/professor_courses?teacher=${value}`);
            setCourseDropdown(coursesResponse.data);
        } catch (error) {
            console.error(error.response?.data.detail);
        }
    }

    const debouncedGetProfessorDropdown = useCallback(_debounce((value) => getProfessorDropdown(value), 450), []);

    const handleInstructorChange = (value) => {
        selectedProfessor(value);
        debouncedGetProfessorDropdown(value);
    };

    return (
        <>
            <AutoComplete
                openOnFocus
                onSelectOption={(value) => {
                    selectedProfessor(value.item.label);
                    getProfessorCourseDropdown(value.item.label);
                    setCourse('');
                }}
                focusInputOnSelect={false}
                closeOnSelect={true}
                suggestWhenEmpty={true}
                disableFilter={true}
                freeSolo={true}
            >
                <AutoCompleteInput
                    height={8}
                    placeholder="Enter Teacher Name ex. Jason Smith"
                    onChange={(e) => {
                        handleInstructorChange(e.target.value)
                        setCourseDropdown([]);
                    }}
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
                onSelectOption={(value) => {
                    selectedCourse(value.item.label);
                    setCourse(value.item.label); 
                }}
                focusInputOnSelect={false}
                closeOnSelect={true}
                suggestWhenEmpty={true}
                emptyState={'Course not found for this professor'}
                freeSolo={true}
            >
                <AutoCompleteInput
                    height={8}
                    placeholder="Specify a Course? ex. CS 1337"
                    value={course}
                    onChange={(e) => {
                        selectedCourse(e.target.value)
                        setCourse(e.target.value)
                    }}
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
        </>
    );
}

export default Inputs;
