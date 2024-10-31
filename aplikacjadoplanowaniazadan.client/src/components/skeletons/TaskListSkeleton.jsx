import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import { Skeleton } from '@mui/material';

export default function TaskListSkeleton() {

    return (
        <React.Fragment >
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
            <ListItem>
                <Skeleton height={96} width={'100%'} />
            </ListItem>
        </React.Fragment>
    );
}