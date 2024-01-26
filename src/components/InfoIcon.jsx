import { useState } from "react";
import { IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, VStack, Icon } from "@chakra-ui/react";
import { FcFeedback } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { InfoOutlineIcon } from "@chakra-ui/icons";

function InfoIcon() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackButtonIsHovered, setFeedbackButtonIsHovered] = useState(false);
    const [githubButtonIsHovered, setGithubButtonIsHovered] = useState(false);

    return (
        <>
            <IconButton onClick={() => setIsModalOpen(true)} icon={<InfoOutlineIcon />} size={"sm"} position="fixed" top="1" left="1" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
                <ModalOverlay />
                <ModalContent width={300}>
                    <ModalHeader>Options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack pb={1}>
                            <Button
                                leftIcon={!feedbackButtonIsHovered && <Icon as={FcFeedback} boxSize={6} />}
                                onClick={() => window.open("https://forms.gle/gc2G34o2BiiXs4bz7", "_blank")}
                                onMouseEnter={() => setFeedbackButtonIsHovered(true)}
                                onMouseLeave={() => setFeedbackButtonIsHovered(false)}
                                variant="outline"
                                fontWeight={"medium"}
                                width={250}
                            >
                                {feedbackButtonIsHovered ? "Any issues? Suggestions?" : "Feedback Form"}
                            </Button>
                            <Button
                                leftIcon={!githubButtonIsHovered && <Icon as={FaGithub} boxSize={6} />}
                                onClick={() => window.open("https://github.com/GiridharRNair/ProfStatsUTD", "_blank")}
                                onMouseEnter={() => setGithubButtonIsHovered(true)}
                                onMouseLeave={() => setGithubButtonIsHovered(false)}
                                variant="outline"
                                fontWeight={"medium"}
                                width={250}
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
