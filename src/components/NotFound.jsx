import { Box, Image, Text, Button, useColorMode, Icon } from "@chakra-ui/react";
import { FcFeedback } from "react-icons/fc";

const NotFoundPage = () => {
    const { colorMode } = useColorMode();

    return (
        <Box textAlign="center" pt={3} pb={8}>
            <Image
                src={colorMode === "dark" ? "extension-images/404-light.png" : "extension-images/404-dark.png"}
                alt="404 Error Illustration"
                height={"10rem"}
                mx="auto"
                mt={3}
            />
            <Text mt={2}>Oops! It seems like there&#39;s no data. Please double check your inputs and try again.</Text>
            <Text mt={2} pb={3}>
                If you believe this is an error, please let us know below.
            </Text>
            <Button
                leftIcon={<Icon as={FcFeedback} boxSize={6} />}
                onClick={() => window.open("https://forms.gle/gc2G34o2BiiXs4bz7", "_blank")}
                variant="outline"
            >
                Feedback Form
            </Button>
        </Box>
    );
};

export default NotFoundPage;
