import * as React from 'react';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Paper, LinearProgress } from '@mui/material';
import Task from '../Task';
import TaskListSkeleton from '../skeletons/TaskListSkeleton';

export default function Calendar({ hidden }) {

    const getDayTasks = async (date) => {
        setLoadingTasks(true);
        try {
            // wysy³ane do getDayTasks
            console.log("getDayTasks: " + date?.format('YYYY-MM-DD'));
            const response = await fetch("http://localhost:5141/api/list/getDayTasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(date?.toJSON()),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setDayTasks(data);
        }
        catch (error) { }
        finally {
            setLoadingTasks(false);
        }
    }
    const deleteTask = async (taskId) => {
        setLoadingTaskAction([...loadingTaskAction, taskId]);
        try {
            console.log("deleteTask: " + taskId);
            const response = await fetch("http://localhost:5141/api/task/deleteTask", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            setDayTasks(dayTasks?.filter(task => task.id !== taskId));
        }
        catch (error) { }
        finally {
            setLoadingTaskAction(loadingTaskAction.filter(id => id !== taskId));
        }
    }
    const toggleTask = async (taskId) => {
        try {
            console.log("toggleTask: " + taskId);
            const response = await fetch("http://localhost:5141/api/task/toggleTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setDayTasks(
                dayTasks.map((task) =>
                    task.id === taskId ? data : task
                )
            );
        } catch (error) { }
        finally {

        }
    }

    const [loadingTasks, setLoadingTasks] = React.useState(false);
    const [loadingTaskAction, setLoadingTaskAction] = React.useState([]);
    const [selectedDate, setSelectedDate] = React.useState(dayjs());
    const [dayTasks, setDayTasks] = React.useState(null);

    React.useEffect(() => {
        if (!hidden)
            getDayTasks(selectedDate);
    }, [hidden, selectedDate]);

    return (
        <Box 
            sx={{
                display: hidden ? 'none' : 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'start',
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                />
            </LocalizationProvider>
            <Divider variant='middle' flexItem />
            <Box sx={{ overflowY: 'hidden', flexGrow: 1, position: 'relative' }}>
                <List
                    sx={{
                        m: 1, overflowY: 'auto', px: 2, position: 'absolute',
                        maxHeight: `calc(100% - 32px)`, minHeight: `calc(100% - 32px)`,
                        width: '-webkit-fill-available'
                    }}
                >
                    {
                        loadingTasks ?
                        <TaskListSkeleton />
                        :
                        (!dayTasks || dayTasks.length === 0) ?
                            <Typography variant="body1" align="center" flexGrow="1">
                                No tasks scheduled for this day
                            </Typography>
                            :
                            dayTasks?.map((task) => (
                                <Paper elevation={1} key={task.id} sx={{ mb: 1 }}>
                                    <Task
                                        task={task}
                                        toggleTask={toggleTask}
                                        deleteTask={deleteTask}
                                        loadingAction={loadingTaskAction}
                                    />
                                </Paper>
                            ))
                    }
                </List>
            </Box>
        </Box>
    );
}