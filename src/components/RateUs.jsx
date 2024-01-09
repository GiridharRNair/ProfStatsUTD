import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Image, VStack, Icon, Heading, Center } from "@chakra-ui/react";
import { FcFeedback } from "react-icons/fc";
import PropTypes from "prop-types";

function RateUs({ rateUsModalOpen, setRateUsModalOpen }) {
    return (
        <Modal isOpen={rateUsModalOpen} onClose={() => setRateUsModalOpen(false)} size="md">
            <ModalOverlay />
            <ModalContent width={300}>
                <ModalHeader>Do you like this app?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center>
                        <Heading size="xs" mb={6} fontWeight={"normal"}>
                            What are your thoughts so far? Please consider leaving a review or feedback to help us improve!
                        </Heading>
                    </Center>
                    <VStack>
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

RateUs.propTypes = {
    rateUsModalOpen: PropTypes.bool.isRequired,
    setRateUsModalOpen: PropTypes.func.isRequired,
};

export default RateUs;
