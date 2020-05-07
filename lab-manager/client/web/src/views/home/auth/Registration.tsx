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
    Button,
    FormControlLabel,
    FormControl,
    InputLabel,
    Input,
    Checkbox,
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

type Registration = {
    username: string,
    password: string,
    password2: string,
    email: string,
    fullName: string,
    laboratory: string,
    showPassword: boolean,
    showPassword2: boolean,
}

export default function RegistrationForm() {
    const classes = useStyles();
    const { register, handleSubmit, errors, reset } = useForm();
    const onSubmit = (data: any) => console.log(data, reset());
    const [values, setValues] = React.useState<Registration>({
        username: '',
        password: '',
        password2: '',
        email: '',
        fullName: '',
        laboratory: '',
        showPassword: false,
        showPassword2: false,
    });
    const handleClickShowPassword = () => setValues({ ...values, showPassword: !values.showPassword });
    const handleClickShowPassword2 = () => setValues({ ...values, showPassword2: !values.showPassword2 });
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleChange = (prop: keyof Registration) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    return (
        <form
            autoComplete="off"
            className={classes.form}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid
                container
                justify="center"
                alignItems="center"
            >
                <Grid item md={11}>
                    <FormGroup>
                        <TextField
                            className={classes.input}
                            name="fullName"
                            error={errors.fullName}
                            helperText={errors.fullName && "Digite um nome válido"}
                            label="Nome completo *"
                            inputRef={register({
                                required: true,
                                pattern: /(-?([A-Z].\s)?([A-Z][a-z]+)\s?)+([A-Z]'([A-Z][a-z]+))?$/
                            })}
                            autoFocus
                        ></TextField>
                        <TextField
                            className={classes.input}
                            name="email"
                            error={errors.email}
                            label="Email *"
                            helperText={errors.email && "Digite um email válido"}
                            inputRef={register({
                                required: true,
                                pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                            })}
                        ></TextField>
                        <TextField
                            className={classes.input}
                            name="username"
                            error={errors.username}
                            helperText={errors.email && "Digite um nome de usuário válido"}
                            label="Nome de usuário *"
                            inputRef={register({
                                required: true,
                                pattern: /^[a-z0-9_-]{2,}$/
                            })}
                        ></TextField>
                        <FormControl className={classes.input} fullWidth>
                            <InputLabel error={errors.password} htmlFor="standard-adornment-password1">Senha *</InputLabel>
                            <Input
                                name="password"
                                error={errors.password}
                                id="standard-adornment-password1"
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
                        <FormControl className={classes.input} fullWidth>
                            <InputLabel error={errors.password2} htmlFor="standard-adornment-password2">Confirme sua senha *</InputLabel>
                            <Input
                                name="password2"
                                error={(errors.password2 || (values.password2 !== values.password)) && values.password2 !== ''}
                                id="standard-adornment-password2"
                                type={values.showPassword2 ? 'text' : 'password'}
                                value={values.password2}
                                onChange={handleChange('password2')}
                                inputRef={register({
                                    required: true,
                                    minLength: 8,
                                    validate: val => val === values.password
                                })}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Mudar visibilidade da senha"
                                            onClick={handleClickShowPassword2}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword2 ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {(errors.password2) &&
                                <FormHelperText error={errors.password2}>Confirme sua senha</FormHelperText>
                            }
                            {((values.password2 !== values.password) && values.password2 !== '') &&
                                <FormHelperText error={(values.password2 !== values.password)}>As senhas não coincidem</FormHelperText>
                            }
                        </FormControl>
                        <TextField
                            className={classes.input}
                            label="Nome do laboratório *"
                            name="laboratory"
                            error={errors.laboratory}
                            helperText={errors.laboratory && "Digite um nome válido para o laboratório"}
                            inputRef={register({
                                required: true,
                            })}
                        ></TextField>
                        <FormControl required error={errors.terms} component="fieldset">
                            <FormControlLabel
                                className={classes.input}
                                control={<Checkbox color="primary" />}
                                label="Concordo com os termos de uso *"
                                name="terms"
                                inputRef={register({
                                    required: true,
                                })}
                            />
                            {errors.terms &&
                                <FormHelperText error={errors.terms}>Você precisa concordar com os termos</FormHelperText>
                            }
                        </FormControl>
                    </FormGroup>
                </Grid>
                <Grid item md={11}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Cadastrar
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}