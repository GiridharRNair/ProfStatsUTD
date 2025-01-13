import { useState } from "react";
import { Button, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import Inputs from "@components/inputs";
import ProfResults from "@components/professor-info";
import CourseResults from "@components/course-info";

const TIMOTHY_FARAGE = {
    course_number: "",
    department: "Computer Science",
    difficulty: 2.1,
    grades: {
        a: 1186,
        aMinus: 277,
        aPlus: 1026,
        b: 296,
        bMinus: 77,
        bPlus: 232,
        c: 129,
        cMinus: 44,
        cPlus: 60,
        cr: 29,
        d: 34,
        dMinus: 25,
        dPlus: 26,
        f: 47,
        nc: 5,
        w: 40,
    },
    id: "138341",
    name: "Timothy Farage",
    rating: 4.2,
    subject: "",
    tags: ["Amazing Lectures", "Graded By Few Things", "Hilarious", "Respected", "Test Heavy"],
    would_take_again: 78,
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:80";

function LookupForm({ isCompareForm }) {
    const toast = useToast();
    const [course, setCourse] = useState("");
    const [professor, setProfessor] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastInputType, setLastInputType] = useState(localStorage.getItem(`LastInputType${isCompareForm ? "Compare" : ""}`) || "professor");
    const [lastInputData, setLastInputData] = useState(
        JSON.parse(localStorage.getItem(`LastInputData${isCompareForm ? "Compare" : ""}`) || JSON.stringify(TIMOTHY_FARAGE)),
    );

    const updateLocalStorage = (type, data) => {
        const suffix = isCompareForm ? "Compare" : "";
        const queryType = type === "professor" ? "Professor" : "Course";
        const queryValue = type === "professor" ? data.name : `${data.subject} ${data.course_number}`;

        // Update last input data
        localStorage.setItem(`LastInputType${suffix}`, type);
        localStorage.setItem(`LastInputData${suffix}`, JSON.stringify(data));

        // Update query history
        const queries = JSON.parse(localStorage.getItem(`LastQueries${suffix}${queryType}`)) || [];
        const updatedQueries = [queryValue, ...queries.filter((q) => q !== queryValue)].slice(0, 5);
        localStorage.setItem(`LastQueries${suffix}${queryType}`, JSON.stringify(updatedQueries));
    };

    const fetchData = async (url, type) => {
        try {
            setLoading(true);
            const { data } = await axios.get(url);

            setLastInputType(type);
            setLastInputData(data);
            updateLocalStorage(type, data);

            if (Object.keys(data.grades).length === 0) {
                toast({
                    description: "No grade distribution from specified query",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                description: error.response?.data.detail || "An error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const formattedCourseName = course.replace(/\s/g, "").toUpperCase().trim();
        const isValidProfessor = !professor.match(/[^a-zA-Z\s.-]|.*-.*-/);
        const isValidCourse = !formattedCourseName || formattedCourseName.match("([a-zA-Z]+)([0-9Vv]+)")?.["2"]?.length === 4;

        if (!isValidProfessor) {
            toast({ description: "Invalid teacher name", status: "error", duration: 5000, isClosable: true });
            return;
        }
        if (!isValidCourse) {
            toast({ description: "Invalid course name", status: "error", duration: 5000, isClosable: true });
            return;
        }
        if (!professor.trim() && !formattedCourseName) {
            toast({ description: "Please enter either a course or a professor", status: "error", duration: 5000, isClosable: true });
            return;
        }

        const query = professor.trim()
            ? { url: `${API_URL}/professor_info?teacher=${professor.trim()}&course=${formattedCourseName}`, type: "professor" }
            : { url: `${API_URL}/course_info?course=${formattedCourseName}`, type: "course" };

        await fetchData(query.url, query.type);
    };

    return (
        <VStack pt={3} width={290} align="center">
            <Inputs setProfessor={setProfessor} setCourse={setCourse} professor={professor} course={course} isCompareInputs={isCompareForm} />
            <Button onClick={handleSubmit} isLoading={loading} height={8} fontSize="sm" fontWeight="medium">
                Submit
            </Button>
            {lastInputData && (lastInputType === "professor" ? <ProfResults professorInfo={lastInputData} /> : <CourseResults courseInfo={lastInputData} />)}
        </VStack>
    );
}

LookupForm.propTypes = {
    isCompareForm: PropTypes.bool,
};

export default LookupForm;
