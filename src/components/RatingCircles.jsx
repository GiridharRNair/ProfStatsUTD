import { Text, VStack, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

const RenderRatingCircle = (label, value) => {
    let color;
    
    if (label === 'Difficulty') {
        color = `hsl(${((5 - value) / 5) * 100}, 90%, 50%)`;
    } else {
        color = value <= 5 ? `hsl(${(value / 5) * 100}, 90%, 50%)` : `hsl(${(value / 100) * 100}, 90%, 50%)`;
    }
  
    return (
      <VStack w={15}>
        <Text>{label}</Text>
        <CircularProgress 
            size='55px' 
            thickness='10px' 
            value={(value <= 5) ? ((value / 5) * 100) : value} 
            color={color}
        >
            <CircularProgressLabel>{value}</CircularProgressLabel>
        </CircularProgress>
      </VStack>
    );
};

export default RenderRatingCircle;