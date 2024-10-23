import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Divider from '@mui/material/Divider';
import { Paper, CircularProgress, Skeleton } from '@mui/material';

export default function Today({ hidden }) {

    React.useEffect(() => {
        if (!hidden)
            getTodayTasks();
    }, [hidden]);

    const getTodayTasks = async () => {
        setLoading(true);
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
        catch (error) { console.log(error) }
        finally {
            setLoading(false);
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
    const completeTask = async (taskId) => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5141/api/task/completeTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTodayTasks([...todayTasks.filter(task => task.id !== taskId), data]);
        } catch (error) { }
        finally {
            setLoading(false);
        }
    }

    const [loading, setLoading] = React.useState(false);
    const [loadingAction, setLoadingAction] = React.useState([]);
    const [todayTasks, setTodayTasks] = React.useState([]);

    const handleCompleteTask = (taskId) => {
        completeTask(taskId);
    }
    const handleDeleteTask = (taskId) => {
        deleteTask(taskId);     
    }

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
                        loading ?
                            <React.Fragment >
                                <ListItem>
                                    <Skeleton height={76} width={'100%'} />
                                </ListItem>
                                <ListItem>
                                    <Skeleton height={76} width={'100%'} />
                                </ListItem>
                                <ListItem>
                                    <Skeleton height={76} width={'100%'} />
                                </ListItem>
                                <ListItem>
                                    <Skeleton height={76} width={'100%'} />
                                </ListItem>
                                <ListItem>
                                    <Skeleton height={76} width={'100%'} />
                                </ListItem>
                            </React.Fragment>
                        :
                        (!todayTasks || todayTasks.length === 0) ?
                            <Typography variant="body1" align="center" flexGrow="1">
                                Empty...
                            </Typography>
                        :
                        todayTasks.map((task) => (
                        <Paper elevation={1} key={task.id} sx={{ mb: 1 }}>
                        <ListItem   
                            sx={{
                                backgroundColor:
                                    task.status === 0 ? '#dceef3' :
                                    task.status === 1 ? '#ffc6c6' : 
                                    '#ccedcc'
                            }}
                        >
                            <ListItemIcon sx={{ justifyContent: 'center' }}>
                                <Checkbox
                                    edge="start"
                                    checked={task.status == 2}
                                    icon={<PanoramaFishEyeIcon fontSize='medium' />}
                                    checkedIcon={<CheckCircleIcon fontSize='medium' />}
                                    onClick={() => handleCompleteTask(task.id)}
                                />
                            </ListItemIcon>
                            <ListItemButton>
                                <ListItemText
                                    sx={{
                                        textDecorationLine: task.status == 2 ? 'line-through' : null,
                                        textDecorationStyle: task.status == 2 ? 'solid' : null,
                                        my: 0
                                    }}
                                    primary={task.name}
                                    secondary={task.description}
                                />
                            </ListItemButton>
                            <ListItemSecondaryAction>
                                <Box sx={{ position: 'relative' }}>
                                    <IconButton edge="end"
                                        onClick={() => handleDeleteTask(task.id)}
                                        disabled={loadingAction.find(tid => tid === task.id) !== undefined}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    {loadingAction.find(tid => tid === task.id) !== undefined && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '72%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />
                                    )}
                                </Box>
                            </ListItemSecondaryAction>
                        </ListItem>
                        </Paper>
                    ))}
                </List>
            </Box>
        </Box>
    );
}