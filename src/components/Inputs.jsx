import { useState, useMemo } from "react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { VStack, Tooltip, Spinner, InputGroup, InputRightElement, CloseButton } from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import _debounce from "lodash/debounce";
import axios from "axios";

const DEFAULT_TEACHER_SUGGESTIONS = ["John Cole", "Regina Ybarra", "Stephanie Taylor", "Bentley Garrett", "Karl Sengupta"];
const DEFAULT_COURSE_SUGGESTIONS = ["CS 2305", "MATH 2418", "CHEM 2401", "ACCT 6305", "SPAN 2311"];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:80";

function Inputs({ setProfessor, setCourse, professor, course, isCompareInputs = false }) {
    const PROFESSOR_STORAGE_KEY = `LastQueries${isCompareInputs ? "Compare" : ""}Professor`;
    const COURSE_STORAGE_KEY = `LastQueries${isCompareInputs ? "Compare" : ""}Course`;

    const [professorLoading, setProfessorLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    const [professorSuggestions, setProfessorSuggestions] = useState(JSON.parse(localStorage.getItem(PROFESSOR_STORAGE_KEY)) || DEFAULT_TEACHER_SUGGESTIONS);
    const [courseSuggestions, setCourseSuggestions] = useState(JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY)) || DEFAULT_COURSE_SUGGESTIONS);

    const getLastQueriedProfessors = () => JSON.parse(localStorage.getItem(PROFESSOR_STORAGE_KEY)) || DEFAULT_TEACHER_SUGGESTIONS;
    const getLastQueriedCourses = () => JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY)) || DEFAULT_COURSE_SUGGESTIONS;

    const fetchSuggestions = useMemo(
        () =>
            _debounce(async (professorParam, courseParam) => {
                try {
                    const { data } = await axios.get(`${API_URL}/suggestions?teacher=${professorParam}&course=${courseParam}`);

                    setProfessorSuggestions(data.professors);
                    setCourseSuggestions(data.courses);
                } catch (error) {
                    console.error(error.response?.data.detail);
                } finally {
                    setProfessorLoading(false);
                    setCourseLoading(false);
                }
            }, 250),
        [],
    );

    return (
        <VStack width={325}>
            <AutoComplete
                openOnFocus
                disableFilter={true}
                suggestWhenEmpty={true}
                freeSolo={true}
                isLoading={professorLoading}
                emptyState="Professor not found"
                onSelectOption={({ item }) => {
                    setProfessor(item.label);
                    fetchSuggestions(item.label, course);
                }}
            >
                <InputGroup>
                    <Tooltip placement="top" label="Ignore prefixes, suffixes, and middle names" fontSize={"xs"}>
                        <AutoCompleteInput
                            height={8}
                            placeholder="Enter Teacher Name"
                            value={professor}
                            loadingIcon={<Spinner size={"xs"} mb={2} />}
                            onChange={(e) => {
                                setProfessorLoading(true);
                                setProfessor(e.target.value);
                                fetchSuggestions(e.target.value, course);
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
                {!professorLoading && (
                    <AutoCompleteList fontSize="sm">
                        {(professor ? professorSuggestions : getLastQueriedProfessors()).map((professorOption, index) => (
                            <AutoCompleteItem value={professorOption} key={index} justify="space-between" align="center">
                                {professorOption}
                                {!professor && JSON.stringify(getLastQueriedProfessors()) !== JSON.stringify(DEFAULT_TEACHER_SUGGESTIONS) && (
                                    <RepeatClockIcon />
                                )}
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                )}
            </AutoComplete>

            <AutoComplete
                openOnFocus
                disableFilter={true}
                suggestWhenEmpty={true}
                freeSolo={true}
                isLoading={courseLoading}
                emptyState={`Course(s) not found ${professor ? `for ${professor}` : ""}`}
                onSelectOption={({ item }) => setCourse(item.label)}
            >
                <InputGroup>
                    <AutoCompleteInput
                        height={8}
                        placeholder={"Enter Course"}
                        value={course}
                        loadingIcon={<Spinner size={"xs"} mb={2} />}
                        onChange={(e) => {
                            setCourseLoading(true);
                            setCourse(e.target.value);
                            fetchSuggestions(professor, e.target.value);
                        }}
                    />
                    <InputRightElement>
                        {!courseLoading && course && (
                            <CloseButton
                                size="sm"
                                mb={2}
                                onClick={() => {
                                    setCourse("");
                                    professor ? fetchSuggestions(professor, "") : setCourseSuggestions(getLastQueriedCourses());
                                }}
                            />
                        )}
                    </InputRightElement>
                </InputGroup>
                {!courseLoading && (
                    <AutoCompleteList style={{ maxHeight: "230px", overflowY: "auto" }} fontSize="sm">
                        {(course || professor ? courseSuggestions : getLastQueriedCourses()).map((courseOption, index) => (
                            <AutoCompleteItem value={courseOption} key={index} justify="space-between" align="center">
                                {courseOption}
                                {!course && !professor && JSON.stringify(getLastQueriedCourses()) !== JSON.stringify(DEFAULT_COURSE_SUGGESTIONS) && (
                                    <RepeatClockIcon />
                                )}
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
    isCompareInputs: PropTypes.bool,
};

export default Inputs;
