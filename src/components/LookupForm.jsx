import { useState, useEffect } from "react";
import { Button, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import Inputs from "./Inputs.jsx";
import ProfResults from "./ProfessorResults.jsx";
import CourseResults from "./CourseResults.jsx";
import { timothyFarage, scottDollinger } from "../../utils/defaults.js";

const API_URL = import.meta.env.DEV ? "http://localhost:80" : import.meta.env.VITE_API_URL || "http://localhost:80";

function LookupForm({ isCompareForm }) {
    const toast = useToast();
    const [course, setCourse] = useState("");
    const [loading, setLoading] = useState(false);
    const [professorName, setProfessorName] = useState("");
    const [lastInputType, setLastInputType] = useState(null);
    const [lastInputData, setLastInputData] = useState(null);

    useEffect(() => {
        const storedLastInputType = localStorage.getItem(`LastInputType${isCompareForm ? "Compare" : ""}`);
        const storedLastInputData = localStorage.getItem(`LastInputData${isCompareForm ? "Compare" : ""}`);

        if (storedLastInputType && storedLastInputData) {
            setLastInputType(storedLastInputType);
            setLastInputData(JSON.parse(storedLastInputData));
        } else {
            setLastInputType("professor");
            setLastInputData(isCompareForm ? scottDollinger : timothyFarage);
        }
    }, [isCompareForm]);

    const showErrorToast = (description) => {
        toast({
            description: description,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    };

    const fetchData = async (url, type) => {
        setLoading(true);

        try {
            const ratingsResponse = await axios.get(url);
            setLastInputType(type);
            setLastInputData(ratingsResponse.data);
            localStorage.setItem(`LastInputType${isCompareForm ? "Compare" : ""}`, type);
            localStorage.setItem(`LastInputData${isCompareForm ? "Compare" : ""}`, JSON.stringify(ratingsResponse.data));

            const lastQueriesKey = `LastQueries${isCompareForm ? "Compare" : ""}${type === "professor" ? "Professor" : "Course"}`;
            const lastQueries = JSON.parse(localStorage.getItem(lastQueriesKey)) || [];
            const lastQuery = type === "professor" ? ratingsResponse.data.name : `${ratingsResponse.data.subject} ${ratingsResponse.data.course_number}`;
            if (lastQueries.includes(lastQuery)) {
                lastQueries.splice(lastQueries.indexOf(lastQuery), 1);
            }
            lastQueries.unshift(lastQuery);
            localStorage.setItem(lastQueriesKey, JSON.stringify(lastQueries.slice(0, 5)));

            if (Object.keys(ratingsResponse.data.grades).length === 0) {
                showErrorToast("No grade distribution from specified query");
            }
        } catch (error) {
            showErrorToast(error.response?.data.detail || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (professorName.match(/[^a-zA-Z\s.-]|.*-.*-/)) {
            showErrorToast("Invalid teacher name");
            return;
        }

        const formattedCourseName = course.replace(/\s/g, "").toUpperCase().trim();
        if (formattedCourseName && !(formattedCourseName.match("([a-zA-Z]+)([0-9Vv]+)")?.[2]?.length === 4)) {
            showErrorToast("Invalid course name");
            return;
        }

        if (professorName.trim()) {
            await fetchData(`${API_URL}/professor_info?teacher=${professorName.trim()}&course=${formattedCourseName}`, "professor");
        } else if (formattedCourseName) {
            await fetchData(`${API_URL}/course_info?course=${formattedCourseName}`, "course");
        } else {
            showErrorToast("Please enter either a course or a professor");
        }
    };

    return (
        <VStack pt={3} width={290} align={"center"}>
            <Inputs setProfessor={setProfessorName} setCourse={setCourse} professor={professorName} course={course} isCompareInputs={isCompareForm} />

            <Button onClick={handleSubmit} isLoading={loading} height={8} fontSize={"sm"} fontWeight={"medium"}>
                Submit
            </Button>

            {lastInputType === "professor" && lastInputData && <ProfResults professorInfo={lastInputData} />}
            {lastInputType === "course" && lastInputData && <CourseResults courseInfo={lastInputData} />}
        </VStack>
    );
}

LookupForm.propTypes = {
    isCompareForm: PropTypes.bool,
};

export default LookupForm;
