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
    Tooltip,
    IconButton,
    Icon,
    InputLabel,
    FormHelperText,
    Button,
    Modal,
    Backdrop,
    CircularProgress,
    Snackbar,
} from "@material-ui/core";
import { useForm } from 'react-hook-form';

import MaskedInput from 'react-text-mask';

import { Icon as MDI } from '@mdi/react'
import { mdiPlus } from '@mdi/js';

import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { Autocomplete, Alert } from '@material-ui/lab';

const useStiles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 20,
            width: '50vw',
        },
        form: {
            padding: 20,
        },
        modal: {
            display: 'flex',
            overflow: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }
    ))

const LAB_QUERY = gql`
    {
        laboratory @client
    }
`

type Telephone = {
    telephone: string,
}

type Form = {
    lab: number,
    name: string,
    telephones: Array<Telephone>,
    address: string,
    email: string,
    discount: number,
}

type State = {
    grow: boolean,
    modal: boolean,
    form: Form,
    options: Array<any>,
}

function TelephoneInput(props: any) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
        />
    );
}

const CLIENT_MUTATION = gql`
    mutation createClient(
        $lab: ID!
        $name: String!
        $telephones: [TelephoneInput]
        $address: String
        $email: String
        $discount: Float
    ){
        upsertClient(input: {
            lab: $lab
            name: $name
            telephones: $telephones
            address: $address
            email: $email
            discount: $discount
        }){
            client {
                name
                index
            }
        }
    }
`

type Props = {
    onCreate?: Function
}

export default function CreateClients(props: Props) {
    const classes = useStiles()
    const { register, errors, handleSubmit, getValues, reset, triggerValidation } = useForm()
    const [create, { data, error, loading }] = useMutation(CLIENT_MUTATION)
    const lab = useQuery(LAB_QUERY)
    const initialState: State = {
        modal: false,
        grow: true,
        options: [],
        form: {
            lab: lab.data?.laboratory || 0,
            name: '',
            telephones: [],
            address: '',
            email: '',
            discount: 0,
        }
    }
    const [state, setState] = React.useState(initialState)
    const { form } = state;
    const handleClose = () => {
        setState({ ...state, grow: false })
    }
    const changeState = (prop: keyof State, value: any) => () => {
        setState({ ...state, [prop]: value })
    }
    const changeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
        triggerValidation(event.target.name);
        if (event.target.name === 'discount' && Number(event.target.value) > 100 || Number(event.target.value) < 0) return;
        setState({ ...state, form: { ...form, [event.target.name]: event.target.value } })
    }
    const open = () => setState({ ...state, grow: true, modal: true, })

    const submit = () => {
        create({
            variables: form
        }).then((data) => {
            reset()
            setState(initialState)
            if (props?.onCreate) props.onCreate(data.data.upsertClient.client)
        })
    }

    return (
        <>
            <Tooltip arrow title="Cadastrar Dentista">
                <IconButton onClick={open}>
                    <Icon component={MDI} path={mdiPlus} color="inherit" />
                </IconButton>
            </Tooltip>
            <Snackbar open={!!error} autoHideDuration={6000}>
                <Alert severity="error">{error?.message}</Alert>
            </Snackbar>
            <Modal
                open={state.modal}
                onClose={changeState('modal', false)}
                className={classes.modal}
            >
                <form autoComplete="off" onSubmit={handleSubmit(submit)}>
                    <Grow in={state.grow} onExited={changeState('modal', false)} mountOnEnter unmountOnExit>
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
                                                onInput={changeForm}
                                                name="name"
                                                autoFocus
                                                value={form.name}
                                                helperText={!!errors.name && "Digite um nome válido"}
                                                error={!!errors.name}
                                                inputRef={register({
                                                    required: true,
                                                    pattern: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/
                                                })}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextField
                                                fullWidth
                                                label="E-mail *"
                                                onInput={changeForm}
                                                name="email"
                                                value={form.email}
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
                                                    value={form.discount}
                                                    endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                                    aria-describedby="standard-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'weight',
                                                    }}
                                                    onInput={changeForm}
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
                                        <Grid item md={9}>

                                            <Autocomplete
                                                multiple
                                                fullWidth
                                                id="tags-filled"
                                                options={state.options}
                                                value={form.telephones}
                                                freeSolo
                                                onChange={(event: any, telephones: any | null) => {
                                                    setState({
                                                        ...state, form: {
                                                            ...form, telephones
                                                        }
                                                    })
                                                }}
                                                autoComplete={false}
                                                autoSelect={false}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Telefones *"
                                                        error={errors.telephone}
                                                        name="telephone"
                                                        InputProps={{
                                                            inputComponent: TelephoneInput,
                                                            ...params.InputProps,
                                                        }}
                                                    />
                                                )
                                                }
                                            />
                                        </Grid>
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
                                            <Button onClick={handleClose} color="inherit">Cancelar</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained" onClick={handleSubmit(submit)} color="primary">Salvar</Button>
                                            <Backdrop className={classes.backdrop} open={loading}>
                                                <CircularProgress color='primary' />
                                            </Backdrop>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grow>
                </form>
            </Modal >
        </>
    )

}