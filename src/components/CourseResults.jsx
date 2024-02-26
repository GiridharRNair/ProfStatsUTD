import { VStack, Tooltip as ChakraTooltip, useDisclosure, Button, Drawer, DrawerBody, DrawerOverlay, DrawerContent, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import DrawerButton from "./DrawerButton.jsx";
import GradesGraph from "./GradesGraph.jsx";

function CourseResults({ courseInfo }) {
    const { subject, course_number, course_name, catalog_url, grades } = courseInfo;
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <VStack width={315}>
            <ChakraTooltip label="Click for more information" placement="bottom" mt={-2}>
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
                            <DrawerButton
                                iconSrc="extension-images/UTDGradesIcon.png"
                                buttonText="UTD Grades"
                                url={`https://utdgrades.com/results?search=${subject + course_number}`}
                                boxSize={22}
                            />
                            <DrawerButton
                                iconSrc={useColorModeValue("extension-images/UTDTrendsDark.svg", "extension-images/UTDTrendsLight.svg")}
                                buttonText="UTD Trends"
                                url={`https://trends.utdnebula.com/dashboard?searchTerms=${subject + "+" + course_number}`}
                                boxSize={5}
                            />
                            <DrawerButton iconSrc="extension-images/UTDIcon.png" buttonText="Course Catalog" url={catalog_url} boxSize={23} />
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
        grades: PropTypes.object,
        catalog_url: PropTypes.string,
    }).isRequired,
};

export default CourseResults;
