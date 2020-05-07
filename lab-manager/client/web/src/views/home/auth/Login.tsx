import React from 'react';

import { useForm } from 'react-hook-form';

import {
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core/styles';
import {
    Grid,
    FormGroup,
    TextField,
    Switch,
    Button,
    FormControlLabel,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    FormHelperText,
} from '@material-ui/core'

import {
    Visibility,
    VisibilityOff,
} from '@material-ui/icons'


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
        form: {
            paddingTop: 15,
            paddingBottom: 25,
        },
        container: {
            height: "100%",
            marginTop: 15,
        },
        input: {
            marginBottom: 10,
        },
        button: {
            width: "100%"
        },
        margin: {
            margin: theme.spacing(1),
        },
        withoutLabel: {
            marginTop: theme.spacing(3),
        },
        textField: {
            width: '25ch',
        },
    }),
);

type Login = {
    showPassword: boolean,
    username: string,
    password: string,
}

export default function LoginForm() {
    const classes = useStyles();
    const { register, handleSubmit, watch, errors, reset } = useForm();
    const onSubmit = (data: any) => console.log(data, reset());
    const [values, setValues] = React.useState<Login>({
        username: '',
        password: '',
        showPassword: false,
    });
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleChange = (prop: keyof Login) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };


    return (
        <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
        >
            <Grid
                container
                justify="center"
                alignItems="center"
            >
                <Grid item md={11}>
                    <FormGroup>
                        <TextField
                            error={errors.username}
                            name="username"
                            className={classes.input}
                            label="Nome de usuário *"
                            helperText={errors.username && "Informe um nome de usuário válido"}
                            inputRef={register({
                                required: true,
                                pattern: /^[a-z0-9_-]{2,}$/
                            })}
                            autoFocus
                        />
                        <FormControl className={classes.input} fullWidth>
                            <InputLabel error={errors.password} htmlFor="standard-adornment-password">Senha *</InputLabel>
                            <Input
                                name="password"
                                error={errors.password}
                                id="standard-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                inputRef={register({
                                    required: true,
                                    minLength: 8,
                                })}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Mudar visibilidade da senha"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {errors.password &&
                                <FormHelperText error={errors.password}>Informe uma senha válida, com pelo menos 8 dígitos</FormHelperText>
                            }
                        </FormControl>
                        <FormControlLabel className={classes.input} control={<Switch color="primary" />} label="Manter Conectado" />
                    </FormGroup>
                </Grid>
                <Grid item md={11}>
                    <Button
                        className={classes.button}
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Entrar
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}
