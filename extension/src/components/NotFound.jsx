/**
 * NotFoundPage Component
 * 
 * Displays a custom 404 error page with an image, error message, and GitHub issue submission button.
 */

import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import { Button, useColorMode } from '@chakra-ui/react';

const NotFoundPage = () => {
    const { colorMode } = useColorMode();

    return (
        <Box textAlign="center" pt={3} pb={8}>
            {/* Display an image based on the current color mode */}
            <Image src={colorMode === 'dark' ? '404-light.png' : '404-dark.png'} height={'10rem'} mx="auto" mt={3} alt="404 Error" />

            {/* Error message */}
            <Text mt={2}>
                Oops! It seems like there's no data. Please double check your inputs and try again.
            </Text>

            {/* Instruction to submit an issue on GitHub */}
            <Text mt={2} pb={3}>
                If you believe this is an error, please submit a bug report on GitHub.
            </Text>

            {/* GitHub button with OctoCat icon, opens a new tab with the GitHub issue submission link */}
            <Button leftIcon={<Image src='/OctoCat.svg' height={8} />} variant="outline" onClick={() => window.open('https://github.com/GiridharRNair/ProfStatsUTD/issues/new/choose', '_blank')}>
                GitHub
            </Button>
        </Box>
    );
};

export default NotFoundPage;
