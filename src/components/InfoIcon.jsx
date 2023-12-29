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
    useColorMode,
    Image,
    Tooltip as ChakraTooltip,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

function InfoIcon() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();

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
                <ModalContent maxW={"20rem"}>
                    <ModalHeader>Options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ChakraTooltip label="Submit bug reports and feature requests through Github" placement="bottom">
                            <Button
                                leftIcon={
                                    <Image
                                        src={colorMode === "dark" ? "extension-images/OctoCat-Light.png" : "extension-images/OctoCat-Dark.svg"}
                                        height={8}
                                    />
                                }
                                onClick={() => window.open("https://github.com/GiridharRNair/ProfStatsUTD/issues/new/choose", "_blank")}
                                variant="outline"
                                mr={3}
                            >
                                GitHub
                            </Button>
                        </ChakraTooltip>
                        <Button onClick={toggleColorMode}>Toggle {colorMode === "light" ? "Dark" : "Light"}</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default InfoIcon;
