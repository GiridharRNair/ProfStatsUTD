import { useState, useEffect } from "react";
import {
    HStack,
    IconButton,
    useColorMode,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Image,
    VStack,
    Icon,
    Heading,
    Center,
} from "@chakra-ui/react";
import { FiMoon } from "react-icons/fi";
import { SunIcon } from "@chakra-ui/icons";
import { FcFeedback } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import LookupForm from "@/components/lookup-form";

const FEEDBACK_FORM_URL = "https://forms.gle/gc2G34o2BiiXs4bz7";
const REVIEW_URL = "https://chromewebstore.google.com/detail/doilmgfedjlpepeaolcfpdmkehecdaff/reviews";
const GITHUB = "https://github.com/GiridharRNair/ProfStatsUTD";

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
                                onClick={() => window.open(FEEDBACK_FORM_URL, "_blank")}
                                variant="outline"
                                fontWeight={"medium"}
                                width={250}
                            >
                                Feedback Form
                            </Button>
                            <Button
                                leftIcon={<Icon as={FaGithub} boxSize={6} />}
                                onClick={() => window.open(GITHUB, "_blank")}
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
                            onClick={openFeedbackForm(FEEDBACK_FORM_URL)}
                            variant="outline"
                            fontWeight="medium"
                            width={250}
                        >
                            Feedback Form
                        </Button>
                        <Button
                            leftIcon={<Image src="ChromeWebStore.png" boxSize={23} />}
                            onClick={openFeedbackForm(REVIEW_URL)}
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

function App() {
    const [compareFormOpen, setCompareFormOpen] = useState(JSON.parse(localStorage.getItem("compareFormOpen")));
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <RateUsModal />
            <InfoIcon />
            <Button
                onClick={() => {
                    setCompareFormOpen(!compareFormOpen);
                    localStorage.setItem("compareFormOpen", !compareFormOpen);
                }}
                position="fixed"
                top="1"
                left="50%"
                transform="translateX(-50%)"
                height={8}
                fontSize={"sm"}
                fontWeight={"medium"}
            >
                {compareFormOpen ? "Revert" : "Compare"}
            </Button>
            <IconButton icon={colorMode === "dark" ? <SunIcon /> : <FiMoon />} size={"sm"} position="fixed" top="1" right="1" onClick={toggleColorMode} />

            <HStack spacing={12} align="flex-start">
                {compareFormOpen && <LookupForm isCompareForm={compareFormOpen} />}
                <LookupForm />
            </HStack>
        </>
    );
}

export default App;
