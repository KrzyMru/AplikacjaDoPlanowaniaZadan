import React from "react";
import { Box, Dialog, DialogContent, DialogTitle, DialogActions, Divider, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { MuiColorInput } from "mui-color-input";

const EditList = ({ open, onClose, taskList, setTaskList }) => {

    const editList = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5141/api/list/editList", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok)
                throw Error(response?.status);
            const data = await response.json();
            setTaskList(data);
            //setTaskList({ ...taskList, ...formData });
            onClose();
        } catch (error) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const [formData, setFormData] = React.useState(taskList);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleEditList = (formData) => {
        editList(formData);
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
                        Edit list
                    </Typography>
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <TextField name="name" label="Name" variant="outlined"
                    defaultValue={formData?.name}
                    fullWidth sx={{ mb: 2, mt: 2 }}
                    onChange={(event) => {
                        const { name, value } = event.target;
                        setFormData((prev) => ({ ...prev, [name]: value }))
                    }}
                />
                <TextField name="description" label="Description" variant="outlined"
                    defaultValue={formData?.description}
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
                        onClick={() => handleEditList(formData)}
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

export default EditList;