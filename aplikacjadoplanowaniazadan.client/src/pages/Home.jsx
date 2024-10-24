import React from "react";
import { Box, Grid, Typography, Paper } from '@mui/material';
import SideBar from "../components/SideBar";
import Button from '@mui/material/Button';
import Today from "../components/Today";
import Calendar from "../components/Calendar";

const Home = () => {
    const [selected, setSelected] = React.useState("Today");

    const handleSelect = (newSelection) => {
        setSelected(newSelection)
    }

    return (
        <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={24}
                    sx={{
                        borderRadius: { xs: 0, sm: '20px' },
                        display: 'flex', flexDirection: 'row',
                        flexGrow: 1, overflow: 'hidden',  
                        mx: { xs: 0, sm: "6rem", lg: "8rem" },
                        my: { xs: 0, sm: "4rem", lg: "6rem" },
                        maxWidth: 'lg', maxHeight: 'lg',
                    }}
                >
                    <SideBar handleSelect={handleSelect} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Today hidden={selected !== "Today"} />
                        <Calendar hidden={selected !== "Calendar"} />
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Home;