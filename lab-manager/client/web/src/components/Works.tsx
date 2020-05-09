import * as React from 'react'

import {
    Theme,
    Grid,
    Card,
    makeStyles,
    createStyles,
    Toolbar,
    Typography,
    AppBar,
    List,
    CardContent,
    Slide,
} from '@material-ui/core'

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

type Props = {
    list: Array<any>,
    children: React.ReactNode,
    actions?: React.ReactNode,
    title: string,
}

export default function Clients(props: Props) {
    const classes = useStyles()
    const { children, list, actions, title } = props;

    return (
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Grid
                className={classes.container}
                container
            >
                <Grid item md={4} className={classes.container}>
                    <Card variant="outlined" className={classes.card}>
                        <AppBar color="inherit" position="absolute">
                            <Toolbar variant="dense">
                                <Typography variant="h6">{title}</Typography>
                                <span className="spacer"></span>
                                {actions}
                            </Toolbar>
                        </AppBar>
                        <Toolbar variant="dense" />
                        <CardContent className={classes.list}>
                            <List color="primary" component="nav" >
                                {list}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={8}>
                    {children}
                </Grid>
            </Grid>
        </Slide>
    )
}