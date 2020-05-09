import * as React from 'react';

import {
    Paper,
    Grow,
    Grid,
    Typography,
    makeStyles,
    Theme,
    createStyles,
    TextField,
    InputAdornment,
    FormControl,
    Input,
    InputLabel
} from "@material-ui/core";
import { useForm } from 'react-hook-form';

const useStiles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 20,
            width: '50vw'
        },
        form: {
            padding: 20,
        }
    }
    ))

export default function CreateClients() {
    const classes = useStiles()
    const { register, handleSubmit, setValue } = useForm()

    return (
        <Grow in={true}>
            <Paper className={classes.root} elevation={3}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item md={6}>
                        <Typography variant="h5">Novo Dentista</Typography>
                    </Grid>
                    <Grid item md={6} />
                    <Grid item md={12}>
                        <form>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                spacing={4}
                                className={classes.form}
                            >
                                <Grid item md={6}>
                                    <TextField
                                        fullWidth
                                        label="Nome *"
                                        name="name"
                                        inputRef={register({
                                            required: true,
                                            pattern: /(-?([A-Z].\s)?([A-Z][a-z]+)\s?)+([A-Z]'([A-Z][a-z]+))?$/
                                        })}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField fullWidth label="Email *" />
                                </Grid>
                                <Grid item md={12}>
                                    <TextField fullWidth label="Endereço *" />
                                </Grid>
                                <Grid item md={3}>
                                    <FormControl>
                                        <InputLabel htmlFor="standard-adornment-weight">Desconto</InputLabel>
                                        <Input
                                            id="standard-adornment-weight"
                                            type="number"
                                            // value={values.weight}
                                            // onChange={handleChange('weight')}
                                            endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                            aria-describedby="standard-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'weight',
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </Grow>
    )

}