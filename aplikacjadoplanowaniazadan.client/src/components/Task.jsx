import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import { CircularProgress } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import TaskInfo from './dialogs/TaskInfo';
import FlagIcon from '@mui/icons-material/Flag';
import ListIcon from '@mui/icons-material/List';
import LinearProgress from '@mui/material/LinearProgress';

export default function Task({ task, toggleTask, deleteTask, editTask, loadingAction, loadingToggle, handleSelect, icons }) {

    const [openInfo, setOpenInfo] = React.useState(null);

    const handleToggleTask = (taskId) => {
        toggleTask(taskId);
    }
    const handleDeleteTask = (taskId) => {
        deleteTask(taskId);
    }
    const handleOpenInfo = (task) => {
        setOpenInfo(task);
    }
    const handleCloseInfo = () => {
        setOpenInfo(null);
    }

    return (
        <React.Fragment>
            {
                loadingToggle?.find(tid => tid === task?.id) !== undefined ?
                <ListItem
                    sx={[(theme) => ({
                        minHeight: 96, maxHeight: 96,
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
                    <LinearProgress
                        color={task?.status === 0 ? "info" : task?.status === 1 ? "error" : "success"}
                        sx={{ width: '100%', height: 8 }}
                    />
                </ListItem>
                :
                <ListItem
                    sx={[(theme) => ({
                        position: 'relative',
                        minHeight: 96, maxHeight: 96,
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
                    <Tooltip title={(task?.priority === 0 ? "Low" : task?.priority === 1 ? "Medium" : "High") + " priority"}>
                        <FlagIcon
                            sx={{
                                position: 'absolute', left: 0, top: 0,
                                color:
                                    task?.priority === 0 ? 'green' :
                                        task?.priority === 1 ? 'yellow' :
                                            'red'
                            }}
                        />
                    </Tooltip>
                    <ListItemIcon sx={{ justifyContent: 'center', mr: "28px" }}>
                        <Checkbox
                            edge="start"
                            checked={task?.status == 2}
                            icon={<PanoramaFishEyeIcon fontSize='large' />}
                            checkedIcon={<CheckCircleIcon fontSize='large' />}
                            onClick={() => handleToggleTask(task?.id)}
                        />
                    </ListItemIcon>
                    <ListItemButton
                        sx={[(theme) => ({
                            pr: 1, transform: "rotate(90deg)",
                            position: 'absolute',
                            left: '40px', top: '36px',
                            p: 0, width: '96px',
                            backgroundColor: task?.listColor ?? '#dbd7d7',
                            display: "-webkit-flex",
                            ...theme.applyStyles('dark', {
                                backgroundColor: task?.listColor ? task?.listColor + 'd1' : '#dbd7d7',
                            }),
                        }),
                        ]}
                        onClick={() => handleSelect(task?.listId)}
                    >
                        <ListItemIcon sx={{ minWidth: '4px', mr: '4px' }}>
                            {
                                task?.listIcon !== null && task?.listIcon !== undefined ?
                                    icons?.user?.find(icon => icon.name === task?.listIcon)?.icon ?? <ListIcon />
                                    :
                                    <ListIcon />
                            }
                        </ListItemIcon>
                        <Typography variant="caption"
                            sx={[(theme) => ({
                                flexGrow: 1, maxHeight: '24px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                ...theme.applyStyles('dark', {
                                    color: '#0000008a',
                                }),
                            }),
                            ]}
                        >
                            {task?.listName ?? "List"}
                        </Typography>
                    </ListItemButton>
                    <ListItemButton sx={{ pr: 1 }}
                        onClick={() => handleOpenInfo(task)}
                    >
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
                    <Divider flexItem orientation="vertical" sx={{ mr: {xs: 0, sm: 1}, display: "block" }} />
                    <Box sx={{ display: task?.dueTo ? { xs: "none", sm: "flex" } : "none", flexDirection: 'column', p: 1, width: '80px' }}>
                        <Typography variant="overline" align="center">
                            {task?.status !== 2 ? "Due" : "Done"}
                        </Typography>
                        <Typography variant="caption" align="center">
                            {task?.dueTo?.substring(11, 19)}
                        </Typography>
                        <Typography variant="caption" align="center">
                            {task?.dueTo?.substring(0, 10)?.replaceAll('-', '/')}
                        </Typography>
                    </Box>
                    <ListItemSecondaryAction>
                        <Box sx={{ position: 'relative' }}>
                            <IconButton edge="end"
                                onClick={() => handleDeleteTask(task?.id)}
                                disabled={loadingAction?.find(tid => tid === task?.id) !== undefined}
                            >
                                <DeleteIcon />
                            </IconButton>
                            {loadingAction?.find(tid => tid === task?.id) !== undefined && (
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
            }

            <TaskInfo
                open={openInfo !== null}
                onClose={handleCloseInfo}
                task={openInfo}
                editTask={editTask}
            />
        </React.Fragment>
    );
}