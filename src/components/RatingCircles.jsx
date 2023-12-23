import { Text, VStack, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

const RenderRatingCircle = (label, value) => {
    if ((label === 'Quality' || label === 'Difficulty') && value > 5) {
        value = 5; // Weird bug in Rate My Professors API where ratings can be > 5
    }

    const getHSLColor = (value, factor) => (value === -1) ? 0 : `hsl(${factor(value) * 100}, 90%, 50%)`;

    const getColor = () => {
        switch (label) {
            case 'Difficulty':
                return getHSLColor(value, v => (5 - v) / 5);
            case 'Quality':
                return getHSLColor(value, v => v / 5);
            case 'Enjoyment':
                return getHSLColor(value, v => v / 100);
            default:
                return 0;
        }
    };

    const getProgressValue = () => {
        if (value < 0) return 0; // Value = -1 means N/A
        if (value === 0) return -20; // Negative values fill circle
        return (value <= 5 && label !== "Enjoyment") ? (value / 5) * 100 : value;
    };

    return (
        <VStack w={15}>
            <Text>{label}</Text>
            <CircularProgress
                size='55px'
                thickness='10px'
                value={getProgressValue()}
                color={getColor()}
            >
                <CircularProgressLabel>{(value < 0 ? 'N/A' : value)}</CircularProgressLabel>
            </CircularProgress>
        </VStack>
    );
};

export default RenderRatingCircle;
