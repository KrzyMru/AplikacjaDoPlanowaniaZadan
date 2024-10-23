import * as React from 'react';
import Box from '@mui/material/Box';

export default function Calendar({ hidden }) {

    return (
        <Box 
            sx={{
                display: hidden ? 'none' : 'flex',
                backgroundColor: 'red', height: '100%',
            }}
        >
        </Box>
    );
}