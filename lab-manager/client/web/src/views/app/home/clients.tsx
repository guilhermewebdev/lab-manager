import * as React from 'react'

import {
    Theme,
    Grid,
    Card,
    makeStyles,
    createStyles,
    CardHeader,
    Divider,
    Button,
    Toolbar,
    Typography,
    AppBar,
    List,
    CardContent,
    ListItem,
    ListItemText,
} from '@material-ui/core'

import Works from '../../../components/Works';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: "100%",
            flexGrow: 1,
            position: 'relative',
        },
        list: {
            paddingTop: 0,
        },
        card: {
            overflow: 'auto',
            height: "100%",
        }

    }),
);

export default function Clients() {
    const classes = useStyles()
    let list = ['teste', 'nada', 'nois']
   
    return (
        <Works list={list}>Teste</Works>
    )
}