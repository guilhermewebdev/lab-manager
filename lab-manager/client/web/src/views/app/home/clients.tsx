import * as React from 'react'

import {
    Theme,
    Grid,
    Card,
    Paper,
    makeStyles,
    createStyles,
    AppBar,
    Toolbar
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: "100%",
            flexGrow: 1,
        },
        list: {
            overflowY: 'auto',
        },
        maxHeight: {
            height: "100%"
        },
        card: {
            height: "100%"
        }

    }),
);

export default function Clients() {
    const classes = useStyles()

    return (
        <Grid
            className={classes.container}
            alignItems="stretch"
            container
        >
            <Grid className={classes.maxHeight} item md={4}>
                <Card className={classes.card}>
                    teste
                </Card>
            </Grid>
        </Grid>
    )
}