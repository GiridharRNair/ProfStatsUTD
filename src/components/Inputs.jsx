import { useState, useMemo } from "react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { VStack, Tooltip, Spinner, InputGroup, InputRightElement, CloseButton } from "@chakra-ui/react";
import PropTypes from "prop-types";
import _debounce from "lodash/debounce";
import axios from "axios";
import { defaultTeacherSuggestions, defaultCourseSuggestions } from "../../utils/defaults";

const API_URL = import.meta.env.DEV ? "http://localhost:80" : import.meta.env.VITE_API_URL;

function Inputs({ setProfessor, setCourse, professor, course }) {
    const [professorLoading, setProfessorLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    const [professorSuggestions, setProfessorSuggestions] = useState(defaultTeacherSuggestions);
    const [courseSuggestions, setCourseSuggestions] = useState(defaultCourseSuggestions);

    const autocompleteValues = async (professorParam, courseParam) => {
        try {
            const autocomplete = await axios.get(`${API_URL}/suggestions?teacher=${professorParam}&course=${courseParam}`);

            setProfessorSuggestions(autocomplete.data.professors);
            setCourseSuggestions(autocomplete.data.courses);
        } catch (error) {
            console.error(error.response?.data.detail);
        } finally {
            setProfessorLoading(false);
            setCourseLoading(false);
        }
    };

    const debouncedAutocompleteValues = useMemo(() => _debounce((professor, course) => autocompleteValues(professor, course), 250), []);

    return (
        <VStack pt={1} width={325}>
            <AutoComplete
                openOnFocus
                closeOnSelect={true}
                disableFilter={true}
                suggestWhenEmpty={true}
                freeSolo={true}
                isLoading={professorLoading}
                emptyState="Professor not found"
                onSelectOption={(value) => {
                    setProfessor(value.item.label);
                    autocompleteValues(value.item.label, course);
                }}
            >
                <InputGroup>
                    <Tooltip placement="top" label="Ignore middle names">
                        <AutoCompleteInput
                            height={8}
                            placeholder="Enter Teacher Name ex. Jason Smith"
                            value={professor}
                            loadingIcon={<Spinner size={"xs"} mb={2} />}
                            onChange={(value) => {
                                setProfessorLoading(true);
                                setProfessor(value.target.value);
                                debouncedAutocompleteValues(value.target.value, course);
                            }}
                        />
                    </Tooltip>
                    <InputRightElement>
                        {!professorLoading && professor && (
                            <CloseButton
                                size="sm"
                                mb={2}
                                onClick={() => {
                                    setProfessor("");
                                    setProfessorSuggestions(defaultTeacherSuggestions);
                                    setCourseSuggestions(defaultCourseSuggestions);
                                }}
                            />
                        )}
                    </InputRightElement>
                </InputGroup>
                {!professorLoading && (
                    <AutoCompleteList>
                        {professorSuggestions.map((professorOption, index) => (
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
                disableFilter={true}
                suggestWhenEmpty={true}
                freeSolo={true}
                isLoading={courseLoading}
                emptyState={`Course(s) not found ${professor ? `for ${professor}` : ""}`}
                onSelectOption={(value) => setCourse(value.item.label)}
            >
                <InputGroup>
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
                    <InputRightElement>
                        {!courseLoading && course && (
                            <CloseButton
                                size="sm"
                                mb={2}
                                onClick={() => {
                                    setCourse("");
                                    autocompleteValues(professor, "");
                                }}
                            />
                        )}
                    </InputRightElement>
                </InputGroup>
                {!courseLoading && (
                    <AutoCompleteList>
                        {courseSuggestions.map((courseOption, index) => (
                            <AutoCompleteItem value={courseOption} key={index}>
                                {courseOption}
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
