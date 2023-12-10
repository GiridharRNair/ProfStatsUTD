import React from 'react';
import { Box, Image, Text, Button, useColorMode } from '@chakra-ui/react';

const NotFoundPage = () => {
    const { colorMode } = useColorMode();
    
    return (
        <Box textAlign="center" pt={3} pb={8}>
            <Image src={colorMode === 'dark' ? '404-light.png' : '404-dark.png'} height={'10rem'} mx="auto" mt={3} alt="404 Error Illustration" />
            <Text mt={2}>
                Oops! It seems like there's no data. Please double check your inputs and try again.
            </Text>
            <Text mt={2} pb={3}>
                If you believe this is an error, please submit a bug report on GitHub.
            </Text>
            <Button leftIcon={<Image src={colorMode === 'dark' ? 'OctoCat-Light.png' : 'OctoCat-Dark.svg'} height={8} />} variant="outline" onClick={() => window.open('https://github.com/GiridharRNair/ProfStatsUTD/issues/new/choose', '_blank')}>
                GitHub
            </Button>
        </Box>
    );
};

export default NotFoundPage;
