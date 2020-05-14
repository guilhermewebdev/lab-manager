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
    LinearProgress,
} from "@material-ui/core";

import { useForm } from 'react-hook-form';

import MaskedInput from 'react-text-mask';

import { Icon as MDI } from '@mdi/react'

import { mdiPlus, mdiGenderFemale, mdiGenderMale } from '@mdi/js';

import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { Autocomplete, Alert } from '@material-ui/lab';
import { useParams } from 'react-router';

import CreateProcess from '../../../../components/CreateProcess';

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
    kind: number,
}

type State = {
    grow: boolean,
    modal: boolean,
    form: Form,
    kind: string,
}

const JOB_MUTATION = gql`
    mutation createJob(
        $lab: Int!
        $client: ID!
        $description: String
        $price: Float
        $kind: Int!
        $amount: Int
        $patient: Int!
        $deadline: DateTime!        
    ){
        upsertJob(input: {
            lab: $lab
            client: $client
            description: $description
            price: $price
            kind: $kind
            amount: $amount
            patient: $patient
            deadline: $deadline
        }){
            job {
                pk
                index
            }
        }
    }
`

const PROCESSES_QUERY = gql`
    query getProcesses($lab: Int!, $client: Int!, $patient: Int!){
        laboratory(lab: $lab){
            client(index: $client){
                patient(index: $patient){
                    toothColor
                }
            }
            processes {
                index
                price
                name
                needColor
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
    const [create, { error, loading }] = useMutation(JOB_MUTATION)
    const lab = useQuery(LAB_QUERY)
    const { client, patient } = useParams()
    const processes = useQuery(PROCESSES_QUERY, {
        variables: { lab: Number(lab.data?.laboratory | 0), client, patient }
    })
    const initialState: State = {
        modal: false,
        grow: true,
        kind: '',
        form: {
            lab: lab.data?.laboratory || 0,
            client,
            name: '',
            kind: NaN,
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
            if (props?.onCreate) props.onCreate(data?.data?.upsertPatient?.patient)
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
                                    <Typography variant="h5">Novo Trabalho</Typography>
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
                                            <Grid
                                                container
                                                spacing={1}
                                                direction="row"
                                                justify="flex-start"
                                                alignItems="flex-end"
                                            >
                                                <Grid item md={11}>
                                                    <Autocomplete
                                                        fullWidth
                                                        options={processes.data?.laboratory.processes}
                                                        loading={processes.loading}
                                                        value={state.form.kind}
                                                        inputValue={state.kind}
                                                        onInputChange={(event: any, newValue: string) => setState({ ...state, kind: newValue })}
                                                        onChange={(event: any, newValue: any) => setState({ ...state, form: { ...state.form, kind: newValue } })}
                                                        loadingText={
                                                            <>
                                                                <Typography>Carregando...</Typography>
                                                                <LinearProgress />
                                                            </>
                                                        }
                                                        openOnFocus
                                                        getOptionLabel={(option: any) => option.name}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                error={!!processes.error}
                                                                label="Tipo *"
                                                                helperText={!!processes.error && processes.error.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item md={1}>
                                                    <CreateProcess />
                                                </Grid>
                                            </Grid>
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