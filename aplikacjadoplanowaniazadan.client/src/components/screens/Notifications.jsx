import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Paper } from '@mui/material';
import TaskListSkeleton from '../skeletons/TaskListSkeleton';
import Notification from '../Notification';

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

    const [loading, setLoading] = React.useState(false);
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
                sx={{ my: 2, mx: 6, py: 1 }}
            >
                {"Notifications"}
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
                                    />
                                </Paper>
                            ))
                    }
                </List>
            </Box>
        </Box>
    );
}