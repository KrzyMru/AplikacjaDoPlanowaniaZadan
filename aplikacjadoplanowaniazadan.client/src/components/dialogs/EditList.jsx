import React from "react";
import { Box, Dialog, DialogContent, DialogTitle, DialogActions, Divider, TextField, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, ListItemText, ListItemIcon } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { MuiColorInput } from "mui-color-input";

const EditList = ({ open, onClose, taskList, editList, icons }) => {

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
                <Box sx={{ display: 'flex', flexWrap: 'noWrap', alignItems: 'center' }}>
                    <TextField name="name" label="Name" variant="outlined"
                        required
                        defaultValue={formData?.name}
                        fullWidth sx={{ mb: 2, mt: 2, mr: 1, flexGrow: 1 }}
                        onChange={(event) => {
                            const { name, value } = event.target;
                            setFormData((prev) => ({ ...prev, [name]: value }))
                        }}
                        error={!(formData?.name && formData?.name?.length > 0)}
                    />
                    <FormControl sx={{ width: '80px', height: '56px', mr: '12px' }}>
                        <InputLabel>Icon</InputLabel>
                        <Select
                            value={formData?.icon ?? "Task"}
                            name="icon"
                            label="Icon"
                            onChange={(event) => {
                                const { name, value } = event.target;
                                setFormData((prev) => ({ ...prev, [name]: value }))
                            }}
                            sx={{ width: '80px', height: '56px', pt: 1, mr: '12px' }}
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
                    required
                    defaultValue={formData?.description}
                    multiline minRows={6} maxRows={6}
                    fullWidth sx={{ mb: 2 }}
                    onChange={(event) => {
                        const { name, value } = event.target;
                        setFormData((prev) => ({ ...prev, [name]: value }))
                    }}
                    error={!(formData?.description && formData?.description?.length > 0)}
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
                        startIcon={<SaveIcon />}
                        onClick={() => handleEditList(formData)}
                        disabled={loading ||
                            !(formData?.name && formData?.name?.length > 0) ||
                            !(formData?.description && formData?.description?.length > 0)
                        }
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