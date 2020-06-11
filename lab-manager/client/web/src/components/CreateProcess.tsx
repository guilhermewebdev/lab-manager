import * as React from 'react';

import {
    Tooltip,
    IconButton,
    Icon,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    DialogActions,
    Button,
    Grow,
    InputAdornment,
    FormControl,
    FormHelperText,
    FormLabel,
    RadioGroup,
    Radio
} from '@material-ui/core';
import { Autocomplete, RenderInputParams } from '@material-ui/lab';

import { Icon as MDI } from '@mdi/react'
import { mdiPlus, mdiClose } from '@mdi/js';

import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';

import { useForm } from 'react-hook-form';

import CreateProcedure from './CreateProcedure'

import CurrencyFormat from './CurrencyFormat';

class State {
    dialog: boolean = false;
}

class Stage {
    constructor(obj: Stage) {
        Object.assign(this, obj)
    }
    procedure!: any;
    index!: number;
    price: number = 0;
}

class Form {
    constructor(obj: any) {
        Object.assign(this, obj)
    }
    name?: string = '';
    lab!: number;
    stages: Array<Stage> = [
        { procedure: null, index: 1, price: 0 }
    ];
    price: number = 0;
    description?: string = '';
    needColor: boolean | null = null;
}

const LAB_QUERY = gql`
    {
        laboratory @client
    }
`
const PROCEDURES_QUERY = gql`
    query procedures($lab: Int!){
        laboratory(lab: $lab){
            procedures {
                name
                price
                index
                needColor
            }
        }
    }
`;

const PROCESS_MUTATION = gql`
    mutation createProcess($form: ProcessInput!){
        upsertProcess(input: $form){
            created
            process {
                index
            }
        }
    }
`

type Props = {
    onCreate: (process: any) => void;
}

