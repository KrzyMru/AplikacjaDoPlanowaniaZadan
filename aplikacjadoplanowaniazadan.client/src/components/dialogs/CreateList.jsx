import React from "react";
import { Box, Dialog, DialogContent, DialogTitle, DialogActions, Divider, TextField, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, ListItemText, ListItemIcon } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { MuiColorInput } from "mui-color-input";
import { toast } from 'react-toastify';

const CreateList = ({ open, onClose, token, taskListHeaders, setTaskListHeaders, icons }) => {

    const saveList = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5141/api/list/saveList", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTaskListHeaders([data, ...taskListHeaders]);
            toast("List created successfully.", {
                theme: "light",
                type: "success",
            });
            onClose();
        } catch (error) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const [formData, setFormData] = React.useState({ color: '#FFFACD', icon: "Task" });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleCreateList = (formData) => {
        saveList(formData);
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
                    Create list
                </Typography>
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box sx={{ display: 'flex', flexWrap: 'noWrap', alignItems: 'center' }}>
                    <TextField name="name" label="Name" variant="outlined"
                        fullWidth sx={{ mb: 2, mt: 2, mr: 1, flexGrow: 1 }}
                        onChange={(event) => {
                            const { name, value } = event.target;
                            setFormData((prev) => ({ ...prev, [name]: value }))
                        }}
                    />
                    <FormControl sx={{ width: '80px', height: '56px' }}>
                        <InputLabel>Icon</InputLabel>
                        <Select
                            value={formData?.icon}
                            name="icon"
                            label="Icon"
                            onChange={(event) => {
                                const { name, value } = event.target;
                                setFormData((prev) => ({ ...prev, [name]: value }))
                            }}
                            sx={{ width: '80px', height: '56px', pt: 1 }}
                            renderValue={(selected) => {
                                return icons?.user?.find(icon => icon?.name === selected)?.icon;
                            }}
                        >
                            {
                                icons?.user?.map((icon) =>
                                    <MenuItem value={icon?.name} key={icon?.name}>
                                        <ListItemIcon>
                                            {icon?.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={icon?.name} />
                                    </MenuItem>
                                )}
                        </Select>
                    </FormControl>
                </Box>
                <TextField name="description" label="Description" variant="outlined"
                    multiline minRows={6} maxRows={6}
                    fullWidth sx={{ mb: 2 }}
                    onChange={(event) => {
                        const { name, value } = event.target;
                        setFormData((prev) => ({ ...prev, [name]: value }))
                    }}
                />
                <MuiColorInput name="color" format="hex" value={formData?.color} label="Color"
                    onChange={(value) => {
                        setFormData((prev) => ({ ...prev, color: value }))
                    }}
                    sx={{ width: '100%' }}
                />
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
                        onClick={() => handleCreateList(formData)}
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

export default CreateList;