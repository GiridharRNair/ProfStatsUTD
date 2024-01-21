import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Image, VStack, Icon, Heading, Center } from "@chakra-ui/react";
import { FcFeedback } from "react-icons/fc";

function RateUsModal() {
    const [rateUsModalOpen, setRateUsModalOpen] = useState(localStorage.getItem("LastInputData") && !localStorage.getItem("hasRated") && Math.random() < 1.25);

    return (
        <Modal isOpen={rateUsModalOpen} onClose={() => setRateUsModalOpen(false)} size="md">
            <ModalOverlay />
            <ModalContent width={300}>
                <ModalHeader>How are we doing?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center>
                        <Heading size="xs" mb={6} fontWeight={"normal"}>
                            Share your thoughts! Help us improve by leaving a review or filling out the feedback form. Your input matters!
                        </Heading>
                    </Center>
                    <VStack pb={1}>
                        <Button
                            leftIcon={<Icon as={FcFeedback} boxSize={6} />}
                            onClick={() => {
                                window.open("https://forms.gle/gc2G34o2BiiXs4bz7", "_blank");
                                localStorage.setItem("hasRated", true);
                            }}
                            variant="outline"
                            width={250}
                        >
                            Feedback Form
                        </Button>
                        <Button
                            leftIcon={<Image src="extension-images/ChromeWebStore.png" boxSize={23} />}
                            onClick={() => {
                                window.open("https://chromewebstore.google.com/detail/doilmgfedjlpepeaolcfpdmkehecdaff/reviews", "_blank");
                                localStorage.setItem("hasRated", true);
                            }}
                            variant="outline"
                            width={250}
                        >
                            Leave a Review
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default RateUsModal;
