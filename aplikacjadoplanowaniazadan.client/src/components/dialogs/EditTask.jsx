import React from "react";
import { Box, Dialog, DialogContent, DialogTitle, DialogActions, Divider, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/en-gb';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import dayjs from "dayjs";

const EditTask = ({ open, onClose, task, token }) => {

    const [formData, setFormData] = React.useState({ ...task, dueTo: task?.dueTo ? dayjs(task.dueTo) : null });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const editTask = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5141/api/task/editTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
                body: JSON.stringify({ ...formData, dueTo: formData?.dueTo ? formData?.dueTo?.add(1, 'hour') : null }),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            toast("Task updated successfully.", {
                theme: "light",
                type: "success",
            });
            onClose();
        } catch (error) {
            setError("Something went wrong.");
        }
        finally {
            setLoading(false);
        }
    }

    const handleEditTask = (formData) => {
        editTask(formData);
    }

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
                        Edit task
                    </Typography>
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <TextField name="name" label="Name" variant="outlined"
                    fullWidth sx={{ mb: 2, mt: 2 }}
                    defaultValue={formData?.name}
                    onChange={(event) => {
                        const { name, value } = event.target;
                        setFormData((prev) => ({ ...prev, [name]: value }))
                    }}
                />
                <TextField name="description" label="Description" variant="outlined"
                    multiline minRows={6} maxRows={6}
                    fullWidth sx={{ mb: 2 }}
                    defaultValue={formData?.description}
                    onChange={(event) => {
                        const { name, value } = event.target;
                        setFormData((prev) => ({ ...prev, [name]: value }))
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                    <DateTimePicker name="dueTo" label="Due to"
                        sx={{ width: "100%", mb: 2 }}
                        disablePast
                        defaultValue={formData?.dueTo}
                        onChange={(newValue) => {
                            setFormData({ ...formData, dueTo: newValue });
                        }}
                        slotProps={{ field: { clearable: true } }}
                    />
                </LocalizationProvider>
                <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={formData?.priority}
                        label="Priority"
                        onChange={(event) => {
                            setFormData({ ...formData, priority: event.target.value });
                        }}
                    >
                        <MenuItem value={0}>Low</MenuItem>
                        <MenuItem value={1}>Medium</MenuItem>
                        <MenuItem value={2}>High</MenuItem>
                    </Select>
                </FormControl>
                {error &&
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Box sx={{ position: 'relative' }}>
                    <Button
                        variant="contained"
                        endIcon={<SaveIcon />}
                        onClick={() => handleEditTask(formData)}
                        disabled={loading}
                    >
                        Save
                    </Button>
                    {loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default EditTask;