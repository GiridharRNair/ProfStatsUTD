import React, { useState } from 'react';
import { 
  IconButton, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader, 
  ModalBody, 
  ModalCloseButton, 
  Button,
  useColorMode,
  Image,
  Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

function InfoIcon() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label="Feedback?"
        icon={<InfoOutlineIcon />}
        size={'sm'}
        position="fixed"
        top="1"
        left="1"
        onClick={openModal}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} size="sm">
        <ModalOverlay />
        <ModalContent maxW={'20rem'}>
          <ModalHeader>Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ChakraTooltip label="Submit issues and feature requests through Github" placement='bottom'>
              <Button leftIcon={<Image src='/OctoCat.svg' height={8} />} variant="outline" onClick={() => window.open('https://github.com/GiridharRNair/ProfStatsUTD/issues/new/choose', '_blank')} mr={3}>
                GitHub
              </Button>
            </ChakraTooltip>
            <Button onClick={toggleColorMode}>Toggle {colorMode === 'light' ? 'Dark' : 'Light'}</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InfoIcon;
