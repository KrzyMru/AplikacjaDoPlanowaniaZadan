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

export default function Task({ task, toggleTask, deleteTask }) {

    const [loading, setLoading] = React.useState(false);
    const [loadingAction, setLoadingAction] = React.useState([]);
    const [todayTasks, setTodayTasks] = React.useState([]);

    const handleToggleTask = (taskId) => {
        toggleTask(taskId);
    }
    const handleDeleteTask = (taskId) => {
        deleteTask(taskId);
    }

    return (
        <ListItem
            sx={{
                minHeight: 96, maxHeight: 96,
                backgroundColor:
                    task?.status === 0 ? '#dceef3' :
                    task?.status === 1 ? '#ffc6c6' :
                    '#ccedcc'
            }}
        >
            <ListItemIcon sx={{ justifyContent: 'center' }}>
                <Checkbox
                    edge="start"
                    checked={task?.status == 2}
                    icon={<PanoramaFishEyeIcon fontSize='large' />}
                    checkedIcon={<CheckCircleIcon fontSize='large' />}
                    onClick={() => handleToggleTask(task?.id)}
                />
            </ListItemIcon>
            <ListItemButton sx={{ pr: 1 }}>
                <ListItemText
                    sx={{
                        textDecorationLine: task?.status == 2 ? 'line-through' : null,
                        textDecorationStyle: task?.status == 2 ? 'solid' : null,
                        my: 0,
                        height: 80, overflow: 'hidden'
                    }}
                    primary={task?.name}
                    secondary={task?.description}
                    primaryTypographyProps={{ noWrap: true }}
                />
            </ListItemButton>
            <Divider flexItem orientation="vertical" sx={{ mx: 1, display: { xs: "none", sm: "block" } }} />
            <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: 'column', p: 1 }}>
                <Typography variant="caption" align="center">
                    {task?.dueTime}
                </Typography>
                <Typography variant="caption" align="left">
                    {task?.dueDate}
                </Typography>
            </Box>
            <ListItemSecondaryAction>
                <Box sx={{ position: 'relative' }}>
                    <IconButton edge="end"
                        onClick={() => handleDeleteTask(task?.id)}
                        disabled={loadingAction.find(tid => tid === task?.id) !== undefined}
                    >
                        <DeleteIcon />
                    </IconButton>
                    {loadingAction.find(tid => tid === task?.id) !== undefined && (
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
    );
}