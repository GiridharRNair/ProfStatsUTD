import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Image, VStack, Icon, Heading, Center } from "@chakra-ui/react";
import { FcFeedback } from "react-icons/fc";

function RateUsModal() {
    const [rateUsModalOpen, setRateUsModalOpen] = useState(localStorage.getItem("LastInputData") && !localStorage.getItem("hasRated") && Math.random() < 0.4);
    const [buttonTextColor, setButtonTextColor] = useState("#333");

    const generateGradientColor = () => {
        const time = new Date().getTime();
        const red = Math.sin(0.001 * time) * 127 + 128;
        const green = Math.sin(0.001 * time + 4) * 127 + 128;
        const blue = Math.sin(0.001 * time + 8) * 127 + 128;
        return `rgb(${red}, ${green}, ${blue})`;
    };

    useEffect(() => {
        const interval = setInterval(() => setButtonTextColor(generateGradientColor()), 100);
        return () => clearInterval(interval);
    }, []);

    const openFeedbackForm = (url) => () => {
        window.open(url, "_blank");
        localStorage.setItem("hasRated", true);
    };

    return (
        <Modal isOpen={rateUsModalOpen} onClose={() => setRateUsModalOpen(false)} size="md">
            <ModalOverlay />
            <ModalContent width={300}>
                <ModalHeader mb={-4}>Your input matters!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center>
                        <Heading size="xs" mb={4} fontWeight="normal">
                            Help us improve by leaving a review or filling out the feedback form.
                        </Heading>
                    </Center>
                    <VStack pb={1}>
                        <Button
                            leftIcon={<Icon as={FcFeedback} boxSize={6} />}
                            onClick={openFeedbackForm("https://forms.gle/gc2G34o2BiiXs4bz7")}
                            variant="outline"
                            fontWeight="medium"
                            width={250}
                        >
                            Feedback Form
                        </Button>
                        <Button
                            leftIcon={<Image src="extension-images/ChromeWebStore.png" boxSize={23} />}
                            onClick={openFeedbackForm("https://chromewebstore.google.com/detail/doilmgfedjlpepeaolcfpdmkehecdaff/reviews")}
                            variant="outline"
                            fontWeight="medium"
                            width={250}
                            borderColor={buttonTextColor}
                            textColor={buttonTextColor}
                        >
                            Leave a Review
                        </Button>
                        <Button
                            pt={1}
                            onClick={() => {
                                localStorage.setItem("hasRated", true);
                                setRateUsModalOpen(false);
                            }}
                            variant="link"
                            fontWeight="medium"
                            size="xs"
                            _hover={{ color: "#3182CE" }}
                        >
                            Don&apos;t show again
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default RateUsModal;
