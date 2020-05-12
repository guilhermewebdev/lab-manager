import * as React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Icon as MDI } from '@mdi/react'

import {
    IconButton,
    Drawer,
    List,
    ListItemIcon,
    Card,
    CardHeader,
    Avatar,
    CardContent,
    Divider,
    Collapse,
    ListItem,
    Icon,
    ListItemText,
} from '@material-ui/core'

import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';

import { gql } from 'apollo-boost';
import { useQuery, useApolloClient } from 'react-apollo';


import {
    mdiFlask,
    mdiCheck,
    mdiSubdirectoryArrowRight,
} from '@mdi/js';
import { ExpandLess } from '@material-ui/icons';

function getRandomColor(i: number = 0, color: string = '#', size: number = 6): string {
    let letters = '0123456789ABCDEF';
    return i === size ? color : getRandomColor(
        i + 1,
        color += letters[Math.floor(Math.random() * 16)],
        size
    )
}


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
        card: {
            width: 250,
            height: "100%",
        },
        avatar: {
            backgroundColor: getRandomColor(),
        },
    }),
);

type DrawerType = {
    drawer: boolean,
    labsCollapse: boolean,
}

const LAB_QUERY = gql`
        {
            laboratory @client
        }
    `
const DRAWER_QUERY = gql`
    query Drawer($lab: Int!) {
        laboratories {
            name
            index
        }
        laboratory(lab:$lab) {
            index
            name
            me {
                username
                email
                fullName
            }
        }
    }
`
const AUTH_QUERY = gql`
    {
        isAuthenticated @client
    }
`

export default function () {
    const auth = useQuery(AUTH_QUERY)
    if(!auth.data.isAuthenticated) return null;
    const classes = useStyles();
    const defaultState: DrawerType = {
        drawer: false,
        labsCollapse: false,
    }
    const [state, setState] = React.useState<DrawerType>(defaultState)
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


    const lab = useQuery(LAB_QUERY)
    const { data } = useQuery(DRAWER_QUERY, { variables: { lab: lab.data?.laboratory || 0 } })
    const toggleState = (prop: keyof DrawerType, value: any) => () => {
        setState({ ...state, [prop]: value })
    }
    const client = useApolloClient()
    const selectLab = (index: number) => () => {
        client.writeQuery({ query: LAB_QUERY, data: { laboratory: index } })
    }


    return (
        <div>
            <IconButton edge="start" onClick={toggleDrawer(true)} className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={state['drawer']} onClose={toggleDrawer(false)}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                {data?.laboratory?.me.fullName.toString()[0].toUpperCase()}
                            </Avatar>
                        }
                        title={data?.laboratory.me.fullName}
                        subheader={"@" + data?.laboratory.me.username}
                    />
                    <Divider />
                    <CardContent>
                        <List
                            className={classes.root}
                            aria-labelledby="nested-list-subheader"
                            component="nav"
                            disablePadding
                        >
                            <ListItem button onClick={toggleState('labsCollapse', !state.labsCollapse)}>
                                <ListItemIcon>
                                    <Icon component={MDI} path={mdiFlask} color="inherit"></Icon>
                                </ListItemIcon>
                                <ListItemText primary="Laboratórios" />
                                {state.labsCollapse ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={state.labsCollapse} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {data?.laboratories.map((item: any) => (
                                        <ListItem button onClick={selectLab(item.index)}>
                                            <span className="spacer"></span>
                                            <ListItemIcon>
                                                <Icon component={MDI} path={mdiSubdirectoryArrowRight} color="inherit"></Icon>
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} />
                                            <span className="spacer"></span>
                                            {item.index === data?.laboratory.index &&
                                                <ListItemIcon>
                                                    <Icon component={MDI} path={mdiCheck} color="inherit"></Icon>
                                                </ListItemIcon>
                                            }
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </List>
                    </CardContent>
                </Card>
            </Drawer>
        </div>
    )
}