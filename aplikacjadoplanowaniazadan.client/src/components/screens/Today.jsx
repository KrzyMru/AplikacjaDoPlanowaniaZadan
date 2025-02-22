import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Paper } from '@mui/material';
import Task from '../Task';
import TaskListSkeleton from '../skeletons/TaskListSkeleton';
import { toast } from 'react-toastify';

export default function Today({ hidden, token, handleSelect, icons }) {

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
                    "Authorization": 'Bearer ' + token,
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
                    "Authorization": 'Bearer ' + token,
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            setTodayTasks(todayTasks.filter(task => task.id !== taskId));
            toast("Task deleted successfully.", {
                theme: "light",
                type: "success",
            });
        }
        catch (error) {
            toast("Something went wrong.", {
                theme: "light",
                type: "error",
            });
        }
        finally {
            setLoadingAction((prevState) => (prevState.filter(tid => tid !== taskId)));
        }
    }
    const toggleTask = async (taskId) => {
        try {
            setLoadingToggle([...loadingToggle, taskId]);
            const response = await fetch("http://localhost:5141/api/task/toggleTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
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
            toast("Task status changed successfully.", {
                theme: "light",
                type: "success",
            });
        } catch (error) {
            toast("Something went wrong.", {
                theme: "light",
                type: "error",
            });
        }
        finally {
            setLoadingToggle((prevState) => (prevState.filter(id => id !== taskId)));
        }
    }
    const editTask = async (formData) => {
        const response = await fetch("http://localhost:5141/api/task/editTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token,
            },
            body: JSON.stringify({ ...formData, dueTo: formData?.dueTo ? formData?.dueTo?.add(1, 'hour') : null }),
        });
        if (!response.ok)
            throw Error(response?.status);
        const data = await response.json();
        setTodayTasks(todayTasks.map(task => task?.id === data?.id ? { ...data } : task));
    }

    const [loadingList, setLoadingList] = React.useState(false);
    const [loadingToggle, setLoadingToggle] = React.useState([]);
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
                sx={[(theme) => ({
                        py: 3, px: 6,
                        backgroundColor: '#ecf8f9',
                        ...theme.applyStyles('dark', {
                            backgroundColor: '#373737',
                        }),
                    }),
                ]}
            >
                {"Today"}
            </Typography>
            <Divider variant="fullWidth" />
            <Box
                sx={[(theme) => ({
                        overflowY: 'hidden', flexGrow: 1, position: 'relative',
                        backgroundColor: '#f5ffff',
                        ...theme.applyStyles('dark', {
                            backgroundColor: '#3f3f3f',
                        }),
                    }),
                ]}
            >
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
                            There are no tasks due today
                        </Typography>
                        :
                        todayTasks?.sort((t1, t2) => t2?.priority - t1?.priority)?.map((task) => (
                        <Paper elevation={1} key={task.id} sx={{ mb: 1 }}>
                            <Task
                                task={task}
                                toggleTask={toggleTask}
                                deleteTask={deleteTask}
                                editTask={editTask}
                                loadingAction={loadingAction}
                                loadingToggle={loadingToggle}
                                icons={icons}
                                handleSelect={handleSelect}
                                token={token}
                            />
                        </Paper>
                    ))}
                </List>
            </Box>
        </Box>
    );
}