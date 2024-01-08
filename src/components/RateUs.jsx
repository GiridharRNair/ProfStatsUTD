import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    VStack,
    Icon,
    Heading,
    Center,
} from "@chakra-ui/react";
import { FcFeedback } from "react-icons/fc";

function RateUs({ rateUsModeOpen, setRateUsModeOpen }) {
    return (
        <Modal isOpen={rateUsModeOpen} onClose={() => setRateUsModeOpen(false)} size="md">
            <ModalOverlay />
            <ModalContent width={"18"}>
                <ModalHeader>Do you like this app?</ModalHeader>
                <ModalCloseButton />
                <Center>
                    <Heading size="xs" mb={4}>
                        We would love to hear your feedback!
                    </Heading>
                </Center>
                <ModalBody>
                    <VStack>
                        <Button
                            leftIcon={<Icon as={FcFeedback} boxSize={6} />}
                            onClick={() => window.open("https://forms.gle/gc2G34o2BiiXs4bz7", "_blank")}
                            variant="outline"
                            width={250}
                        >
                            Feedback Form
                        </Button>
                        <Button
                            leftIcon={<Image src="extension-images/ChromeWebStore.png" boxSize={23} />}
                            onClick={() => window.open("https://chromewebstore.google.com/u/1/detail/doilmgfedjlpepeaolcfpdmkehecdaff/reviews", "_blank")}
                            variant="outline"
                            width={250}
                        >
                            Rate us
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default RateUs;
