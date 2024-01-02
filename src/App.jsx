import { useState, useEffect } from "react";
import { defaultTeacher } from "../utils/defaults.js";
import { Button, IconButton, useToast, Stack, Box, useColorMode } from "@chakra-ui/react";
import { FiMoon } from "react-icons/fi";
import { SunIcon } from "@chakra-ui/icons";
import axios from "axios";
import Inputs from "./components/Inputs.jsx";
import InfoIcon from "./components/InfoIcon.jsx";
import ProfResults from "./components/ProfessorResults.jsx";
import NotFoundPage from "./components/NotFound.jsx";
import "./styles/App.css";

const API_URL = import.meta.env.DEV ? "http://localhost:80" : import.meta.env.VITE_API_URL;

function App() {
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();
    const [professorInfo, setProfessorInfo] = useState(defaultTeacher);
    const [instructor, setInstructor] = useState("");
    const [course, setCourse] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedProfessorInfo = localStorage.getItem("professorInfo");
        if (storedProfessorInfo) {
            setProfessorInfo(JSON.parse(storedProfessorInfo));
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

    const getProfessorData = async (formattedInstructorName, formattedCourseName) => {
        setLoading(true);

        try {
            const ratingsResponse = await axios.get(`${API_URL}/professor_info?teacher=${formattedInstructorName}&course=${formattedCourseName}`);
            setProfessorInfo(ratingsResponse.data);
            localStorage.setItem("professorInfo", JSON.stringify(ratingsResponse.data));

            if (Object.keys(ratingsResponse.data.grades).length === 0) {
                showErrorToast("No grades found");
            }
        } catch (error) {
            showErrorToast(error.response.data.detail);
            setProfessorInfo(null);
            localStorage.removeItem("professorInfo");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!instructor.trim()) {
            showErrorToast("Teacher name is required");
            return;
        }

        if (instructor.match(/[^a-zA-Z\s-]|-.*-/)) {
            showErrorToast("Invalid teacher name");
            return;
        }

        const formattedCourseName = course.replace(/\s/g, "").toUpperCase().trim();
        console.log(formattedCourseName);
        if (formattedCourseName && !(formattedCourseName.match("([a-zA-Z]+)([0-9Vv]+)")?.[2]?.length === 4)) {
            showErrorToast("Invalid course name");
            return;
        }

        getProfessorData(instructor.trim(), formattedCourseName);
    };

    return (
        <Box>
            <InfoIcon />
            <IconButton
                icon={colorMode === "dark" ? <SunIcon /> : <FiMoon />}
                size={"sm"}
                position="fixed"
                top="1"
                right="1"
                onClick={toggleColorMode}
            />

            <Stack pt={2} spacing={2} width={300} align={"center"}>
                <Inputs selectedProfessor={setInstructor} selectedCourse={setCourse} />

                <Button onClick={handleSubmit} isLoading={loading} height={8} fontSize={"sm"}>
                    Submit
                </Button>

                {professorInfo ? <ProfResults professorInfo={professorInfo} /> : <NotFoundPage />}
            </Stack>
        </Box>
    );
}

export default App;
