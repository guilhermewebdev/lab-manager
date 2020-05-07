import React from 'react';

import { useForm } from 'react-hook-form';

import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

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
    Link,
    FormHelperText,
    Snackbar,
    CircularProgress,
    Backdrop,
} from '@material-ui/core'

import {
    Alert
} from '@material-ui/lab';

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
        form: {
            paddingTop: 15,
            paddingBottom: 25,
        },
        container: {
            height: "100%",
            marginTop: 15,
        },
        input: {
            marginBottom: 15,
        },
        button: {
            width: "100%"
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);

type Login = {
    showPassword: boolean,
    username: string,
    password: string,
    keep: boolean,
}

const LOGIN = gql`
    mutation Login($username: String!, $password: String!){
        tokenAuth(
            username: $username
            password: $password
        ){
            token
            payload
            refreshExpiresIn
        }
    }
`

export default function LoginForm() {
    const classes = useStyles();
    const { register, handleSubmit, errors, reset } = useForm();
    const [tokenAuth, {error, loading}] = useMutation(LOGIN);
    const { writeData, query } = useApolloClient()
    const initialValues:Login = {
        username: '',
        password: '',
        showPassword: false,
        keep: false,
    }
    const [values, setValues] = React.useState<Login>(initialValues);
    const onSubmit = async (form: any) => {
        const { username, password } = form;
        tokenAuth({ variables: { username, password } }).then(data => {
            values.keep? localStorage.setItem('bat', data.data.tokenAuth.token) : sessionStorage.setItem('bat', data.data.tokenAuth.token) 
            query({
                query: gql`
                  query {
                    isAuthenticated
                  }
                `
              }).then(data => writeData({ data: { isAuthenticated: data.data.isAuthenticated } }))
              
            reset();
            setValues(initialValues);
        })
    };
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
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="primary" />
            </Backdrop>
            <Snackbar open={!!error} autoHideDuration={6000}>
                <Alert severity="error">
                    {!!error && error?.message.toString().split(':')[1]}
                </Alert>
            </Snackbar>
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
                    </FormGroup>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    md={11}
                    item
                >
                    <Grid item md={7}>
                        <FormControlLabel
                            className={classes.input}
                            control={
                                <Switch
                                    size="small"
                                    color="primary"
                                    value={values.keep}
                                    onChange={handleChange('keep')}
                                />}
                            label="Manter Conectado"
                        />
                    </Grid>
                    <Grid item md={5}>
                        <Link color="primary" href="#">Esqueceu a senha?</Link>
                    </Grid>
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
