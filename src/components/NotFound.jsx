import { Box, Image, Text, Button, useColorMode } from '@chakra-ui/react';

const NotFoundPage = () => {
    const { colorMode } = useColorMode();
    
    return (
        <Box textAlign="center" pt={3} pb={8}>
            <Image 
                src={colorMode === 'dark' ? 'extension-images/404-light.png' : 'extension-images/404-dark.png'} 
                alt="404 Error Illustration" 
                height={'10rem'} 
                mx="auto" 
                mt={3} 
            />
            <Text mt={2}>
                Oops! It seems like there&#39;s no data. Please double check your inputs and try again.
            </Text>
            <Text mt={2} pb={3}>
                If you believe this is an error, please submit a bug report on GitHub.
            </Text>
            <Button 
                leftIcon={<Image src={colorMode === 'dark' ? 'extension-images/OctoCat-Light.png' : 'extension-images/OctoCat-Dark.svg'} height={8} />} 
                onClick={() => window.open('https://github.com/GiridharRNair/ProfStatsUTD/issues/new/choose', '_blank')}
                variant="outline" 
            >
                GitHub
            </Button>
        </Box>
    );
};

export default NotFoundPage;
