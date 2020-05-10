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
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Zoom,
} from "@material-ui/core";
import { useForm } from 'react-hook-form';

import MaskedInput from 'react-text-mask';

import { Icon as MDI } from '@mdi/react'

import { mdiPlus, mdiGenderFemale, mdiGenderMale } from '@mdi/js';

import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { Autocomplete, Alert } from '@material-ui/lab';
import { useParams } from 'react-router';

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

type Form = {
    lab: number,
    name: string,
    gender: string,
    toothColor: string,
    client: number,
}

type State = {
    grow: boolean,
    modal: boolean,
    form: Form,
}

const CLIENT_MUTATION = gql`
    mutation createClient(
        $lab: Int!
        $client: ID!
        $name: String!
        $toothColor: String!
        $gender: String!
    ){
        upsertPatient(input: {
            lab: $lab
            client: $client
            name: $name
            toothColor: $toothColor
            gender: $gender
        }){
            patient {
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
    const { register, errors, handleSubmit, reset, triggerValidation } = useForm()
    const [create, { error, loading }] = useMutation(CLIENT_MUTATION)
    const lab = useQuery(LAB_QUERY)
    const { client } = useParams()
    const initialState: State = {
        modal: false,
        grow: true,
        form: {
            lab: lab.data?.laboratory || 0,
            client,
            name: '',
            gender: '',
            toothColor: '',
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
        setState({ ...state, form: { ...form, [event.target.name]: event.target.value } })
    }
    const open = () => setState({ ...state, grow: true, modal: true, })

    const submit = () => {
        create({
            variables: form
        }).then((data) => {
            reset()
            setState(initialState)
            if (props?.onCreate) props.onCreate(data.data.upsertPatient.patient)
        })
    }

    return (
        <div>
            <Tooltip arrow title="Cadastrar Paciente">
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
                                        <Grid item md={8}>
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
                                        <Grid item md={4}>
                                            <TextField
                                                fullWidth
                                                label="Cor dos dentes *"
                                                onInput={changeForm}
                                                name="toothColor"
                                                value={form.toothColor}
                                                helperText={!!errors.toothColor && "É preciso informar uma cor"}
                                                error={!!errors.toothColor}
                                                inputRef={register({
                                                    required: true,
                                                })}
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Genero</FormLabel>
                                                <RadioGroup
                                                    aria-label="gender"
                                                    row
                                                    value={form.gender}
                                                    name="gender"
                                                    ref={register({
                                                        pattern: /^[M|F]$/igm
                                                    })}
                                                    onChange={changeForm}
                                                >
                                                    <FormControlLabel
                                                        label="Feminino"
                                                        value="F"
                                                        control={<Radio
                                                            color="primary"
                                                            checkedIcon={
                                                                <Zoom in={true}>
                                                                    <Icon
                                                                        path={mdiGenderFemale}
                                                                        component={MDI}
                                                                    />
                                                                </Zoom>
                                                            }
                                                            icon={
                                                                <Icon
                                                                    path={mdiGenderFemale}
                                                                    component={MDI}
                                                                />
                                                            }
                                                        />}
                                                    />
                                                    <FormControlLabel
                                                        label="Masculino"
                                                        value="M"
                                                        control={<Radio
                                                            color="primary"
                                                            checkedIcon={
                                                                <Zoom in={true}>
                                                                    <Icon
                                                                        path={mdiGenderMale}
                                                                        component={MDI}
                                                                    />
                                                                </Zoom>
                                                            }
                                                            icon={
                                                                <Icon
                                                                    path={mdiGenderMale}
                                                                    component={MDI}
                                                                />
                                                            }
                                                        />}
                                                    />
                                                </RadioGroup>
                                            </FormControl>
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
        </div>
    )

}