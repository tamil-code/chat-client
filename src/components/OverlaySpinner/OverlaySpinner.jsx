import React from 'react';
import { Spinner, Box } from '@chakra-ui/react';

const OverlaySpinner = ({ isLoading,children}) => {
  return (
    <Box position="relative">
      {/* Your content goes here */}
      {children}

      {/* Overlay Spinner */}
      {isLoading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(255, 255, 255, 0.8)" // Adjust the background color and opacity
          zIndex="1"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}
    </Box>
  );
};

export default OverlaySpinner;
