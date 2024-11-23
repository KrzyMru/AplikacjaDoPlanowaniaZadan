import React from "react";
import { Box, Dialog, DialogContent, DialogTitle, DialogActions, Divider, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { MuiColorInput } from "mui-color-input";

const EditList = ({ open, onClose, taskList, editList }) => {

    const [formData, setFormData] = React.useState(taskList);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleEditList = async (formData) => {
        setLoading(true);
        try {
            await editList(formData);
            onClose();
        } catch (error) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
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
                    sx={{width: '100%'}}
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