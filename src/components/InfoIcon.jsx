import { useState } from "react";
import {
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    Icon,
} from "@chakra-ui/react";
import { FcFeedback } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { InfoOutlineIcon } from "@chakra-ui/icons";

function InfoIcon() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackButtonIsHovered, setFeedbackButtonIsHovered] = useState(false);
    const [githubButtonIsHovered, setGithubButtonIsHovered] = useState(false);

    return (
        <>
            <IconButton
                aria-label="Feedback?"
                icon={<InfoOutlineIcon />}
                size={"sm"}
                position="fixed"
                top="1"
                left="1"
                onClick={() => setIsModalOpen(true)}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
                <ModalOverlay />
                <ModalContent width={"18"}>
                    <ModalHeader>Options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <Button
                                leftIcon={!feedbackButtonIsHovered && <Icon as={FcFeedback} boxSize={6} />}
                                onClick={() => window.open("https://forms.gle/gc2G34o2BiiXs4bz7", "_blank")}
                                variant="outline"
                                width={250}
                                onMouseEnter={() => setFeedbackButtonIsHovered(true)}
                                onMouseLeave={() => setFeedbackButtonIsHovered(false)}
                            >
                                {feedbackButtonIsHovered ? "Any issues? Suggestions?" : "Feedback Form"}
                            </Button>
                            <Button
                                leftIcon={!githubButtonIsHovered && (<Icon as={FaGithub} boxSize={6} />)}
                                onClick={() => window.open("https://github.com/GiridharRNair/ProfStatsUTD", "_blank")}
                                variant="outline"
                                width={250}
                                onMouseEnter={() => setGithubButtonIsHovered(true)}
                                onMouseLeave={() => setGithubButtonIsHovered(false)}
                            >
                                {githubButtonIsHovered ? "Check out the source code!" : "GitHub"}
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default InfoIcon;
