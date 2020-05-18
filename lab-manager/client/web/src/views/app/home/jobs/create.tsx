import 'date-fns';
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
    Tooltip,
    IconButton,
    Icon,
    Button,
    Backdrop,
    CircularProgress,
    Snackbar,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
} from "@material-ui/core";

import { useForm } from 'react-hook-form';

import MaskedInput from 'react-text-mask';

import { Icon as MDI } from '@mdi/react'

import { mdiPlus, mdiGenderFemale, mdiGenderMale, mdiClock, mdiCalendar } from '@mdi/js';

import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { Autocomplete, Alert } from '@material-ui/lab';
import { useParams } from 'react-router';

import CreateProcess from '../../../../components/CreateProcess';

import {
    KeyboardDatePicker,
    KeyboardTimePicker,
    DateTimePicker,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import CurrencyFormat from '../../../../components/CurrencyFormat';



const useStiles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 20,
            width: '50vw',
        },
        form: {
            padding: 20,
        },
        dialog: {
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

interface Process {
    index: number;
    price: number;
    name: string;
    needColor: boolean;
}

class Form {
    constructor(obj: any) {
        Object.assign(this, obj)
    }
    description!: string;
    price!: number;
    kind!: Process | null;
    amount!: number;
    patient!: number;
    client!: number;
    lab!: number;
    deadline!: Date | null;
    deadlineHour?: Date | null;
    toothColor?: string;
}

function createForm(obj?: any): Form {
    const conf: Form = {
        description: '',
        price: 0,
        kind: null,
        amount: 1,
        patient: NaN,
        client: NaN,
        lab: 0,
        deadline: null,
    }
    Object.assign(conf, obj)
    return new Form(conf);
}

class State {
    constructor(obj: any) {
        Object.assign(this, obj)
    }
    dialog!: boolean;
}

function createState(obj?: any): State {
    const conf: State = {
        dialog: false,
    }
    Object.assign(conf, obj)
    return new State(conf)
}

const JOB_MUTATION = gql`
    mutation createJob(
        $lab: Int!
        $client: Int!
        $description: String
        $price: Float
        $kind: Int!
        $amount: Int
        $patient: Int!
        $deadline: DateTime!
        $toothColor: String
        $useToothColor: Boolean!
        $patientName: String!
    ){
        upsertPatient(input: { 
            lab: $lab
            client: $client
            index: $patient
            name: $patientName
            toothColor: $toothColor
        }) @include(if: $useToothColor) {
            created
            patient {
                toothColor
            }
        }
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
                index
            }
        }
    }
`

const PROCESSES_QUERY = gql`
    query getProcesses($lab: Int!, $client: Int!, $patient: Int!){
        laboratory(lab: $lab){
            client(index: $client){
                discount
                patient(index: $patient){
                    toothColor
                    name
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
    onCreate: Function
}

export default function CreateClients(props: Props) {
    const classes = useStiles()
    const { register, errors, handleSubmit, reset, triggerValidation } = useForm()
    const [create, { error, loading }] = useMutation(JOB_MUTATION)
    const lab = useQuery(LAB_QUERY)
    const { client, patient } = useParams()
    const defaultData = { lab: Number(lab.data?.laboratory | 0), client, patient }
    const processes = useQuery(PROCESSES_QUERY, { variables: defaultData })
    const [state, setState] = React.useState<State>(createState())
    const [form, setForm] = React.useState<Form>(createForm(defaultData))

    const changeForm = (prop: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = prop === 'amount' ?
            (Number(e.target.value || 0) * (form.kind?.price || 0) * (100 - (processes.data?.laboratory.client.discount || 0)) / 100) : form.price;
        ((prop === 'amount' && Number(e.target.value) > 0) || prop !== 'amount') && setForm({ ...form, price, [prop]: e.target.value })
    }
    const changeDateForm = (prop: 'deadline' | 'deadlineHour') => (date: Date | null) => {
        setForm({ ...form, [prop]: date })
    }

    const submit = () => {
        const variables = createForm({
            ...form,
            kind: form.kind?.index,
            useToothColor: !!form.toothColor,
            patientName: processes.data?.laboratory.client.patient.name
        })
        create({ variables })
            .then((data) => {
                reset()
                setForm(createForm(defaultData))
                props.onCreate(data.data?.upsertJob)
            })
    }

    return (
        <>
            <Tooltip arrow title="Cadastrar Paciente">
                <IconButton onClick={() => setState({ ...state, dialog: true })}>
                    <Icon component={MDI} path={mdiPlus} color="inherit" />
                </IconButton>
            </Tooltip>
            <Snackbar open={!!error} autoHideDuration={6000}>
                <Alert severity="error">{error?.message}</Alert>
            </Snackbar>
            <form autoComplete="off" onSubmit={handleSubmit(submit)}>
                <Dialog
                    open={state.dialog}
                    onClose={() => setState({ ...state, dialog: false })}
                    TransitionComponent={Grow}
                    keepMounted={false}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Novo Trabalho</DialogTitle>
                    <DialogContent>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item md={8}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-end"
                                >
                                    <Grid item md={11}>
                                        <Autocomplete
                                            fullWidth
                                            options={processes.data?.laboratory.processes}
                                            loading={processes.loading}
                                            value={form.kind}
                                            onChange={(e: any, value: Process | null) => setForm({
                                                ...form,
                                                kind: value,
                                                price: form.amount * (value?.price || 0) * (100 - (processes.data?.laboratory.client.discount || 0)) / 100
                                            })}
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
                                                    autoComplete="off"
                                                    error={!!processes.error || errors.kind}
                                                    label="Tipo *"
                                                    name="kind"
                                                    helperText={(!!processes.error && processes.error.message) ||
                                                        (errors.kind && "Informe um processo válido")
                                                    }
                                                    inputRef={register({
                                                        required: true,
                                                    })}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item md={1}>
                                        <CreateProcess onCreate={processes.refetch} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={4}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    onInput={changeForm('amount')}
                                    onChange={changeForm('amount')}
                                    type="number"
                                    label="Quantidade *"
                                    error={errors.amount}
                                    helperText={errors.amoutn && "Digite uma quantidade válida"}
                                    name="amount"
                                    value={form.amount}
                                    inputRef={register({
                                        required: true,
                                    })}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    fullWidth
                                    onInput={changeForm('price')}
                                    onChange={changeForm('price')}
                                    autoComplete="off"
                                    label="Preço *"
                                    value={form.price}
                                    error={errors.price}
                                    helperText={
                                        (errors.price && "Informe um preço válido") ||
                                        (!!processes.data?.laboratory.client.discount && `Cliente com desconto de ${processes.data?.laboratory.client.discount}%`)
                                    }
                                    InputProps={{
                                        inputComponent: CurrencyFormat as any,
                                        startAdornment: <InputAdornment position='start'>R$</InputAdornment>,
                                        onChange: changeForm('price')
                                    }}
                                    inputRef={register({
                                        required: true
                                    })}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <KeyboardDateTimePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Previsão de entrega"
                                    disablePast
                                    format="dd/MM/yyyy"
                                    value={form.deadline}
                                    autoComplete="off"
                                    onChange={changeDateForm('deadline')}
                                    KeyboardButtonProps={{
                                        "aria-label": 'change date',
                                    }}
                                    fullWidth
                                    name="deadline"
                                    error={errors.deadline}
                                    helperText={errors.deadline && "Informe uma data para entrega válida"}
                                    inputRef={register({
                                        required: true,
                                    })}
                                />

                            </Grid>
                            {(!!form.kind?.needColor && !processes.data?.laboratory.client.patient.toothColor) &&
                                <Grow in={true}>
                                    <Grid item md={12}>
                                        <TextField
                                            value={form.toothColor}
                                            onChange={changeForm('toothColor')}
                                            fullWidth
                                            label="Cor dos dentes do paciente *"
                                            helperText="O processo escolhido precisa da cor dos dentes do paciente"
                                            inputRef={register({
                                                required: true,
                                            })}
                                            name="toothColor"
                                            error={errors.toothColor}
                                        />
                                    </Grid>
                                </Grow>
                            }
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setState({ ...state, dialog: false })} color="inherit">Cancelar</Button>
                        <Button onClick={handleSubmit(submit)} variant="contained" color="primary">Salvar</Button>
                        <Backdrop className={classes.backdrop} open={loading}>
                            <CircularProgress color='primary' />
                        </Backdrop>
                    </DialogActions>
                </Dialog>
            </form>
        </>
    )

}