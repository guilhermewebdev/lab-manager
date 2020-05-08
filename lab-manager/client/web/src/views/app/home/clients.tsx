import * as React from 'react'

import {
    Theme,
    Grid,
    Card,
    makeStyles,
    createStyles,
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
            <Grid item md={4}>
                <Card variant="outlined" className={classes.card}>
                    teste
                </Card>
            </Grid>
        </Grid>
    )
}