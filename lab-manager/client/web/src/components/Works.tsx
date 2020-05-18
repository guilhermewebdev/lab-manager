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
    Box,
    CardHeader,
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: "100%",
        },
        list: {
            paddingTop: 0,
        },
        card: {
            flexGrow: 1,
            flexShrink: 1,
            overflow: 'auto',
        },
        grid: {
            height: "100%",
            position: 'relative',
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
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
            <Box height={1 / 1}>
                <Grid
                    className={classes.container}
                    container
                    direction="row"
                    justify="center"
                    alignContent="stretch"
                    alignItems="stretch"
                >
                    <Grid
                        item
                        md={4}
                        className={classes.grid}
                    >
                        <AppBar color="inherit" position="absolute">
                            <Toolbar variant="dense">
                                <Typography variant="h6">{title}</Typography>
                                <span className="spacer"></span>
                                {actions}
                            </Toolbar>
                        </AppBar>
                        <Toolbar variant="dense" />
                        <Card variant="outlined" className={classes.card}>
                            <CardContent className={classes.list}>
                                <List color="primary" component="nav" >
                                    {list}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                        item
                        className={classes.grid}
                        md={8}
                    >
                        <Box height={1 / 1}>
                            {children}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Slide>
    )
}