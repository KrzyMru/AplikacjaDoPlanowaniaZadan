import React from "react";
import { Box, Grid, Typography, Paper } from '@mui/material';
import SideBar from "../components/SideBar";
import Button from '@mui/material/Button';
import Today from "../components/screens/Today";
import Calendar from "../components/screens/Calendar";
import TaskList from "../components/screens/TaskList";
import Notifications from "../components/screens/Notifications";
import CoverLight from '../assets/coverLight.jpg';
import CoverDark from '../assets/coverDark.jpg';

const Home = ({ token, settings, setSettings, icons }) => {
    const [selected, setSelected] = React.useState("Today");
    const [taskListHeaders, setTaskListHeaders] = React.useState([]);

    const handleSelect = (newSelection) => {
        setSelected(newSelection)
    }

    return (
        <Grid container
            sx={[(theme) => ({
                    flexGrow: 1, overflow: 'hidden',
                    backgroundImage: `url(${CoverLight})`,
                    backgroundSize: 'cover',
                    ...theme.applyStyles('dark', {
                        backgroundColor: 'rgba(60, 60, 60, 1)',
                        backgroundImage: `url(${CoverDark})`,
                    }),
                }),
            ]}
        >
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={24}
                    sx={{
                        borderRadius: { xs: 0, sm: '20px' },
                        display: 'flex', flexDirection: 'row',
                        flexGrow: 1, overflow: 'hidden',  
                        mx: { xs: 0, sm: "5rem", lg: "8rem" },
                        my: { xs: 0, sm: "3rem", lg: "6rem" },
                        maxWidth: 'lg', maxHeight: 'lg',
                    }}
                >
                    <SideBar
                        token={token}
                        selected={selected}
                        handleSelect={handleSelect}
                        taskListHeaders={taskListHeaders}
                        setTaskListHeaders={setTaskListHeaders}
                        settings={settings}
                        setSettings={setSettings}
                        icons={icons}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                        <Today
                            hidden={selected !== "Today"}
                            token={token}
                            handleSelect={handleSelect}
                            icons={icons}
                        />
                        <Calendar
                            hidden={selected !== "Calendar"}
                            token={token}
                            handleSelect={handleSelect}
                            icons={icons}
                        />
                        <Notifications
                            hidden={selected !== "Notifications"}
                            token={token}
                        />
                        <TaskList hidden={isNaN(+selected)}
                            token={token}
                            listId={+selected}
                            taskListHeaders={taskListHeaders}
                            setTaskListHeaders={setTaskListHeaders}
                            handleSelect={handleSelect}
                            icons={icons}
                        />
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Home;