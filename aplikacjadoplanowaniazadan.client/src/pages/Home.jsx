import React from "react";
import { Box, Grid, Typography, Paper } from '@mui/material';
import SideBar from "../components/SideBar";
import Button from '@mui/material/Button';
import Today from "../components/screens/Today";
import Calendar from "../components/screens/Calendar";
import TaskList from "../components/screens/TaskList";
import Notifications from "../components/screens/Notifications";

const Home = ({ token }) => {
    const [selected, setSelected] = React.useState("Today");
    const [taskListHeaders, setTaskListHeaders] = React.useState([]);

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
                        mx: { xs: 0, sm: "5rem", lg: "8rem" },
                        my: { xs: 0, sm: "3rem", lg: "6rem" },
                        maxWidth: 'lg', maxHeight: 'lg',
                    }}
                >
                    <SideBar
                        handleSelect={handleSelect}
                        taskListHeaders={taskListHeaders}
                        setTaskListHeaders={setTaskListHeaders}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                        <Today hidden={selected !== "Today"} token={token} />
                        <Calendar hidden={selected !== "Calendar"} token={token} />
                        <Notifications hidden={selected !== "Notifications"} token={token} />
                        <TaskList hidden={isNaN(+selected)}
                            token={token}
                            listId={+selected}
                            setSelected={setSelected}
                            taskListHeaders={taskListHeaders}
                            setTaskListHeaders={setTaskListHeaders}
                        />
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Home;