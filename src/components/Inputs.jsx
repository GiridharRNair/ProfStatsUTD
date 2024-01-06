import { useState, useMemo } from "react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { VStack, Tooltip, Spinner } from "@chakra-ui/react";
import PropTypes from "prop-types";
import _debounce from "lodash/debounce";
import axios from "axios";
import { defaultTeacherSuggestions, defaultCourseSuggestions } from "../../utils/defaults";

const API_URL = import.meta.env.DEV ? "http://localhost:80" : import.meta.env.VITE_API_URL;

function Inputs({ setProfessor, setCourse, professor, course }) {
    const [professorLoading, setProfessorLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    const [dropdown, setDropdown] = useState({
        professors: defaultTeacherSuggestions,
        courses: defaultCourseSuggestions,
    });

    const autocompleteValues = async (professorParam, courseParam) => {
        try {
            const autocomplete = await axios.get(`${API_URL}/suggestions?teacher=${professorParam}&course=${courseParam}`);

            setDropdown({
                professors: autocomplete.data.professors,
                courses: autocomplete.data.courses,
            });
        } catch (error) {
            console.error(error.response?.data.detail);
        }

        setProfessorLoading(false);
        setCourseLoading(false);
    };

    const debouncedAutocompleteValues = useMemo(() => _debounce((professor, course) => autocompleteValues(professor, course), 250), []);

    return (
        <VStack pt={1} width={325}>
            <AutoComplete
                openOnFocus
                closeOnSelect={true}
                suggestWhenEmpty={true}
                emptyState={"Professor not found"}
                disableFilter={true}
                freeSolo={true}
                isLoading={professorLoading}
                onSelectOption={(value) => {
                    setCourse("");
                    setProfessor(value.item.label);
                    debouncedAutocompleteValues(value.item.label, "");
                }}
            >
                <Tooltip placement="top" label="Ignore middle names">
                    <AutoCompleteInput
                        height={8}
                        placeholder="Enter Teacher Name ex. Jason Smith"
                        value={professor}
                        loadingIcon={<Spinner size={"xs"} mb={2} />}
                        onChange={(value) => {
                            setCourse("");
                            setProfessorLoading(true);
                            setProfessor(value.target.value);
                            debouncedAutocompleteValues(value.target.value, "");
                        }}
                    />
                </Tooltip>
                {!professorLoading && (
                    <AutoCompleteList>
                        {dropdown.professors.map((professorOption, index) => (
                            <AutoCompleteItem value={professorOption} key={index}>
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
                emptyState={`Course not found ${professor ? `for ${professor}` : ""}`}
                disableFilter={true}
                freeSolo={true}
                isLoading={courseLoading}
                onSelectOption={(value) => {
                    setCourse(value.item.label);
                    debouncedAutocompleteValues(professor, value.item.label);
                }}
            >
                <AutoCompleteInput
                    height={8}
                    placeholder="Specify a Course? ex. CS 1337"
                    value={course}
                    loadingIcon={<Spinner size={"xs"} mb={2} />}
                    onChange={(value) => {
                        setCourseLoading(true);
                        setCourse(value.target.value);
                        debouncedAutocompleteValues(professor, value.target.value);
                    }}
                />
                {!courseLoading && (
                    <AutoCompleteList>
                        {dropdown.courses.map((course, index) => (
                            <AutoCompleteItem value={course} key={index}>
                                {course}
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                )}
            </AutoComplete>
        </VStack>
    );
}

Inputs.propTypes = {
    setProfessor: PropTypes.func.isRequired,
    setCourse: PropTypes.func.isRequired,
    professor: PropTypes.string.isRequired,
    course: PropTypes.string.isRequired,
};

export default Inputs;
