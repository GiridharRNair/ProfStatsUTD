import { Text, HStack, VStack, Spacer, Tag, Wrap, WrapItem, Tooltip as ChakraTooltip, useDisclosure, useColorMode, Button } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ProfessorDrawer from "./ProfessorDrawer.jsx";
import RenderRatingCircle from "./RatingCircles.jsx";
import GradesGraph from "./GradesGraph.jsx";

function ProfResults({ professorInfo }) {
    const { name, department, id, subject, course_number, tags, rating, difficulty, would_take_again, grades } = professorInfo;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode } = useColorMode();

    return (
        <VStack width={325}>
            <ChakraTooltip label="Click for more information" placement="bottom">
                <Button
                    fontSize="lg"
                    _hover={{ color: "#3182CE" }}
                    onClick={onOpen}
                    variant={"link"}
                    height={6}
                    onFocus={(e) => e.preventDefault()}
                    fontWeight={"normal"}
                    textColor={colorMode === "light" ? "black" : "white"}
                >
                    {name}
                </Button>
            </ChakraTooltip>

            <Text fontSize="md">{department}</Text>

            <ProfessorDrawer isOpen={isOpen} onClose={onClose} id={id} subject={subject} courseNumber={course_number} name={name} />

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
                {RenderRatingCircle("Quality", rating)}
                <Spacer />
                {RenderRatingCircle("Difficulty", difficulty)}
                <Spacer />
                {RenderRatingCircle("Enjoyment", would_take_again)}
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
