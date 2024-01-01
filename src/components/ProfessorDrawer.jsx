import { Drawer, DrawerBody, DrawerOverlay, DrawerContent, Button, VStack, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ProfessorDrawer = ({ isOpen, onClose, id, subject, courseNumber, name, colorMode }) => {
    const RateMyProfessorUrl = "https://www.ratemyprofessors.com/professor/";
    const UTDGradesUrl = "https://utdgrades.com/results?search=";
    const UTDTrendsUrl = "https://trends.utdnebula.com/dashboard?searchTerms=";
    const UTDProfileUrl = "https://profiles.utdallas.edu/browse?search=";

    return (
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="md">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerBody>
                    <VStack>
                        <Button
                            leftIcon={<Image src="extension-images/RMPIcon.png" boxSize={42} />}
                            onClick={() => window.open(`${RateMyProfessorUrl}${id}`, "_blank")}
                            variant={"outline"}
                            width={240}
                        >
                            Rate My Professor
                        </Button>
                        <Button
                            leftIcon={<Image src="extension-images/UTDGradesIcon.png" boxSize={22} />}
                            onClick={() => window.open(`${UTDGradesUrl}${subject ? subject + courseNumber : ""}+${name.replace(" ", "+")}`, "_blank")}
                            variant={"outline"}
                            width={240}
                        >
                            UTD Grades
                        </Button>
                        <Button
                            leftIcon={
                                <Image
                                    src={colorMode === "dark" ? "extension-images/UTDTrendsLight.svg" : "extension-images/UTDTrendsDark.svg"}
                                    boxSize={5}
                                />
                            }
                            onClick={() =>
                                window.open(`${UTDTrendsUrl}${subject ? subject + "+" + courseNumber : ""}+${name.replace(" ", "+")}`, "_blank")
                            }
                            variant={"outline"}
                            width={240}
                        >
                            UTD Trends
                        </Button>
                        <Button
                            leftIcon={<Image src="extension-images/UTDIcon.png" boxSize={23} />}
                            onClick={() => window.open(`${UTDProfileUrl}${name.replace(" ", "+")}`, "_blank")}
                            variant={"outline"}
                            width={240}
                        >
                            Professor Profile
                        </Button>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

ProfessorDrawer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    subject: PropTypes.string,
    courseNumber: PropTypes.string,
    name: PropTypes.string.isRequired,
    colorMode: PropTypes.string.isRequired,
};

export default ProfessorDrawer;
