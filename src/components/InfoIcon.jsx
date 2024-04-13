import { useState } from "react";
import { IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, VStack, Icon } from "@chakra-ui/react";
import { FcFeedback } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { InfoOutlineIcon } from "@chakra-ui/icons";

function InfoIcon() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <IconButton onClick={() => setIsModalOpen(true)} icon={<InfoOutlineIcon />} size={"sm"} position="fixed" top="1" left="1" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
                <ModalOverlay />
                <ModalContent width={300}>
                    <ModalHeader mb={-2}>Options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack pb={1}>
                            <Button
                                leftIcon={<Icon as={FcFeedback} boxSize={6} />}
                                onClick={() => window.open("https://forms.gle/gc2G34o2BiiXs4bz7", "_blank")}
                                variant="outline"
                                fontWeight={"medium"}
                                width={250}
                            >
                                Feedback Form
                            </Button>
                            <Button
                                leftIcon={<Icon as={FaGithub} boxSize={6} />}
                                onClick={() => window.open("https://github.com/GiridharRNair/ProfStatsUTD", "_blank")}
                                variant="outline"
                                fontWeight={"medium"}
                                width={250}
                            >
                                Github
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default InfoIcon;
