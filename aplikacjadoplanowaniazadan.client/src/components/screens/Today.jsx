import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Paper } from '@mui/material';
import Task from '../Task';
import TaskListSkeleton from '../skeletons/TaskListSkeleton';

export default function Today({ hidden }) {

    React.useEffect(() => {
        if (!hidden)
            getTodayTasks();
    }, [hidden]);

    const getTodayTasks = async () => {
        setLoadingList(true);
        try {
            const response = await fetch("http://localhost:5141/api/task/todayTasks", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTodayTasks(data);
        }
        catch (error) { }
        finally {
            setLoadingList(false);
        }
    }
    const deleteTask = async (taskId) => {
        setLoadingAction([...loadingAction, taskId]);
        try {
            const response = await fetch("http://localhost:5141/api/task/deleteTask", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            setTodayTasks(todayTasks.filter(task => task.id !== taskId));
        }
        catch(error) { }
        finally {
            setLoadingAction(loadingAction.filter(tid => tid !== taskId));
        }
    }
    const toggleTask = async (taskId) => {
        try {
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
            setTodayTasks(
                todayTasks.map((task) =>
                    task.id === taskId ? data : task
                )
            );
        } catch (error) { }
        finally {

        }
    }

    const [loadingList, setLoadingList] = React.useState(false);
    const [loadingAction, setLoadingAction] = React.useState([]);
    const [todayTasks, setTodayTasks] = React.useState([]);

    return (
        <Box 
            sx={{
                display: hidden ? 'none' : 'flex',
                justifyContent: 'center', flexDirection: 'column',
                flexWrap: 'no-wrap', height: '100%', overflowY: 'hidden'
            }}
        >
            <Typography variant='h5' align='center'
                sx={{ my: 2, mx: 6, py: 1 }}
            >
                {"Today"}
            </Typography>
            <Divider variant="middle" />
            <Box sx={{ overflowY: 'hidden', flexGrow: 1, position: 'relative' }}>
                <List
                    sx={{
                        m: 1, overflowY: 'auto', px: 2, position: 'absolute',
                        maxHeight: `calc(100% - 32px)`, minHeight: `calc(100% - 32px)`,
                        width: '-webkit-fill-available'
                    }}
                >
                    {
                        loadingList ?
                        <TaskListSkeleton />
                        :
                        (!todayTasks || todayTasks.length === 0) ?
                        <Typography variant="body1" align="center" flexGrow="1">
                            Empty...
                        </Typography>
                        :
                        todayTasks.map((task) => (
                        <Paper elevation={1} key={task.id} sx={{ mb: 1 }}>
                            <Task
                                task={task}
                                toggleTask={toggleTask}
                                deleteTask={deleteTask}
                                loadingAction={loadingAction}
                            />
                        </Paper>
                    ))}
                </List>
            </Box>
        </Box>
    );
}