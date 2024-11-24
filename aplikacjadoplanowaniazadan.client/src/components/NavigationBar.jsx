import React from "react";
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
//import CheckSession from "../utility/CheckSession";

function NavigationBar({ token }) {

    const navigationLeft = [
        { name: 'Home', link: '/' },
    ];
    const navigationRight = token ?
        [
            { name: 'SignOut', link: '/signOut' },
        ]
        :
        [
            { name: 'SignIn', link: '/signIn' },
            { name: 'SignUp', link: '/signUp' },
        ];

    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen((prevState) => !prevState);
    };

    return (
        <Box>
            <AppBar component="nav" sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleMenuToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="h6" to={"/"} component={Link} sx={{ textDecoration: "none", color: 'white' }}>
                            TaskList
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        {navigationRight.map((item) => (
                            <Button key={item.name} sx={{ color: '#fff', textTransform: 'none' }} to={item.link} component={Link}>
                                {item.name}
                            </Button>
                        ))}                       
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={menuOpen}
                    onClose={handleMenuToggle}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'no-wrap', flexGrow: 1 }}>
                        <Typography variant="h6" align="center" sx={{ my: 2 }}>
                            Menu
                        </Typography>
                        <Divider />
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <List>
                                {navigationLeft.map((item) => (
                                    <React.Fragment key={item.name}>
                                        <ListItem disablePadding to={item.link} component={Link} sx={{ textDecoration: "none", color: 'black' }}>
                                            <ListItemButton sx={{ textAlign: 'center' }}>
                                                <ListItemText primary={item.name} />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider variant="middle"/>
                                    </React.Fragment>
                                ))}
                            </List>
                            <List>
                                {navigationRight.map((item) => (
                                    <React.Fragment key={item.name}>
                                        <ListItem disablePadding to={item.link} component={Link} sx={{ textDecoration: "none", color: 'black' }}>
                                            <ListItemButton sx={{ textAlign: 'center' }}>
                                                <ListItemText primary={item.name} />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider variant="middle" />
                                    </React.Fragment>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </Drawer>
            </nav>
        </Box>
    );
};

export default NavigationBar;