export default function CreateProcess(props: Props) {
    const { register, errors, handleSubmit, reset, triggerValidation } = useForm()
    const lab = useQuery(LAB_QUERY)
    const procedures = useQuery(PROCEDURES_QUERY, { variables: { lab: Number(lab.data?.laboratory) || 0 } })
    const [state, setState] = React.useState<State>(new State())
    const [form, setForm] = React.useState<Form>(new Form({
        lab: Number(lab.data?.laboratory) || 0
    }))
    const voidStage: Stage = new Stage({ procedure: null, index: form.stages.length + 1, price: 0 });
    const addStageButton: boolean = (!!form.stages[form.stages.length - 1]?.procedure)

    const sortStages = (a: any, b: any) => (a.index - 1) - (b.index - 1)
    const changeState = (prop: keyof State, value: any) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setState({ ...state, [prop]: value })
        event.stopPropagation()
        event.preventDefault()
    }
    const changeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }
    const getDefaultPrice = () => form.stages
        .filter((item) => !!item && !!item.price)
        .map((value) => value.price)
        .reduce((p, c) => (p + c), 0)

    const price: number = getDefaultPrice();


    const changeStage = (index: number, prop: keyof Stage) => (e: any, value?: any) => {
        const stages: Stage[] = form.stages;
        stages.splice(index, 1, {
            ...stages[index],
            [prop]: value,
            price: prop === 'procedure' ?
                value?.price || 0 : prop === 'price' ?
                    e.target.value : !!stages[index] ?
                        Number(stages[index]?.price || 0) : 0,
        });

        if (prop === 'procedure') {
            if (index === stages.length - 1 && value) stages.push(voidStage);
        }
        setForm({
            ...form,
            price: getDefaultPrice(),
            needColor: form.stages.filter((stage: Stage) => !!stage.procedure?.needColor).length !== 0,
            stages
        })
    }
    const changeStagePosition = (position: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = + e.target.value;
        if ((value < 1 || value > form.stages.length || !value)) return;
        const oldIndex = form.stages[position].index
        setForm({
            ...form, stages: form.stages.map((stage: Stage, index: number) => {
                if (index === position) return { ...stage, index: value };
                else if (index + 1 === value) return { ...stage, index: oldIndex };
                else return { ...stage, index: index + 1 };
            })
        })
    }
    const removeStage = (position: number) => () => {
        form.stages.splice(position, 1)
        setForm({
            ...form,
            price: getDefaultPrice(),
            stages: form.stages.map((item, index) => {
                item.index = index + 1;
                return item;
            })
        })
    }
    const autoRemoveStage = (position: number) => () => {
        if ((position === (form.stages.length - 1)) && !addStageButton && position > 0) {
            setForm({
                ...form, stages: form.stages.filter((item, index) => {
                    return (index !== position && !!item.procedure || index === 0)
                })
            })
        }
    }
    const addStage = () => {
        form.stages.push(voidStage)
        setForm({ ...form, stages: form.stages })
    }
    const parseCurrency = (value: number) => {
        const positive = value >= 0 ? value : value * -1
        const string = String(positive);
        const splitted = string.includes('.') ? string.split('.') : [string, '00']
        return `${String(splitted[0])},${String(splitted[1]).slice(0, 2)}`
    }

    const [create] = useMutation(PROCESS_MUTATION)

    const submit = () => {
        const stages = form.stages
            .filter((value) => !!value.procedure && !!value.index && !!value.price && value.procedure?.index)
            .map((value) => ({
                ...value,
                procedure: value.procedure.index
            }))
        const newForm = { ...form, stages }
        create({ variables: { form: newForm } })
            .then((data: any) => {
                reset()
                props.onCreate(data)
                setForm(new Form({
                    lab: Number(lab.data?.laboratory) || 0
                }))
            })
    }

    return (
        <>
            <Tooltip title="Cadastrar Processo">
                <IconButton onClick={changeState('dialog', true)}>
                    <Icon component={MDI} path={mdiPlus} />
                </IconButton>
            </Tooltip>
            <form onSubmit={handleSubmit(submit)}>
                <Dialog
                    onClose={changeState('dialog', false)}
                    open={state.dialog}
                    closeAfterTransition
                    fullWidth
                    maxWidth="md"
                    TransitionComponent={Grow}
                    keepMounted={false}
                >
                    <DialogTitle>Novo Processo</DialogTitle>
                    <DialogContent>
                        <Grid
                            container
                            spacing={2}
                        >
                            <Grid item md={8}>
                                <TextField
                                    fullWidth
                                    label="Nome *"
                                    name='name'
                                    error={errors.name}
                                    value={form.name}
                                    helperText={errors.name && "É preciso informar um nome para o processo"}
                                    onInput={changeForm}
                                    onChange={changeForm}
                                    inputRef={register({
                                        required: true,
                                    })}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <TextField
                                    fullWidth
                                    error={errors.price}
                                    label="Preço *"
                                    onInput={changeForm}
                                    name='price'
                                    value={form.price}
                                    helperText={form.price !== price && `${form.price > price ? "Acréscimo" : "Desconto"} de R$${parseCurrency(form.price - price)}`}
                                    InputProps={{
                                        inputComponent: CurrencyFormat as any,
                                        startAdornment: <InputAdornment position='start'>R$</InputAdornment>,
                                        onChange: changeForm,
                                        name: 'price',
                                    }}
                                    inputRef={register({
                                        required: true,
                                    })}
                                />
                            </Grid>
                            {form.stages.sort(sortStages).map((stage: Stage, index: number) => (
                                <Grid item md={12}>
                                    <Grow in={true}>
                                        <Grid
                                            container
                                            spacing={2}
                                            key={`${stage.index}`}
                                        >
                                            <Grid item md={2}>
                                                <TextField
                                                    value={stage.index}
                                                    fullWidth
                                                    label="Estágio *"
                                                    type="number"
                                                    error={errors[`stages[${stage.index}]`]}
                                                    autoFocus
                                                    helperText={errors[`stages[${stage.index}]`] && "É preciso informar a ordem dos procedimentos"}
                                                    onChange={changeStagePosition(index)}
                                                    onInput={changeStagePosition(index)}
                                                    name={`stages[${stage.index}]`}
                                                    inputRef={register({
                                                        required: true
                                                    })}
                                                />
                                            </Grid>
                                            <Grid item md={6}>
                                                <Grid container spacing={0} direction="row">
                                                    <Grid item md={10}>
                                                        <Autocomplete
                                                            fullWidth
                                                            openOnFocus
                                                            onBlur={autoRemoveStage(index)}
                                                            value={stage.procedure}
                                                            getOptionLabel={(procedure: any) => procedure.name}
                                                            options={procedures.data?.laboratory.procedures}
                                                            loading={procedures.loading}
                                                            onChange={changeStage(index, 'procedure')}
                                                            renderInput={(params: RenderInputParams) => (
                                                                <TextField
                                                                    {...params}
                                                                    name={`procedures[${stage.index}]`}
                                                                    autoFocus={(index === form.stages.length - 1) && index !== 0}
                                                                    error={!!procedures.error || errors[`procedures[${stage.index}]`]}
                                                                    label='Procedimento *'
                                                                    inputRef={register({
                                                                        required: true
                                                                    })}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item md={2}>
                                                        <CreateProcedure onCreate={procedures.refetch} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item md={index > 0 ? 3 : 4}>
                                                <TextField
                                                    value={stage.price}
                                                    name={`prices[${stage.index}]`}
                                                    error={errors[`prices[${stage.index}]`]}
                                                    fullWidth
                                                    helperText={stage.price !== Number(stage.procedure?.price || 0) && `${stage.price > Number(stage.procedure?.price || 0) ? "Acréscimo" : "Desconto"} de R$${parseCurrency(stage.price - Number(stage.procedure?.price || 0))}`}
                                                    onChange={changeStage(index, 'price')}
                                                    label="Preço *"
                                                    InputProps={{
                                                        inputComponent: CurrencyFormat as any,
                                                        startAdornment: <InputAdornment position='start'>R$</InputAdornment>,
                                                        onChange: changeStage(index, 'price')
                                                    }}
                                                    inputRef={register({
                                                        required: true,
                                                    })}
                                                />
                                            </Grid>
                                            {index > 0 &&
                                                <Grid item md={1}>
                                                    <IconButton onClick={removeStage(index)}>
                                                        <Icon component={MDI} path={mdiClose} />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        </Grid>
                                    </Grow>
                                </Grid>
                            ))}
                            {addStageButton &&
                                <Grow in={true}>
                                    <Grid item md={12}>
                                        <Button
                                            onClick={addStage}
                                            endIcon={<Icon component={MDI} path={mdiPlus} />}
                                        >Adicionar Estágio</Button>
                                    </Grid>
                                </Grow>
                            }
                            <Grid item md={12}>
                                <TextField
                                    multiline
                                    fullWidth
                                    variant="filled"
                                    label="Descrição (opcional)"
                                    value={form.description}
                                    name="description"
                                    onInput={changeForm}
                                    onChange={changeForm}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <FormControl
                                    error={errors.needColor}
                                >
                                    <FormLabel>Precisa de cor?</FormLabel>
                                    <RadioGroup
                                        value={Boolean(form.needColor).toString()}
                                        row
                                        color="primary"
                                        name="needColor"

                                    >
                                        <FormControlLabel
                                            label="Sim"
                                            control={<Radio
                                                color="primary"
                                                inputRef={register({
                                                    required: true,
                                                    validate: (value) => value === 'true' || value === 'false'
                                                })}
                                            />}
                                            value="true"
                                        />
                                        <FormControlLabel
                                            label="Não"
                                            control={<Radio
                                                color="primary"
                                                inputRef={register({
                                                    required: true,
                                                    validate: (value) => value === 'true' || value === 'false'
                                                })}
                                            />}
                                            value="false"
                                        />
                                    </RadioGroup>
                                    {!!errors.needColor &&
                                        <FormHelperText>É preciso informar se o processo precisa da cor dos dentes do paciente</FormHelperText>
                                    }
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={changeState('dialog', false)}>Cancelar</Button>
                        <Button onClick={handleSubmit(submit)} color="primary" variant="contained">Salvar</Button>
                    </DialogActions>
                </Dialog>
            </form >
        </>
    )
}