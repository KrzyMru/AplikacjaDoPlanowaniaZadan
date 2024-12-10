import React from "react";
import { Dialog, DialogContent, DialogTitle, Divider, Typography, List } from "@mui/material";
import Setting from "../Setting";
import { Paper } from '@mui/material';

const Settings = ({ open, onClose, settings, setSettings, icons }) => {

    const handleToggleSetting = (name) => {
        setSettings(
            settings?.map((setting) =>
                setting.name === name ? {...setting, value: !setting.value} : setting
            )
        );
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
                        Settings
                    </Typography>
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <List>
                    {
                        settings?.map((setting) => (
                            <Paper elevation={1} key={setting.name} sx={{ mb: 1 }}>
                                <Setting
                                    setting={setting}
                                    icons={icons}
                                    handleToggleSetting={handleToggleSetting}
                                />
                            </Paper>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default Settings;