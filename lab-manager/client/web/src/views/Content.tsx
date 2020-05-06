import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import Home from './home';

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
    content: {
        heigth: "100%"
    }
  }),
);

export default function(){
    const classes = useStyles();

    return (
        <Home />
    )
}