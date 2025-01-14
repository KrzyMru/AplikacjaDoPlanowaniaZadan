import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogActions, Divider, Typography, Box, Button } from "@mui/material";
import dayjs from "dayjs";
import FlagIcon from '@mui/icons-material/Flag';
import EditIcon from '@mui/icons-material/Edit';
import EditTask from "./EditTask";

const GetDaysFromSeconds = (seconds) => {
    return Math.max(Math.floor(seconds / 86400), 0) + " Days";
}
const GetTimeFromSeconds = (seconds) => {
    var result = "";
    const days = Math.max(Math.floor(seconds / 86400), 0);
    const hours = Math.max(Math.floor((seconds - days * 86400) / 3600), 0);
    const minutes = Math.max(Math.floor((seconds - days * 86400 - hours * 3600) / 60), 0);
    const secs = Math.max(seconds - minutes * 60 - hours * 3600 - days * 86400, 0);
    result += hours + "h "
    result += minutes + "m "
    result += secs + "s"
    return result;
}

const TaskInfo = ({ open, onClose, task, editTask }) => {

    const [timeNow, setTimeNow] = React.useState(dayjs());
    const [openEditTask, setOpenEditTask] = React.useState(null);

    React.useEffect(() => {
        const interval = setInterval(() => setTimeNow(dayjs().subtract(1, 'hour')), 1000);

        return () => clearInterval(interval);
    }, []);

    const secondDifference = task?.status !== 1 ?
        dayjs(task?.dueTo).subtract(1, 'hour').diff(timeNow, 'second') 
        :
        timeNow?.diff(dayjs(task?.dueTo).subtract(1, 'hour'), 'second') 

    const handleOpenEditTask = (task) => {
        setOpenEditTask(task);
    }
    const handleCloseEditTask = () => {
        setOpenEditTask(null);
        onClose();
    }

    return (
        <React.Fragment>
            <Dialog
                onClose={onClose}
                open={open}
                fullWidth
                maxWidth={'sm'}
            >
                <DialogTitle>
                    <div>
                        <Typography variant="h4" align="center">
                            {task?.name}
                        </Typography>
                    </div>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <FlagIcon
                            sx={{
                                mb: '20px',
                                color:
                                    task?.priority === 0 ? 'green' :
                                    task?.priority === 1 ? 'yellow' :
                                        'red'
                            }}
                        />
                        <Typography>{(task?.priority === 0 ? "Low" : task?.priority === 1 ? "Medium" : "High") + " priority"}</Typography>
                    </Box>
                    <Box
                        sx={[(theme) => ({
                                display: task?.dueTo ? 'flex' : 'none',
                                justifyContent: 'space-around',
                                mb: '20px',
                                backgroundColor:
                                    task?.status === 0 ? '#dceef3' :
                                    task?.status === 1 ? '#ffc6c6' :
                                        '#ccedcc',
                                borderRadius: 1,
                                ...theme.applyStyles('dark', {
                                    backgroundColor:
                                        task?.status === 0 ? '#5d8793' :
                                        task?.status === 1 ? '#a57575' :
                                            '#758d75',
                                }),
                            }),
                        ]}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="overline" align="center">
                                {"Created"}
                            </Typography>
                            <Typography variant="caption" align="center">
                                {task?.creationDate?.substring(11, 19)}
                            </Typography>
                            <Typography variant="caption" align="center">
                                {task?.creationDate?.substring(0, 10)?.replaceAll('-', '/')}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="overline" align="center"
                                sx={{
                                    textDecorationLine: task?.status == 2 ? 'line-through' : null,
                                    textDecorationStyle: task?.status == 2 ? 'solid' : null,
                                }}
                            >
                                {task?.status !== 1 ? "Time left" : "Overdue by"}
                            </Typography>
                            {
                                task?.status !== 2 ? 
                                <React.Fragment>
                                    <Typography variant="caption" align="center">
                                        {GetDaysFromSeconds(secondDifference)}
                                    </Typography>
                                    <Typography variant="caption" align="center">
                                        {GetTimeFromSeconds(secondDifference)}
                                    </Typography>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Typography variant="subtitle1" align="center">
                                        {"Completed"}
                                    </Typography>
                                </React.Fragment>
                            }               
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="overline" align="center">
                                {"Due"}
                            </Typography>
                            <Typography variant="caption" align="center">
                                {task?.dueTo?.substring(11, 19)}
                            </Typography>
                            <Typography variant="caption" align="center">
                                {task?.dueTo?.substring(0, 10)?.replaceAll('-', '/')}
                            </Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ mb: '20px' }} />
                    <Typography variant="body1" align="left" sx={{ minHeight: '300px' }}>
                        {task?.description}
                    </Typography>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button variant="contained" startIcon={<EditIcon />}
                        onClick={() => handleOpenEditTask(task)}
                    >
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>

            <EditTask
                open={openEditTask != null}
                onClose={handleCloseEditTask}
                task={openEditTask}
                editTask={editTask}
                key={openEditTask}
            />
        </React.Fragment>
    );
};

export default TaskInfo;