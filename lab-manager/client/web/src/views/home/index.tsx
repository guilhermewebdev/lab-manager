import React from 'react';

import { Route, MemoryRouter, Switch } from 'react-router';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';

import Auth from './Auth'

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
      // <MemoryRouter>
      //   <Switch>
      //     <Route path="/auth">
            <Auth />
      //     </Route>
      //   </Switch>
      // </MemoryRouter>
    )
}