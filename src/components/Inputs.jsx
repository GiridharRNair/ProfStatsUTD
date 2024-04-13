import { useState, useEffect, useMemo, useCallback } from "react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { VStack, Tooltip, Spinner, InputGroup, InputRightElement, CloseButton } from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import _debounce from "lodash/debounce";
import axios from "axios";
import { defaultTeacherSuggestions, defaultCourseSuggestions } from "../../utils/defaults";

const API_URL = import.meta.env.DEV ? "http://localhost:80" : import.meta.env.VITE_API_URL || "http://localhost:80";

function Inputs({ setProfessor, setCourse, professor, course, isCompareInputs }) {
    const [professorLoading, setProfessorLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    const [professorSuggestions, setProfessorSuggestions] = useState([]);
    const [courseSuggestions, setCourseSuggestions] = useState([]);

    const getLastQueriedProfessors = useCallback(
        () => JSON.parse(localStorage.getItem(`LastQueries${isCompareInputs ? "Compare" : ""}Professor`)) || defaultTeacherSuggestions,
        [isCompareInputs],
    );

    const getLastQueriedCourses = useCallback(
        () => JSON.parse(localStorage.getItem(`LastQueries${isCompareInputs ? "Compare" : ""}Course`)) || defaultCourseSuggestions,
        [isCompareInputs],
    );

    useEffect(() => {
        setProfessorSuggestions(getLastQueriedProfessors());
        setCourseSuggestions(getLastQueriedCourses());
    }, [getLastQueriedProfessors, getLastQueriedCourses]);

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
        <VStack width={325}>
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
                    <Tooltip placement="top" label="Ignore prefixes, suffixes, and middle names" fontSize={"xs"}>
                        <AutoCompleteInput
                            height={8}
                            placeholder="Enter Teacher Name"
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
                                    setProfessorSuggestions(getLastQueriedProfessors());
                                    setCourseSuggestions(getLastQueriedCourses());
                                }}
                            />
                        )}
                    </InputRightElement>
                </InputGroup>
                {!professorLoading &&
                    (professor !== "" ? (
                        <AutoCompleteList fontSize={"sm"}>
                            {professorSuggestions.map((professorOption, index) => (
                                <AutoCompleteItem value={professorOption} key={index}>
                                    {professorOption}
                                </AutoCompleteItem>
                            ))}
                        </AutoCompleteList>
                    ) : (
                        <AutoCompleteList fontSize={"sm"}>
                            {getLastQueriedProfessors().map((professorOption, index) => (
                                <AutoCompleteItem value={professorOption} key={index} justify="space-between" align="center">
                                    {professorOption}
                                    {JSON.stringify(getLastQueriedProfessors()) !== JSON.stringify(defaultTeacherSuggestions) && <RepeatClockIcon />}
                                </AutoCompleteItem>
                            ))}
                        </AutoCompleteList>
                    ))}
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
                        placeholder={"Enter Course"}
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
                                    professor ? autocompleteValues(professor, "") : setCourseSuggestions(getLastQueriedCourses());
                                }}
                            />
                        )}
                    </InputRightElement>
                </InputGroup>
                {!courseLoading &&
                    (course !== "" || professor !== "" ? (
                        <AutoCompleteList style={{ maxHeight: "230px", overflowY: "auto" }} fontSize={"sm"}>
                            {courseSuggestions.map((courseOption, index) => (
                                <AutoCompleteItem value={courseOption} key={index}>
                                    {courseOption}
                                </AutoCompleteItem>
                            ))}
                        </AutoCompleteList>
                    ) : (
                        <AutoCompleteList fontSize={"sm"}>
                            {getLastQueriedCourses().map((courseOption, index) => (
                                <AutoCompleteItem value={courseOption} key={index} justify="space-between" align="center">
                                    {courseOption}
                                    {JSON.stringify(getLastQueriedCourses()) !== JSON.stringify(defaultCourseSuggestions) && <RepeatClockIcon />}
                                </AutoCompleteItem>
                            ))}
                        </AutoCompleteList>
                    ))}
            </AutoComplete>
        </VStack>
    );
}

Inputs.propTypes = {
    setProfessor: PropTypes.func.isRequired,
    setCourse: PropTypes.func.isRequired,
    professor: PropTypes.string.isRequired,
    course: PropTypes.string.isRequired,
    isCompareInputs: PropTypes.bool,
};

export default Inputs;
