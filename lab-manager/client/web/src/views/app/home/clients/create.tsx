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
    InputLabel,
    FormHelperText,
    Button
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

type Telephone = {
    telephone: string,
}

type State = {
    telephones: Array<Telephone>,
}

export default function CreateClients() {
    const classes = useStiles()
    const { register, errors, handleSubmit, getValues, triggerValidation } = useForm()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        triggerValidation(e.target.name);
    }
    const initialState: State = {
        telephones: [{ telephone: '' }]
    }
    const [state, setState] = React.useState(initialState)

    return (
        <form autoComplete="off">
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
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                                spacing={4}
                                className={classes.form}
                            >
                                <Grid item md={6}>
                                    <TextField
                                        fullWidth
                                        label="Nome *"
                                        onInput={handleChange}
                                        name="name"
                                        helperText={!!errors.name && "Digite um nome válido"}
                                        error={!!errors.name}
                                        inputRef={register({
                                            required: true,
                                            pattern: /(-?([A-Z].\s)?([A-Z][a-z]+)\s?)+([A-Z]'([A-Z][a-z]+))?$/
                                        })}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        fullWidth
                                        label="E-mail *"
                                        onInput={handleChange}
                                        name="email"
                                        helperText={!!errors.email && "Digite um e-mail válido"}
                                        error={!!errors.email}
                                        inputRef={register({
                                            required: true,
                                            pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                                        })}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <TextField
                                        fullWidth
                                        label="Endereço *"
                                    />
                                </Grid>
                                <Grid item md={3}>
                                    <FormControl>
                                        <InputLabel
                                            error={!!errors.discount}
                                            htmlFor="standard-adornment-weight"
                                        >Desconto</InputLabel>
                                        <Input
                                            id="standard-adornment-weight"
                                            type="number"
                                            error={!!errors.discount}
                                            name="discount"
                                            endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                            aria-describedby="standard-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'weight',
                                            }}
                                            onInput={handleChange}
                                            inputRef={register({
                                                min: 0,
                                                max: 100,
                                            })}
                                        />
                                        {(getValues('discount') > 100) &&
                                            <FormHelperText
                                                error={errors.discount}
                                            >Não é possível dar desconto com mais de 100%</FormHelperText>
                                        }
                                        {(getValues('discount') < 0) &&
                                            <FormHelperText
                                                error={errors.discount}
                                            >Não é possível dar desconto negativo</FormHelperText>
                                        }
                                    </FormControl>
                                </Grid>
                                {state.telephones.map((tel: Telephone, index: number) => (
                                    <Grid item md={4}>
                                        <TextField
                                            fullWidth
                                            label="Telefone *"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid item md={12}>
                            <Grid
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="flex-end"
                                spacing={5}
                            >
                                <Grid item>
                                    <Button color="inherit">Cancelar</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary">Salvar</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grow>
        </form>
    )

}