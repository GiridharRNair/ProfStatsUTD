import {
    Text,
    HStack,
    VStack,
    Spacer,
    Tag,
    Wrap,
    WrapItem,
    Tooltip as ChakraTooltip,
    useDisclosure,
    Button,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    useColorModeValue,
    CircularProgress,
    CircularProgressLabel,
    Image,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import GradesGraph from "@/components/grades-graph";

function ProfResults({ professorInfo }) {
    const { name, department, id, subject, course_number, tags, rating, difficulty, would_take_again, grades } = professorInfo;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const RateMyProfessorUrl = `https://www.ratemyprofessors.com/professor/${id}`;
    const UTDGradesUrl = `https://utdgrades.com/results?search=${subject && subject + course_number + "+"}${name.replace(" ", "+")}`;
    const UTDTrendsUrl = `https://trends.utdnebula.com/dashboard?searchTerms=${subject && subject + "+" + course_number + "%2C"}${name.replace(" ", "+")}`;
    const UTDProfileUrl = `https://profiles.utdallas.edu/browse?search=${name.replace(" ", "+")}`;

    return (
        <VStack width={315}>
            <ChakraTooltip label="Click for more information" placement="bottom" fontSize={"xs"}>
                <Button
                    fontSize="lg"
                    variant={"link"}
                    fontWeight={"normal"}
                    textColor={useColorModeValue("black", "white")}
                    onClick={onOpen}
                    onFocus={(e) => e.preventDefault()}
                    _hover={{ color: "#3182CE" }}
                    height={4}
                    pt={2}
                    pb={1}
                >
                    {name}
                </Button>
            </ChakraTooltip>

            <Text fontSize="sm" mb={!tags && -1}>
                {department}
            </Text>

            {tags && (
                <Wrap justify="center" spacing={"4px"}>
                    {tags.sort().map((tag, index) => (
                        <WrapItem key={index}>
                            <Tag variant="outline" fontSize={"9px"} size="sm">
                                {tag}
                            </Tag>
                        </WrapItem>
                    ))}
                </Wrap>
            )}

            <HStack w={250} pb={1}>
                <VStack w={15}>
                    <Text height={4}>Rating</Text>
                    <CircularProgress
                        max={5}
                        size={"55px"}
                        thickness={"10px"}
                        value={rating === 0 ? -1 : Math.max(0, rating)}
                        color={`hsl(${(Math.max(0, rating) / 5) * 100}, 90%, 50%)`}
                    >
                        <CircularProgressLabel>{rating < 0 ? "N/A" : rating}</CircularProgressLabel>
                    </CircularProgress>
                </VStack>
                <Spacer />
                <VStack w={15}>
                    <Text height={4}>Difficulty</Text>
                    <CircularProgress
                        max={5}
                        size={"55px"}
                        thickness={"10px"}
                        value={difficulty === 0 ? -1 : Math.max(0, difficulty)}
                        color={`hsl(${((5 - Math.max(0, difficulty)) / 5) * 100}, 90%, 50%)`}
                    >
                        <CircularProgressLabel>{difficulty < 0 ? "N/A" : difficulty}</CircularProgressLabel>
                    </CircularProgress>
                </VStack>
                <Spacer />
                <VStack w={15}>
                    <Text height={4}>Enjoyment</Text>
                    <CircularProgress
                        max={100}
                        size={"55px"}
                        thickness={"10px"}
                        value={would_take_again === 0 ? -1 : Math.max(0, would_take_again)}
                        color={`hsl(${would_take_again}, 90%, 50%)`}
                    >
                        <CircularProgressLabel>{would_take_again < 0 ? "N/A" : would_take_again}</CircularProgressLabel>
                    </CircularProgress>
                </VStack>
            </HStack>

            <GradesGraph grades={grades} subject={subject} course_number={course_number} />

            <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="md">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>
                        <VStack>
                            <Button
                                leftIcon={<Image src="RMPIcon.png" boxSize={42} />}
                                onClick={() => window.open(RateMyProfessorUrl, "_blank")}
                                variant={"outline"}
                                fontWeight={"medium"}
                                width={240}
                            >
                                Rate My Professor
                            </Button>
                            <Button
                                leftIcon={<Image src="UTDGradesIcon.png" boxSize={22} />}
                                onClick={() => window.open(UTDGradesUrl, "_blank")}
                                variant={"outline"}
                                fontWeight={"medium"}
                                width={240}
                            >
                                UTD Grades
                            </Button>
                            <Button
                                leftIcon={<Image src={useColorModeValue("UTDTrendsDark.svg", "UTDTrendsLight.svg")} boxSize={5} />}
                                onClick={() => window.open(UTDTrendsUrl, "_blank")}
                                variant={"outline"}
                                fontWeight={"medium"}
                                width={240}
                            >
                                UTD Trends
                            </Button>
                            <Button
                                leftIcon={<Image src="UTDIcon.png" boxSize={23} />}
                                onClick={() => window.open(UTDProfileUrl, "_blank")}
                                variant={"outline"}
                                fontWeight={"medium"}
                                width={240}
                            >
                                Professor Profile
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </VStack>
    );
}

ProfResults.propTypes = {
    professorInfo: PropTypes.shape({
        name: PropTypes.string,
        department: PropTypes.string,
        id: PropTypes.string,
        subject: PropTypes.string,
        course_number: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        rating: PropTypes.number,
        difficulty: PropTypes.number,
        would_take_again: PropTypes.number,
        grades: PropTypes.object,
    }).isRequired,
};

export default ProfResults;
