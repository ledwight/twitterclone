import { Box } from '@chakra-ui/core';
import React, { Children } from 'react'

interface wrapperProps {
    variant?: "small" | "regular",
    backgroundColor?: string
}

export const Wrapper: React.FC<wrapperProps> = ({ children, variant = "regular", backgroundColor }) => {
    return (
        <Box mt={8} mx="auto" maxW={variant == "small" ? "400px" : "800px"} w="100%" bg={backgroundColor}>
            {children}
        </Box>
    );
}