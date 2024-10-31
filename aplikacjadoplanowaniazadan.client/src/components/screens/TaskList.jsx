import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Paper } from '@mui/material';
import Task from '../Task';
import TaskListSkeleton from '../skeletons/TaskListSkeleton';

export default function TaskList({ hidden, listId }) {

    React.useEffect(() => {
        if (!hidden)
            getTaskList(listId);
    }, [hidden, listId]);

    const getTaskList = async (listId) => {
        setLoadingList(true);
        try {
            const response = await fetch("http://localhost:5141/api/list/getTaskList", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTaskList(data);

            console.log(data);
            /*setTaskList(
                {
                    id: 0,
                    name: 'List name',
                    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. A'+
                    'enean commodo ligula eget dolor.Aenean massa.Cum sociis natoque penatibus et magnis dis p'+
                    'arturient montes, nascetur ridiculus mus.Donec quam felis, ultricies nec, pellentesque eu, preti'+
                    'um quis, sem.Nulla consequat massa quis enim.Donec pede justo, fringilla vel, aliquet nec, vulputate eget'+
                    ', arcu.In enim justo, rhoncus ut, ',
                    color: 'aqua',
                    icon: <ListIcon />,
                    tasks: [
                        {
                            id: 0,
                            name: "Task 1",
                            description: 'desc',
                            status: 0,
                        },
                        {
                            id: 1,
                            name: "Task 2",
                            description: 'desc2',
                            status: 1,
                        },
                        {
                            id: 2,
                            name: "Task 3",
                            description: 'desc3',
                            status: 2,
                        },
                    ]
                },
            );*/
        }
        catch (error) { }
        finally {
            setLoadingList(false);
        }
    }
    const deleteTask = async (taskId) => {
        setLoadingAction([...loadingAction, taskId]);
        try {
            const response = await fetch("http://localhost:5141/api/task/deleteTask", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            setTaskList({...taskList, tasks: taskList.tasks.filter(task => task.id !== taskId)});
        }
        catch (error) { }
        finally {
            setLoadingAction(loadingAction.filter(id => id !== taskId));
        }
    }
    const toggleTask = async (taskId) => {
        try {
            const response = await fetch("http://localhost:5141/api/task/toggleTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskId),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTaskList({
                ...taskList,
                tasks:
                    taskList.tasks.map((task) =>
                        task.id === taskId ? data : task
                    )
            });
        } catch (error) { }
        finally {

        }
    }

    const [loadingList, setLoadingList] = React.useState(false);
    const [loadingAction, setLoadingAction] = React.useState([]);
    const [taskList, setTaskList] = React.useState(null);

    return (
        <Box
            sx={{
                display: hidden ? 'none' : 'flex',
                justifyContent: 'center', flexDirection: 'column',
                flexWrap: 'no-wrap', height: '100%', overflowY: 'hidden'
            }}
        >
            <Typography variant='h5' align='center'
                sx={{ py: 3, px: 6, backgroundColor: taskList?.color }}
            >
                {taskList?.name}
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
                        loadingList ?
                        <TaskListSkeleton />
                        :
                        (!taskList || taskList.length === 0) ?
                        <Typography variant="body1" align="center" flexGrow="1">
                            Empty...
                        </Typography>
                        :
                        taskList?.tasks?.map((task) => (
                        <Paper elevation={1} key={task.id} sx={{ mb: 1 }}>
                            <Task
                                task={task}
                                toggleTask={toggleTask}
                                deleteTask={deleteTask}
                            />
                        </Paper>
                    ))}
                </List>
            </Box>
        </Box>
    );
}