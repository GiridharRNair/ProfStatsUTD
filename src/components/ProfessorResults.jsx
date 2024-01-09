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
    Image,
    useColorModeValue,
    CircularProgress,
    CircularProgressLabel,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import GradesGraph from "./GradesGraph.jsx";

function ProfResults({ professorInfo }) {
    const { name, department, id, subject, course_number, tags, rating, difficulty, would_take_again, grades } = professorInfo;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const RateMyProfessorUrl = `https://www.ratemyprofessors.com/professor/${id}`;
    const UTDGradesUrl = `https://utdgrades.com/results?search=${subject ? subject + course_number + "+" : ""}${name.replace(" ", "+")}`;
    const UTDTrendsUrl = `https://trends.utdnebula.com/dashboard?searchTerms=${subject ? subject + "+" + course_number + "+" : ""}${name.replace(" ", "+")}`;
    const UTDProfileUrl = `https://profiles.utdallas.edu/browse?search=${name.replace(" ", "+")}`;

    return (
        <VStack width={325}>
            <ChakraTooltip label="Click for more information" placement="bottom">
                <Button
                    fontSize="lg"
                    variant={"link"}
                    height={6}
                    fontWeight={"normal"}
                    textColor={useColorModeValue("black", "white")}
                    onClick={onOpen}
                    onFocus={(e) => e.preventDefault()}
                    _hover={{ color: "#3182CE" }}
                >
                    {name}
                </Button>
            </ChakraTooltip>

            <Text fontSize="md">{department}</Text>

            <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="md">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>
                        <VStack>
                            <Button
                                leftIcon={<Image src="extension-images/RMPIcon.png" boxSize={42} />}
                                onClick={() => window.open(RateMyProfessorUrl, "_blank")}
                                variant={"outline"}
                                width={240}
                            >
                                Rate My Professor
                            </Button>
                            <Button
                                leftIcon={<Image src="extension-images/UTDGradesIcon.png" boxSize={22} />}
                                onClick={() => window.open(UTDGradesUrl, "_blank")}
                                variant={"outline"}
                                width={240}
                            >
                                UTD Grades
                            </Button>
                            <Button
                                leftIcon={
                                    <Image src={useColorModeValue("extension-images/UTDTrendsDark.svg", "extension-images/UTDTrendsLight.svg")} boxSize={5} />
                                }
                                onClick={() => window.open(UTDTrendsUrl, "_blank")}
                                variant={"outline"}
                                width={240}
                            >
                                UTD Trends
                            </Button>
                            <Button
                                leftIcon={<Image src="extension-images/UTDIcon.png" boxSize={23} />}
                                onClick={() => window.open(UTDProfileUrl, "_blank")}
                                variant={"outline"}
                                width={240}
                            >
                                Professor Profile
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {tags && (
                <Wrap justify={"center"}>
                    {tags.map((tag, index) => (
                        <WrapItem key={index}>
                            <Tag size="sm" variant="outline">
                                {tag}
                            </Tag>
                        </WrapItem>
                    ))}
                </Wrap>
            )}

            <HStack w={250}>
                <VStack w={15}>
                    <Text>Quality</Text>
                    <CircularProgress
                        max={5}
                        size="55px"
                        thickness="10px"
                        value={rating === 0 ? -20 : Math.max(0, rating)}
                        color={`hsl(${(Math.max(0, rating) / 5) * 100}, 90%, 50%)`}
                    >
                        <CircularProgressLabel>{rating < 0 ? "N/A" : rating}</CircularProgressLabel>
                    </CircularProgress>
                </VStack>
                <Spacer />
                <VStack w={15}>
                    <Text>Difficulty</Text>
                    <CircularProgress
                        max={5}
                        size="55px"
                        thickness="10px"
                        value={difficulty === 0 ? -20 : Math.max(0, difficulty)}
                        color={`hsl(${((5 - Math.max(0, difficulty)) / 5) * 100}, 90%, 50%)`}
                    >
                        <CircularProgressLabel>{difficulty < 0 ? "N/A" : difficulty}</CircularProgressLabel>
                    </CircularProgress>
                </VStack>
                <Spacer />
                <VStack w={15}>
                    <Text>Enjoyment</Text>
                    <CircularProgress
                        max={100}
                        size="55px"
                        thickness="10px"
                        value={would_take_again === 0 ? -20 : Math.max(0, would_take_again)}
                        color={`hsl(${would_take_again}, 90%, 50%)`}
                    >
                        <CircularProgressLabel>{would_take_again < 0 ? "N/A" : would_take_again}</CircularProgressLabel>
                    </CircularProgress>
                </VStack>
            </HStack>

            <GradesGraph grades={grades} />
        </VStack>
    );
}

ProfResults.propTypes = {
    professorInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        department: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        subject: PropTypes.string,
        course_number: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        rating: PropTypes.number.isRequired,
        difficulty: PropTypes.number.isRequired,
        would_take_again: PropTypes.number.isRequired,
        grades: PropTypes.object.isRequired,
    }).isRequired,
};

export default ProfResults;
