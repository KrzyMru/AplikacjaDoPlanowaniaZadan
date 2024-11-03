import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Paper, LinearProgress } from '@mui/material';
import Task from '../Task';
import TaskListSkeleton from '../skeletons/TaskListSkeleton';
import CreateTask from '../dialogs/CreateTask';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EditList from '../dialogs/EditList';

export default function TaskList({ hidden, listId, setSelected }) {

    React.useEffect(() => {
        if (!hidden)
            getTaskList(listId);
    }, [hidden, listId]);

    const getTaskList = async (listId) => {
        setLoadingList(true);
        try {
            const response = await fetch(`http://localhost:5141/api/list/getTaskList?listId=${listId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTaskList(data);
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
        setLoadingTaskAction([...loadingTaskAction, taskId]);
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
            setLoadingTaskAction(loadingTaskAction.filter(id => id !== taskId));
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
    const deleteList = async (listId) => {
        setLoadingListAction(true);
        try {
            const response = await fetch("http://localhost:5141/api/list/deleteList", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(listId),
            });
            if (!response.ok)
                throw Error(response?.status);
            setSelected("Today");
        } catch (error) { }
        finally {
            setLoadingListAction(false);
        }
    }

    const [loadingList, setLoadingList] = React.useState(false);
    const [loadingTaskAction, setLoadingTaskAction] = React.useState([]);
    const [loadingListAction, setLoadingListAction] = React.useState(false);
    const [taskList, setTaskList] = React.useState(null);
    const [openCreateTask, setOpenCreateTask] = React.useState(false);
    const [openEditList, setOpenEditList] = React.useState(false);

    const handleOpenCreateTask = () => {
        setOpenCreateTask(true);
    }
    const handleCloseCreateTask = () => {
        setOpenCreateTask(false);
    }

    const handleOpenEditList = () => {
        setOpenEditList(true);
    }
    const handleCloseEditList = () => {
        setOpenEditList(false);
    }

    const handleDeleteList = (listId) => {
        deleteList(listId);
    }

    return (
        <React.Fragment>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    {
                        loadingListAction ? <LinearProgress sx={{ width: '100%', m: '18px' }} /> :
                        <React.Fragment>
                            <IconButton onClick={() => handleDeleteList(taskList?.id)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton onClick={() => handleOpenCreateTask(true)}>
                                <AddIcon />
                            </IconButton>
                            <IconButton onClick={() => handleOpenEditList(true)}>
                                <EditIcon />
                            </IconButton>
                        </React.Fragment>
                    }
                </Box>
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
                                    loadingAction={loadingTaskAction}
                                />
                            </Paper>
                        ))}
                    </List>
                </Box>
            </Box>

            <CreateTask
                open={openCreateTask}
                onClose={handleCloseCreateTask}
                taskList={taskList}
                setTaskList={setTaskList}
            />

            <EditList
                key={openEditList}
                open={openEditList}
                onClose={handleCloseEditList}
                taskList={taskList}
                setTaskList={setTaskList}
            />
        </React.Fragment>
    );
}