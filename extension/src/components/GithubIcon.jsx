import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

function GithubIcon() {
  const openFeedbackTab = () => {
    window.open('https://github.com/GiridharRNair/ProfStatsUTD/issues/new/choose', '_blank');
  };

  return (
    <Tooltip label="Feedback?" placement='right'>
      <IconButton
        aria-label="Feedback?"
        icon={<InfoOutlineIcon />}
        size={'sm'}
        variant="ghost"
        position="fixed"
        top="1"
        left="1"
        onClick={openFeedbackTab}
      />
    </Tooltip>
  );
}

export default GithubIcon;
