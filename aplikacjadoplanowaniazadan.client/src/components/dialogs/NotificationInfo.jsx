import React from "react";
import { Dialog, DialogContent, DialogTitle, Divider, Typography, Box } from "@mui/material";

const NotificationInfo = ({ open, onClose, notification }) => {

    return (
        <Dialog
            onClose={onClose}
            open={open}
            fullWidth
            maxWidth={'sm'}
        >
            <DialogTitle>
                <div>
                    <Typography variant="h4" align="center">
                        {notification?.title}
                    </Typography>
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        mb: '20px',
                        backgroundColor: '#dceef3',
                        borderRadius: 1
                    }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                </Box>
                <Divider sx={{ mb: '20px' }} />
                <Typography variant="body1" align="left">
                    {notification?.content}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default NotificationInfo;