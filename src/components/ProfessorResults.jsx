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
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import DrawerButton from "./DrawerButton.jsx";
import GradesGraph from "./GradesGraph.jsx";

function CircularProgressBar({ title, value, max, color, label }) {
    return (
        <VStack w={15}>
            <Text height={4}>{title}</Text>
            <CircularProgress max={max} size={"55px"} thickness={"10px"} value={value} color={color}>
                <CircularProgressLabel>{label}</CircularProgressLabel>
            </CircularProgress>
        </VStack>
    );
}

CircularProgressBar.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function ProfResults({ professorInfo }) {
    const { name, department, id, subject, course_number, tags, rating, difficulty, would_take_again, grades } = professorInfo;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const RateMyProfessorUrl = `https://www.ratemyprofessors.com/professor/${id}`;
    const UTDGradesUrl = `https://utdgrades.com/results?search=${subject ? subject + course_number + "+" : ""}${name.replace(" ", "+")}`;
    const UTDTrendsUrl = `https://trends.utdnebula.com/dashboard?searchTerms=${subject ? subject + "+" + course_number + "+" : ""}${name.replace(" ", "+")}`;
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
                <CircularProgressBar
                    title="Rating"
                    value={rating === 0 ? -1 : Math.max(0, rating)}
                    max={5}
                    color={`hsl(${(Math.max(0, rating) / 5) * 100}, 90%, 50%)`}
                    label={rating < 0 ? "N/A" : rating}
                />
                <Spacer />
                <CircularProgressBar
                    title="Difficulty"
                    value={difficulty === 0 ? -1 : Math.max(0, difficulty)}
                    max={5}
                    color={`hsl(${((5 - Math.max(0, difficulty)) / 5) * 100}, 90%, 50%)`}
                    label={difficulty < 0 ? "N/A" : difficulty}
                />
                <Spacer />
                <CircularProgressBar
                    title="Enjoyment"
                    value={would_take_again === 0 ? -1 : Math.max(0, would_take_again)}
                    max={100}
                    color={`hsl(${would_take_again}, 90%, 50%)`}
                    label={would_take_again < 0 ? "N/A" : would_take_again}
                />
            </HStack>

            <GradesGraph grades={grades} />

            <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="md">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>
                        <VStack>
                            <DrawerButton iconSrc="extension-images/RMPIcon.png" buttonText="Rate My Professor" url={RateMyProfessorUrl} boxSize={42} />
                            <DrawerButton iconSrc="extension-images/UTDGradesIcon.png" buttonText="UTD Grades" url={UTDGradesUrl} boxSize={22} />
                            <DrawerButton
                                iconSrc={useColorModeValue("extension-images/UTDTrendsDark.svg", "extension-images/UTDTrendsLight.svg")}
                                buttonText="UTD Trends"
                                url={UTDTrendsUrl}
                                boxSize={5}
                            />
                            <DrawerButton iconSrc="extension-images/UTDIcon.png" buttonText="Professor Profile" url={UTDProfileUrl} boxSize={23} />
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
