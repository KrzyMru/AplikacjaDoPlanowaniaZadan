import React from "react";
import { Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";

const ListInfo = ({ open, onClose, list }) => {

    return (
            <Dialog
                onClose={onClose}
                open={open}
                fullWidth
                maxWidth={'sm'}
            >
                <DialogTitle
                    sx={[(theme) => ({
                        backgroundColor: list?.color,
                        ...theme.applyStyles('dark', {
                            backgroundColor: list?.color + 'd1',
                            color: '#0000008a',
                        }),
                    }),
                    ]}
                >
                    <div>
                        <Typography variant="h4" align="center">
                            {list?.name}
                        </Typography>
                    </div>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ minHeight: '300px' }}>
                    <Typography variant="body1" align="left">
                        {list?.description}
                    </Typography>
                </DialogContent>
            </Dialog>
    );
};

export default ListInfo;