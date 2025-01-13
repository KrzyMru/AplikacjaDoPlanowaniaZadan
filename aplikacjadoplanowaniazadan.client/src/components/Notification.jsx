import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NotificationInfo from './dialogs/NotificationInfo';

export default function Notification({ notification }) {

    const [openInfo, setOpenInfo] = React.useState(null);

    const handleOpenInfo = (notification) => {
        setOpenInfo(notification);
    }
    const handleCloseInfo = () => {
        setOpenInfo(null);
    }

    return (
        <React.Fragment>
            <ListItemButton
                onClick={() => handleOpenInfo(notification)}
                sx={[(theme) => ({
                    position: 'relative',
                    minHeight: 96, maxHeight: 96,
                    backgroundColor: '#dceef3',
                    borderRadius: 1,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#5d8793'
                    }),
                }),
                ]}
            >
                <ListItemText
                    sx={{
                        my: 0,
                        height: 80, overflow: 'hidden'
                    }}
                    primary={notification?.title}
                    secondary={notification?.content}
                    primaryTypographyProps={{ noWrap: true }}
                />
                <Divider flexItem orientation="vertical" sx={{ mx: 1, display: { xs: "none", sm: "block" } }} />
                <Box sx={{ display: notification?.sendDate ? { xs: "none", sm: "flex" } : "none", flexDirection: 'column', p: 1 }}>
                    <Typography variant="overline" align="center">
                        {"Sent on"}
                    </Typography>
                    <Typography variant="caption" align="center">
                        {notification?.sendDate?.substring(11, 19)}
                    </Typography>
                    <Typography variant="caption" align="center">
                        {notification?.sendDate?.substring(0, 10)?.replaceAll('-', '/')}
                    </Typography>
                </Box>
            </ListItemButton>

            <NotificationInfo
                open={openInfo !== null}
                onClose={handleCloseInfo}
                notification={openInfo}
            />
        </React.Fragment>
    );
}