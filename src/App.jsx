import { useState, useEffect } from "react";
import { Button, IconButton, useToast, Stack, Box, useColorMode } from "@chakra-ui/react";
import { FiMoon } from "react-icons/fi";
import { SunIcon } from "@chakra-ui/icons";
import axios from "axios";
import Inputs from "./components/Inputs.jsx";
import InfoIcon from "./components/InfoIcon.jsx";
import ProfResults from "./components/ProfessorResults.jsx";
import CourseResults from "./components/CourseResults.jsx";
import RateUs from "./components/RateUs.jsx";
import { defaultTeacher } from "../utils/defaults.js";
import "./styles/App.css";

const API_URL = import.meta.env.DEV ? "http://localhost:80" : import.meta.env.VITE_API_URL;

function App() {
    const toast = useToast();
    const [course, setCourse] = useState("");
    const [loading, setLoading] = useState(false);
    const [professorName, setProfessorName] = useState("");
    const [lastInputType, setLastInputType] = useState(null);
    const [lastInputData, setLastInputData] = useState(null);
    const [rateUsModalOpen, setRateUsModalOpen] = useState(localStorage.getItem("lastInputData") && !localStorage.getItem("hasRated") && Math.random() < 0.1);
    const { colorMode, toggleColorMode } = useColorMode();

    useEffect(() => {
        const storedLastInputType = localStorage.getItem("lastInputType");
        const storedLastInputData = localStorage.getItem("lastInputData");

        if (storedLastInputType && storedLastInputData) {
            setLastInputType(storedLastInputType);
            setLastInputData(JSON.parse(storedLastInputData));
        } else {
            setLastInputType("professor");
            setLastInputData(defaultTeacher);
        }
    }, []);

    const showErrorToast = (description) => {
        toast({
            description: description,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    };

    const getData = async (url, type) => {
        setLoading(true);

        try {
            const ratingsResponse = await axios.get(url);
            localStorage.setItem(`${type}Info`, JSON.stringify(ratingsResponse.data));

            setLastInputType(type);
            setLastInputData(ratingsResponse.data);
            localStorage.setItem("lastInputType", type);
            localStorage.setItem("lastInputData", JSON.stringify(ratingsResponse.data));

            if (Object.keys(ratingsResponse.data.grades).length === 0) {
                showErrorToast("No grade distribution from the specified query");
            }
        } catch (error) {
            showErrorToast(error.response?.data.detail);
        } finally {
            setLoading(false);
        }
    };

    const getProfessorData = async (formattedInstructorName, formattedCourseName) => {
        const url = `${API_URL}/professor_info?teacher=${formattedInstructorName}&course=${formattedCourseName}`;
        await getData(url, "professor");
    };

    const getCourseData = async (formattedCourseName) => {
        const url = `${API_URL}/course_info?course=${formattedCourseName}`;
        await getData(url, "course");
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
            await getProfessorData(professorName.trim(), formattedCourseName);
        } else if (formattedCourseName) {
            await getCourseData(formattedCourseName);
        } else {
            showErrorToast("Please enter either a course or a professor");
        }
    };

    return (
        <Box>
            <InfoIcon />
            <IconButton icon={colorMode === "dark" ? <SunIcon /> : <FiMoon />} size={"sm"} position="fixed" top="1" right="1" onClick={toggleColorMode} />

            <RateUs rateUsModalOpen={rateUsModalOpen} setRateUsModalOpen={setRateUsModalOpen} />

            <Stack pt={2} spacing={2} width={300} align={"center"}>
                <Inputs setProfessor={setProfessorName} setCourse={setCourse} professor={professorName} course={course} />

                <Button onClick={handleSubmit} isLoading={loading} height={8} fontSize={"sm"}>
                    Submit
                </Button>

                {lastInputType === "professor" && lastInputData && <ProfResults professorInfo={lastInputData} />}
                {lastInputType === "course" && lastInputData && <CourseResults courseInfo={lastInputData} />}
            </Stack>
        </Box>
    );
}

export default App;
