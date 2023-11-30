import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import { Button, useColorMode } from '@chakra-ui/react';

const NotFoundPage = () => {
    const { colorMode } = useColorMode();

    return (
        <Box textAlign="center">
            <Image src={colorMode === 'dark' ? '404-light.png' : '404-dark.png'} height={'10rem'} mx="auto" mt={3} alt="404 Error" />
            <Text mt={2}>
                Oops! It seems like there's no data for this professor. Please double check your input and try again.
            </Text>
            <Text mt={2} pb={5}>
                If this issue persists, please submit a bug report on GitHub.
            </Text>
            <Button leftIcon={<Image src='/OctoCat.svg' height={8} />} variant="outline" onClick={() => window.open('https://github.com/GiridharRNair/ProfStatsUTD/issues/new/choose', '_blank')}>
                GitHub
            </Button>
        </Box>
    );
};

export default NotFoundPage;
