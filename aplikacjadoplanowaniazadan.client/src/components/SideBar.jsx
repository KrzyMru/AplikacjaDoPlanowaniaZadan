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

export default function SideBar({ handleSelect }) {

    React.useEffect(() => {
        getTaskListHeaders();
    }, []);

    const getTaskListHeaders = async () => {
        try {
            const response = await fetch("http://localhost:5141/api/list/getTaskListHeaders", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTaskListHeaders(data);
            /*setTaskListHeaders(
                [
                    {
                        id: 0,
                        name: 'List name',
                        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. A' +
                            'enean commodo ligula eget dolor.Aenean massa.Cum sociis natoque penatibus et magnis dis p' +
                            'arturient montes, nascetur ridiculus mus.Donec quam felis, ultricies nec, pellentesque eu, preti' +
                            'um quis, sem.Nulla consequat massa quis enim.Donec pede justo, fringilla vel, aliquet nec, vulputate eget' +
                            ', arcu.In enim justo, rhoncus ut, ',
                        color: 'aqua',
                    },
                ]
            );*/
        }
        catch (error) { }
        finally {
        }
    }

    const [open, setOpen] = React.useState(false);
    const [openCreateList, setOpenCreateList] = React.useState(false);
    const [taskListHeaders, setTaskListHeaders] = React.useState([]);

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
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
    ];
    

    return (
        <React.Fragment>

            <Drawer variant="permanent" open={open}
                PaperProps={{
                    style: {
                        position: "relative", 
                        width: 'fit-content',
                    }
                }}
                sx={{ width: 'fit-content' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: open ? 'flex-end' : 'flex-start', mx: 1 + 1 / 2
                    }}
                >
                    <IconButton onClick={open ? handleClose : handleOpen}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    {screens?.map((screen) => (
                        <ListItem key={screen?.name} disablePadding sx={{ display: 'block' }}
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
                <Box sx={{ overflowY: 'hidden', flexGrow: 1, position: 'relative' }}>
                    <ListItem key={"CreateList"} disablePadding
                        sx={{ display: 'block' }}
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
                        sx={{
                            overflowY: 'auto', overflowX: 'hidden', py: 0, position: 'absolute',
                            maxHeight: `100%`, minHeight: `100%`,
                            width: '-webkit-fill-available',
                        }}
                    >
                        {taskListHeaders?.map((list) => (
                            <ListItem key={list?.id} disablePadding
                                sx={{ display: 'block', backgroundColor: list?.color }}
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
                                        <ListIcon />
                                        {/*{list?.icon}*/}
                                    </ListItemIcon>
                                    {
                                        open &&
                                        <ListItemText
                                            sx={{
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',                                          
                                                WebkitLineClamp: '1',
                                            }}
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
                taskListHeaders={taskListHeaders}
                setTaskListHeaders={setTaskListHeaders}
            />
        </React.Fragment >
    );
}