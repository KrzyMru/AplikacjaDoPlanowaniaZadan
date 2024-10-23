import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AppBar from '@mui/material/AppBar';

export default function SideBar({ handleSelect }) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const topSelections = [
        {
            name: 'Today',
            icon: <InboxIcon />
        },
        {
            name: 'Calendar',
            icon: <MailIcon />
        },
    ];
    const bottomSelections = [
        {
            name: 'Something1',
            icon: <MailIcon />
        },
        {
            name: 'Something2',
            icon: <MailIcon />
        },
    ];

    return (
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
                {topSelections.map((selection) => (
                    <ListItem key={selection.name} disablePadding sx={{ display: 'block' }}
                        onClick={() => handleSelect(selection.name)}
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
                                {selection.icon}
                            </ListItemIcon>
                            {
                                open &&
                                <ListItemText
                                    primary={selection.name}
                                />
                            }
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {bottomSelections.map((selection) => (
                    <ListItem key={selection.name} disablePadding sx={{ display: 'block' }}
                        onClick={() => handleSelect(selection.name)}
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
                                {selection.icon}
                            </ListItemIcon>
                            {
                                open &&
                                <ListItemText
                                    primary={selection.name}
                                />
                            }
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}