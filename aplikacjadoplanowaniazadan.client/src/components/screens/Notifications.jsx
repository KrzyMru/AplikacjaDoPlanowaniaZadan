import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Paper } from '@mui/material';
import TaskListSkeleton from '../skeletons/TaskListSkeleton';
import Notification from '../Notification';
import { toast } from 'react-toastify';

export default function Notifications({ hidden, token }) {

    React.useEffect(() => {
        if (!hidden)
            getNotifications();
    }, [hidden]);

    const getNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5141/api/notification/getNotifications", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setNotifications(data);
        }
        catch (error) { }
        finally {
            setLoading(false);
        }
    }
    const deleteNotification = async (notificationId) => {
        setLoadingAction([...loadingAction, notificationId]);
        try {
            const response = await fetch("http://localhost:5141/api/notification/deleteNotification", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
                body: JSON.stringify(notificationId),
            });
            if (!response.ok)
                throw Error(response?.status);
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
            toast("Notification deleted successfully.", {
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
            setLoadingAction((prevState) => (prevState.filter(id => id !== notificationId)));
        }
    }

    const [loading, setLoading] = React.useState(false);
    const [loadingAction, setLoadingAction] = React.useState([]);
    const [notifications, setNotifications] = React.useState([]);

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
                {"Notifications"}
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
                        loading ?
                            <TaskListSkeleton />
                            :
                            (!notifications || notifications?.length === 0) ?
                            <Typography variant="body1" align="center" flexGrow="1">
                                There are no notifications yet
                            </Typography>
                            :
                            notifications?.map((notification) => (
                                <Paper elevation={1} key={notification.id} sx={{ mb: 1 }}>
                                    <Notification
                                        notification={notification}
                                        loadingAction={loadingAction}
                                        deleteNotification={deleteNotification}
                                    />
                                </Paper>
                            ))
                    }
                </List>
            </Box>
        </Box>
    );
}