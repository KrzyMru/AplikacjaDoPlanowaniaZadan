import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import CreateList from './dialogs/CreateList';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TaskListHeaderSkeleton from './skeletons/TaskListHeaderSkeleton';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import Settings from './dialogs/Settings';

export default function SideBar({ token, selected, handleSelect, taskListHeaders, setTaskListHeaders, settings, setSettings, icons }) {

    React.useEffect(() => {
        getTaskListHeaders();
    }, []);

    const getTaskListHeaders = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5141/api/list/getTaskListHeaders", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTaskListHeaders(data);
        }
        catch (error) { }
        finally {
            setLoading(false);
        }
    }

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [openSettings, setOpenSettings] = React.useState(false);
    const [openCreateList, setOpenCreateList] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleOpenSettings = () => {
        setOpenSettings(true);
    }
    const handleCloseSettings = () => {
        setOpenSettings(false);
    }
    const handleOpenCreateList = () => {
        setOpenCreateList(true);
    }
    const handleCloseCreateList = () => {
        setOpenCreateList(false);
    }

    const screens = [
        {
            name: 'Today',
            icon: <TodayIcon />
        },
        {
            name: 'Calendar',
            icon: <CalendarMonthIcon />
        },
        {
            name: 'Notifications',
            icon: <NotificationsIcon />
        },
    ];
    

    return (
        <React.Fragment>
            <Drawer variant="permanent" open={open}
                PaperProps={{
                    sx: [(theme) => ({
                            position: "relative",
                            width: 'fit-content',
                            backgroundColor: '#fbf8f0',
                            ...theme.applyStyles('dark', {
                                backgroundColor: '#3d3b41',
                            }),
                        })
                    ]
                }}
                sx={{ width: 'fit-content' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: open ? 'space-between' : 'flex-start', mx: 1 + 1 / 2
                    }}
                >
                    <Typography variant="h6"
                        sx={{ display: open ? 'block' : 'none' }}
                    >
                        {"Menu"}
                    </Typography>
                    <IconButton onClick={open ? handleClose : handleOpen}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Box>
                <Divider />
                <List sx={{ p: 0 }}>
                    {
                        screens?.map((screen) => (
                            <ListItem key={screen?.name} disablePadding
                                sx={[(theme) => ({
                                        display: 'block',
                                        backgroundColor: selected === screen?.name ? '#fff0d4' : undefined,
                                        ...theme.applyStyles('dark', {
                                            backgroundColor: selected === screen?.name ? '#2d2c35' : undefined,
                                        }),
                                    }),
                                ]}
                                onClick={() => handleSelect(screen?.name)}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        px: 2.5,
                                        width: open ? null : 'fit-content',
                                        justifyContent: open ? 'initial' : 'center',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            justifyContent: 'center',
                                            mr: open ? 3 : 'auto'
                                        }}
                                    >
                                        {screen?.icon}
                                    </ListItemIcon>
                                    {
                                        open &&
                                        <ListItemText
                                            primary={screen?.name}
                                        />
                                    }
                                </ListItemButton>
                            </ListItem>
                    ))}
                </List>
                <Divider />
                <Box sx={{ flexGrow: 1, position: 'relative' }}>
                    <ListItem key={"Settings"} disablePadding
                        sx={{
                            display: 'block',
                            borderBottom: '0.5px solid', borderColor: 'divider',
                        }}
                        onClick={() => handleOpenSettings()}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                width: open ? 200 : 'fit-content',
                                justifyContent: open ? 'initial' : 'center',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    justifyContent: 'center',
                                    mr: open ? 3 : 'auto'
                                }}
                            >
                                <SettingsIcon />
                            </ListItemIcon>
                            {
                                open &&
                                <ListItemText
                                    primary={"Settings"}
                                />
                            }
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"CreateList"} disablePadding
                        sx={{
                            display: 'block',
                            borderBottom: '0.5px solid', borderColor: 'divider',
                        }}
                        onClick={() => handleOpenCreateList()}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                width: open ? 200 : 'fit-content',
                                justifyContent: open ? 'initial' : 'center',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    justifyContent: 'center',
                                    mr: open ? 3 : 'auto'
                                }}
                            >
                                <AddIcon />
                            </ListItemIcon>
                            {
                                open &&
                                <ListItemText
                                    primary={"New list"}
                                />
                            }
                        </ListItemButton>
                    </ListItem>
                    <List 
                        sx={[(theme) => ({
                                overflowY: 'auto', overflowX: 'hidden', py: 0, position: 'absolute',
                                maxHeight: `100%`, minHeight: `48px`,
                                width: '-webkit-fill-available',
                                backgroundColor: '#e9e6de',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: '#3d3943',
                                }),
                            }),
                        ]}
                    >
                        {
                            loading ?
                                <TaskListHeaderSkeleton />
                            :
                            taskListHeaders?.map((list) => (
                                <ListItem key={list?.id} disablePadding
                                    sx={[(theme) => ({
                                            display: 'block', backgroundColor: list?.color,
                                            ...theme.applyStyles('dark', {
                                                backgroundColor: list?.color + 'd1',
                                            }),
                                        }),
                                    ]}
                                    onClick={() => handleSelect(list?.id)}
                                >
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            px: 2.5,
                                            width: open ? 200 : 'fit-content',
                                            justifyContent: open ? 'initial' : 'center',
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                justifyContent: 'center',
                                                mr: open ? 3 : 'auto'
                                            }}
                                        >
                                            {
                                                list?.icon !== null && list?.icon !== undefined ?
                                                    icons?.user?.find(icon => icon.name === list.icon)?.icon ?? <ListIcon />
                                                    :
                                                    <ListIcon />
                                            }
                                        </ListItemIcon>
                                        {
                                            open &&
                                            <ListItemText
                                                sx={[(theme) => ({
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: '1',
                                                        ...theme.applyStyles('dark', {
                                                            color: '#0000008a',
                                                        }),
                                                    }),
                                                ]}
                                                primary={list?.name}
                                            />
                                        }
                                    </ListItemButton>
                                </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <CreateList
                open={openCreateList}
                onClose={handleCloseCreateList}
                token={token}
                taskListHeaders={taskListHeaders}
                setTaskListHeaders={setTaskListHeaders}
                icons={icons}
            />

            <Settings
                open={openSettings}
                onClose={handleCloseSettings}
                settings={settings}
                setSettings={setSettings}
                icons={icons}
            />
        </React.Fragment >
    );
}