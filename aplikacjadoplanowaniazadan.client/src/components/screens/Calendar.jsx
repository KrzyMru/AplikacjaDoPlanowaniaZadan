import * as React from 'react';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Paper, LinearProgress } from '@mui/material';
import Task from '../Task';
import TaskListSkeleton from '../skeletons/TaskListSkeleton';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

function DayWithBadge(props) {
    const { monthTaskCounts, day, outsideCurrentMonth, ...other } = props;

    const generatedDay = ''+props?.day?.date();
    const days = Object.keys(monthTaskCounts);

    const isSelected =
        !props.outsideCurrentMonth
        && days?.find(day => day === generatedDay) > 0;

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? monthTaskCounts[generatedDay] : undefined}
            color="secondary"
            sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16 } }}
        >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}

export default function Calendar({ hidden, token }) {

    const getMonthTaskCounts = async (date) => {
        setLoadingCalendar(true);
        try {
            const response = await fetch("http://localhost:5141/api/task/getMonthTaskCounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
                body: JSON.stringify(date?.format('YYYY-MM'), date?.daysInMonth()),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setMonthTaskCounts(data);
        }
        catch (error) { }
        finally {
            setLoadingCalendar(false);
        }
    }

    const getDayTasks = async (date) => {
        setLoadingTasks(true);
        try {
            const response = await fetch("http://localhost:5141/api/task/getDayTasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
                body: JSON.stringify(date?.format('YYYY-MM-DD')),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setDayTasks(data);
        }
        catch (error) { }
        finally {
            setLoadingTasks(false);
        }
    }
    const deleteTask = async (taskId) => {
        setLoadingTaskAction([...loadingTaskAction, taskId]);
        try {
            const response = await fetch("http://localhost:5141/api/task/deleteTask", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            setDayTasks(dayTasks?.filter(task => task.id !== taskId));
        }
        catch (error) { }
        finally {
            setLoadingTaskAction(loadingTaskAction.filter(id => id !== taskId));
        }
    }
    const toggleTask = async (taskId) => {
        try {
            const response = await fetch("http://localhost:5141/api/task/toggleTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setDayTasks(
                dayTasks.map((task) =>
                    task.id === taskId ? data : task
                )
            );
        } catch (error) { }
        finally {

        }
    }

    const [loadingCalendar, setLoadingCalendar] = React.useState(false);
    const [loadingTasks, setLoadingTasks] = React.useState(false);
    const [loadingTaskAction, setLoadingTaskAction] = React.useState([]);
    const [selectedDate, setSelectedDate] = React.useState(dayjs());
    const [monthTaskCounts, setMonthTaskCounts] = React.useState({});
    const [dayTasks, setDayTasks] = React.useState([]);

    React.useEffect(() => {
        if (!hidden)
            getDayTasks(selectedDate);
    }, [hidden, selectedDate]);

    React.useEffect(() => {
        if (!hidden)
            getMonthTaskCounts(dayjs());
    }, [hidden]);

    const handleMonthChange = (date) => {
        setMonthTaskCounts({});
        getMonthTaskCounts(date);
    };

    return (
        <Box 
            sx={{
                display: hidden ? 'none' : 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'start',
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    //showDaysOutsideCurrentMonth
                    //fixedWeekNumber={6}
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    onMonthChange={handleMonthChange}
                    loading={loadingCalendar}
                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{
                        day: DayWithBadge,
                    }}
                    slotProps={{
                        day: {
                            monthTaskCounts,
                        }
                    }}
                />
            </LocalizationProvider>
            <Divider variant='middle' flexItem />
            <Box sx={{ overflowY: 'hidden', flexGrow: 1, position: 'relative' }}>
                <List
                    sx={{
                        m: 1, overflowY: 'auto', px: 2, position: 'absolute',
                        maxHeight: `calc(100% - 32px)`, minHeight: `calc(100% - 32px)`,
                        width: '-webkit-fill-available'
                    }}
                >
                    {
                        loadingTasks ?
                        <TaskListSkeleton />
                        :
                        (!dayTasks || dayTasks.length === 0) ?
                            <Typography variant="body1" align="center" flexGrow="1">
                                No tasks scheduled for this day
                            </Typography>
                            :
                                dayTasks.sort((t1, t2) => t2?.priority - t1?.priority).map((task) => (
                                <Paper elevation={1} key={task.id} sx={{ mb: 1 }}>
                                    <Task
                                        task={task}
                                        toggleTask={toggleTask}
                                        deleteTask={deleteTask}
                                        loadingAction={loadingTaskAction}
                                    />
                                </Paper>
                            ))
                    }
                </List>
            </Box>
        </Box>
    );
}