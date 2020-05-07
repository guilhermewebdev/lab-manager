import * as React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import {
    IconButton,
    Drawer,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	}),
);


export default function() {
	const classes = useStyles();
    const defaultState = {
        drawer: false,
    }
    const [state, setState] = React.useState(defaultState)
    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, drawer: open });
    };

    return (
        <div>
            <IconButton edge="start" onClick={toggleDrawer(true)} className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={state['drawer']} onClose={toggleDrawer(false)}>
                Olá mundo
            </Drawer>
        </div>
    )
}