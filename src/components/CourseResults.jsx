import {
    VStack,
    Tooltip as ChakraTooltip,
    useDisclosure,
    Button,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    Image,
    useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import GradesGraph from "./GradesGraph.jsx";

function CourseResults({ courseInfo }) {
    const { subject, course_number, course_name, grades } = courseInfo;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const openUTDGrades = () => window.open(`https://utdgrades.com/results?search=${subject + course_number}`, "_blank");
    const openUTDTrends = () => window.open(`https://trends.utdnebula.com/dashboard?searchTerms=${subject + "+" + course_number}`, "_blank");
    const openCourseCatalog = () => {
        const catalogType = course_number >= 5000 ? "graduate" : "undergraduate";
        const catalogYear = new Date().getFullYear() - 1;
        const url = `https://catalog.utdallas.edu/${catalogYear}/${catalogType}/courses/${subject.toLowerCase()}${course_number.toLowerCase()}`;
        window.open(url, "_blank");
    };

    return (
        <VStack width={315}>
            <ChakraTooltip label="Click for more information" placement="bottom" hasArrow>
                <Button
                    fontSize="lg"
                    variant="link"
                    fontWeight="normal"
                    textColor={useColorModeValue("black", "white")}
                    onClick={onOpen}
                    onFocus={(e) => e.preventDefault()}
                    _hover={{ color: "#3182CE" }}
                    style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                    }}
                    pb={1}
                >
                    {course_name}
                </Button>
            </ChakraTooltip>

            <GradesGraph grades={grades} />

            <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="md">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>
                        <VStack>
                            <Button
                                leftIcon={<Image src="extension-images/UTDGradesIcon.png" boxSize={22} />}
                                onClick={openUTDGrades}
                                variant="outline"
                                width={240}
                            >
                                UTD Grades
                            </Button>
                            <Button
                                leftIcon={
                                    <Image src={useColorModeValue("extension-images/UTDTrendsDark.svg", "extension-images/UTDTrendsLight.svg")} boxSize={5} />
                                }
                                onClick={openUTDTrends}
                                variant="outline"
                                width={240}
                            >
                                UTD Trends
                            </Button>
                            <Button
                                leftIcon={<Image src="extension-images/UTDIcon.png" boxSize={23} />}
                                onClick={openCourseCatalog}
                                variant="outline"
                                width={240}
                            >
                                Course Catalog
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </VStack>
    );
}

CourseResults.propTypes = {
    courseInfo: PropTypes.shape({
        subject: PropTypes.string,
        course_number: PropTypes.string,
        course_name: PropTypes.string,
        grades: PropTypes.object.isRequired,
    }).isRequired,
};

export default CourseResults;
