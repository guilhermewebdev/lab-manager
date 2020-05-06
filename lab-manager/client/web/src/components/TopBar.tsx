import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
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

export default function(){
    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <div className="spacer"></div>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}