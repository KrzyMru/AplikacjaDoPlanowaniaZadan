import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Divider from '@mui/material/Divider';
import NotificationInfo from './dialogs/NotificationInfo';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress } from '@mui/material';

export default function Notification({ notification, loadingAction, deleteNotification }) {

    const [openInfo, setOpenInfo] = React.useState(null);

    const handleOpenInfo = (notification) => {
        setOpenInfo(notification);
    }
    const handleCloseInfo = () => {
        setOpenInfo(null);
    }
    const handleDeleteNotification = (notificationId) => {
        deleteNotification(notificationId);
    }

    return (
        <React.Fragment>
            <ListItem
                sx={[(theme) => ({
                    position: 'relative', pl: 0,
                    minHeight: 96, maxHeight: 96,
                    backgroundColor: '#dceef3',
                    borderRadius: 1,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#5d8793'
                    }),
                }),
                ]}
            >
                <ListItemButton sx={{ pr: 1 }}
                    onClick={() => handleOpenInfo(notification)}
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
                </ListItemButton>
                <Divider flexItem orientation="vertical" sx={{ mr: 1, display: { xs: "none", sm: "block" } }} />
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
                <ListItemSecondaryAction>
                    <Box sx={{ position: 'relative' }}>
                        <IconButton edge="end"
                            onClick={() => handleDeleteNotification(notification?.id)}
                            disabled={loadingAction?.find(nid => nid === notification?.id) !== undefined}
                        >
                            <DeleteIcon />
                        </IconButton>
                        {loadingAction?.find(nid => nid === notification?.id) !== undefined && (
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

            <NotificationInfo
                open={openInfo !== null}
                onClose={handleCloseInfo}
                notification={openInfo}
            />
        </React.Fragment>
    );
}