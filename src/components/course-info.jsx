import {
    VStack,
    Tooltip as ChakraTooltip,
    useDisclosure,
    Button,
    Image,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import GradesGraph from "@components/grades-graph";

function CourseResults({ courseInfo }) {
    const { subject, course_number, course_name, catalog_url, grades } = courseInfo;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const UTD_GRADES_URL = `https://utdgrades.com/results?search=${subject + course_number}`;
    const UTD_TRENDS_URL = `https://trends.utdnebula.com/dashboard?searchTerms=${subject + "+" + course_number}`;

    return (
        <VStack width={315}>
            <ChakraTooltip label="Click for more information" placement="bottom" mt={-2} fontSize={"xs"}>
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
                                leftIcon={<Image src="UTDGradesIcon.png" boxSize={22} />}
                                onClick={() => window.open(UTD_GRADES_URL, "_blank")}
                                variant={"outline"}
                                fontWeight={"medium"}
                                width={240}
                            >
                                UTD Grades
                            </Button>
                            <Button
                                leftIcon={<Image src={useColorModeValue("UTDTrendsDark.svg", "UTDTrendsLight.svg")} boxSize={5} />}
                                onClick={() => window.open(UTD_TRENDS_URL, "_blank")}
                                variant={"outline"}
                                fontWeight={"medium"}
                                width={240}
                            >
                                UTD Trends
                            </Button>
                            <Button
                                leftIcon={<Image src={"UTDIcon.png"} boxSize={23} />}
                                onClick={() => window.open(catalog_url, "_blank")}
                                variant={"outline"}
                                fontWeight={"medium"}
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
        grades: PropTypes.object,
        catalog_url: PropTypes.string,
    }).isRequired,
};

export default CourseResults;
