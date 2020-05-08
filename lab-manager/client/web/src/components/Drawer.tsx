import * as React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

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
            width: 300,
            height: "100%",
        },
        avatar: {
            backgroundColor: getRandomColor(),
        },
    }),
);


export default function () {
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
    const lab = useQuery(gql`
        {
            laboratory @client
        }
    `)
    const { data, loading, error } = useQuery(gql`
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
    `, { variables: { lab: lab.data?.laboratory || 0 } })



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
                        <List>

                        </List>
                    </CardContent>
                </Card>
            </Drawer>
        </div>
    )
}