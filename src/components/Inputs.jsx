import { useState, useMemo } from 'react';
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { VStack, Tooltip } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import PropTypes from 'prop-types'; 
import _debounce from 'lodash/debounce';
import axios from 'axios'; 
import { defaultTeacherSuggestions } from '../../utils/defaults';

const API_URL = import.meta.env.DEV ? 'http://localhost:80' : import.meta.env.VITE_API_URL;

Inputs.propTypes = {
    selectedProfessor: PropTypes.func.isRequired, 
    selectedCourse: PropTypes.func.isRequired,
};

function Inputs({ selectedProfessor, selectedCourse }) {
    const [professorDropdown, setProfessorDropdown] = useState(defaultTeacherSuggestions);
    const [courseDropdown, setCourseDropdown] = useState([]);
    const [course, setCourse] = useState('');
    const [loading, setLoading] = useState(false);

    const getProfessorDropdown = async (value) => {
        try {
            const professorsResponse = await axios.get(`${API_URL}/professor_suggestions?teacher=${value}`);
            setProfessorDropdown(professorsResponse.data);
        } catch (error) {
            console.error(error.response?.data.detail);
        }
        setLoading(false);
    };

    const getProfessorCourseDropdown = async (value) => {
        try {
            const coursesResponse = await axios.get(`${API_URL}/professor_courses?teacher=${value}`);
            setCourseDropdown(coursesResponse.data);
        } catch (error) {
            console.error(error.response?.data.detail);
        }
    }

    const debouncedGetProfessorDropdown = useMemo(() => _debounce((value) => getProfessorDropdown(value), 250), []);

    return (
        <VStack pt={1} width={325}>
            <AutoComplete
                openOnFocus
                closeOnSelect={true}
                emptyState={'Professor not found'}
                disableFilter={true}
                freeSolo={true}
                isLoading={loading}
                onSelectOption={(value) => {
                    selectedProfessor(value.item.label);
                    getProfessorCourseDropdown(value.item.label);
                    selectedCourse('');
                    setCourse('');
                }}
            >
                <Tooltip label="Ignore middle names and suffixes" placement="top">
                    <AutoCompleteInput
                        height={8}
                        placeholder="Enter Teacher Name ex. Jason Smith"
                        loadingIcon={<Spinner size={'xs'} mb={2}/>}
                        onChange={(e) => {
                            setLoading(true);
                            selectedProfessor(e.target.value);
                            debouncedGetProfessorDropdown(e.target.value);
                            setCourseDropdown([]);
                            selectedCourse('');
                            setCourse('');
                        }}
                    />
                </Tooltip>
                {!loading && (
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
                closeOnSelect={true}
                suggestWhenEmpty={true}
                emptyState={'Course not found for this professor'}
                freeSolo={true}
                onSelectOption={(value) => {
                    selectedCourse(value.item.label);
                    setCourse(value.item.label); 
                }}
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
        </ VStack>
    );
}

export default Inputs;
