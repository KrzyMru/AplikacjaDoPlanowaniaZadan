import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';

export default function Setting({ setting, icons, handleToggleSetting }) {

    return (
        <ListItem
            sx={{
                position: 'relative',
                minHeight: 96, maxHeight: 96,
                backgroundColor: setting?.value === true ? '#ada7db' : '#e1dfef',
                p: 0, borderRadius: 1
            }}
        >
            <ListItemButton
                onClick={() => handleToggleSetting(setting?.name)}
            >
                <ListItemIcon sx={{ justifyContent: 'center' }}>
                    {icons?.internal?.find(icon => icon?.name === setting?.name)?.icon ?? <SettingsIcon />}
                </ListItemIcon>
                <ListItemText
                    sx={{
                        my: 0,
                        height: 80, overflow: 'hidden'
                    }}
                    primary={setting?.name}
                    secondary={setting?.description}
                    primaryTypographyProps={{ noWrap: true }}
                />
            </ListItemButton>
        </ListItem>
    );
}