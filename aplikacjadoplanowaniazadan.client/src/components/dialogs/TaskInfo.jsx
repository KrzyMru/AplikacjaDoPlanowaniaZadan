import React from "react";
import { Dialog, DialogContent, DialogTitle, Divider, Typography, Box } from "@mui/material";
import dayjs from "dayjs";

const GetDaysFromSeconds = (seconds) => {
    return Math.floor(seconds / 86400) + " Days"
}
const GetTimeFromSeconds = (seconds) => {
    var result = "";
    const days = Math.floor(seconds / 86400);
    const hours = (Math.floor(seconds / 3600) - days * 3600);
    const minutes = (Math.floor(seconds / 60) - hours * 60)
    const secs = (seconds - minutes * 60 - hours * 3600 - days * 216000);
    result += hours + "h "
    result += minutes + "m "
    result += secs + "s"
    return result;
}

const TaskInfo = ({ open, onClose, task }) => {

    const [timeNow, setTimeNow] = React.useState(dayjs());

    React.useEffect(() => {
        const interval = setInterval(() => setTimeNow(dayjs()), 1000);

        return () => clearInterval(interval);
    }, []);

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
                        {task?.name}
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
                        backgroundColor:
                            task?.status === 0 ? '#dceef3' :
                            task?.status === 1 ? '#ffc6c6' :
                                    '#ccedcc',
                        borderRadius: 1
                    }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="overline" align="center">
                            {"Created"}
                        </Typography>
                        <Typography variant="caption" align="center">
                            {task?.dueTo?.substring(11, 19)}
                        </Typography>
                        <Typography variant="caption" align="center">
                            {task?.dueTo?.substring(0, 10)?.replaceAll('-', '/')}
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="overline" align="center">
                            {"Time left"}
                        </Typography>
                        <Typography variant="caption" align="center">
                            {GetDaysFromSeconds(dayjs(task?.dueTo).diff(timeNow, 'second'))}
                        </Typography>
                        <Typography variant="caption" align="center">
                            {GetTimeFromSeconds(dayjs(task?.dueTo).diff(timeNow, 'second'))}
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="overline" align="center">
                            {"Due"}
                        </Typography>
                        <Typography variant="caption" align="center">
                            {task?.dueTo?.substring(11, 19)}
                        </Typography>
                        <Typography variant="caption" align="center">
                            {task?.dueTo?.substring(0, 10)?.replaceAll('-', '/')}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: '20px' }} />
                <Typography variant="body1" align="left">
                    {task?.description}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default TaskInfo;