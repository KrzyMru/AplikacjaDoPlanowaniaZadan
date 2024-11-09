import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import { Skeleton } from '@mui/material';

export default function TaskListHeaderSkeleton() {

    return (
        <React.Fragment >
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1/3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
            <ListItem sx={{ px: 1 / 3 }}>
                <Skeleton height={54} width={'100%'} />
            </ListItem>
        </React.Fragment>
    );
}